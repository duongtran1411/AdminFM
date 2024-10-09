import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Menu,
  Modal,
  notification,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import Loading from "../../components/common/loading";
import AddPromotionButton from "../../components/promotions/AddPromotionButton";
import AddPromotionForm from "../../components/promotions/AddPromotionForm";
import PromotionsTable from "../../components/promotions/PromotionsTable";
import useModals from "../../hooks/useModal";
import { Promotion } from "../../models/promotions.model";
import { Response } from "../../models/response.model";
import PromotionsService from "../../services/promotions-service/promotions.service";
import EditPromotionForm from "../../components/promotions/EditPromotionForm";

const { Title, Paragraph } = Typography;

const PromotionPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [promotionsResponse, setPromotionsResponse] = useState<Response<
    Promotion[]
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );

  const fetchPromotions = async () => {
    try {
      const response = await PromotionsService.getPromotions();
      setPromotionsResponse(response);
    } catch (error) {
      setError("Error loading promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const menu = (promotion: Promotion) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<EyeOutlined />}
        onClick={() => handleView(promotion)}
      >
        View Details
      </Menu.Item>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(promotion.id)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        style={{ color: "red" }}
        key="delete"
        icon={<DeleteOutlined style={{ color: "red" }} />}
        onClick={() => handleDelete(promotion.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Period",
      key: "period",
      render: (_: string, record: Promotion) => (
        <span>
          {moment(record.startDate).format("DD/MM/YYYY")} -{" "}
          {moment(record.endDate).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: string, record: Promotion) => {
        const now = moment();
        const start = moment(record.startDate);
        const end = moment(record.endDate);
        if (now.isBefore(start)) {
          return <Tag color="blue">Upcoming</Tag>;
        } else if (now.isAfter(end)) {
          return <Tag color="red">Expired</Tag>;
        } else {
          return <Tag color="green">Active</Tag>;
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Promotion) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button
            type="text"
            icon={<AiOutlineMore style={{ fontSize: "20px" }} />}
          />
        </Dropdown>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Promotion?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await PromotionsService.deletePromotion(id);
          if (promotionsResponse) {
            const updatedPromotions = promotionsResponse.data.filter(
              (p) => p.id !== id,
            );
            setPromotionsResponse({
              ...promotionsResponse,
              data: updatedPromotions,
            });
          }
          notification.success({ message: "Promotion deleted successfully" });
        } catch (error) {
          notification.error({ message: "Error deleting Promotion" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const promotion = promotionsResponse?.data.find((p) => p.id === id);
    if (promotion) {
      setSelectedPromotion(promotion);  // Uncomment this line
      showModal("editPromotion");
    }
  };

  const onCreateSuccess = () => {
    fetchPromotions();
  };

  const onUpdateSuccess = () => {
    fetchPromotions();
  };

  const handleView = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    showModal("viewPromotion");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "16px",
            }}
          >
            <AddPromotionButton
              onPromotionCreated={() => showModal("createPromotion")}
            />
          </div>

          <AddPromotionForm
            visible={isVisible("createPromotion")}
            hideModal={() => hideModal("createPromotion")}
            onPromotionCreated={onCreateSuccess}
          />

          <PromotionsTable
            columns={columns}
            data={promotionsResponse ? promotionsResponse.data : []}
          />

          <Modal
            title={<Title level={3}>Details</Title>}
            visible={isVisible("viewPromotion")}
            onCancel={() => hideModal("viewPromotion")}
            footer={null}
            width={600}
          >
            {selectedPromotion && (
              <Typography>
                <Paragraph>
                  <strong>Tên: </strong> {selectedPromotion.name}
                </Paragraph>
                <Paragraph>
                  <strong>Mô tả: </strong> {selectedPromotion.description}
                </Paragraph>
                <Paragraph>
                  <strong>Loại ưu đãi: </strong>
                  {selectedPromotion.discountType}
                </Paragraph>
                <Paragraph>
                  <strong>Ưu đãi: </strong> {selectedPromotion.discount}%
                </Paragraph>
                <Paragraph>
                  <strong>Thời gian: </strong>
                  {moment(selectedPromotion.startDate).format("DD/MM/YYYY")} -{"  "}
                  {moment(selectedPromotion.endDate).format("DD/MM/YYYY")}
                </Paragraph>
                <Paragraph>
                  <strong>Số lượng: </strong>
                  {selectedPromotion.scholarshipQuantity} /{" "}
                  {selectedPromotion.maxQuantity}
                </Paragraph>
                <Paragraph>
                  <strong>Cách thức đăng ký: </strong>
                  {selectedPromotion.registrationMethod}
                </Paragraph>
                <Paragraph>
                  <strong>Điều kiện: </strong> {selectedPromotion.condition}
                </Paragraph>
                <Paragraph>
                  <strong>Hồ sơ yêu cầu: </strong>
                  {selectedPromotion.requiredDocument}
                </Paragraph>
              </Typography>
            )}
          </Modal>

          <EditPromotionForm
            isModalVisible={isVisible("editPromotion")}
            hideModal={() => hideModal("editPromotion")}
            promotion={selectedPromotion}
            onUpdate={onUpdateSuccess}
          />
        </div>
      </div>
    </>
  );
};

export default PromotionPage;
