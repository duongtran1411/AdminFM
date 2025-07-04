import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Modal, notification, Tag, Tooltip, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import Loading from "../../components/common/loading";
import AddPromotionButton from "../../components/promotions/AddPromotionButton";
import AddPromotionForm from "../../components/promotions/AddPromotionForm";
import EditPromotionForm from "../../components/promotions/EditPromotionForm";
import PromotionsTable from "../../components/promotions/PromotionsTable";
import useModals from "../../hooks/useModal";
import { Promotion } from "../../models/promotions.model";
import { Response } from "../../models/response.model";
import PromotionsService from "../../services/promotions-service/promotions.service";

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

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Promotion?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await PromotionsService.deletePromotion(id);
          setPromotionsResponse((prev) =>
            prev
              ? {
                  ...prev,
                  data: prev.data.filter((promotion) => promotion.id !== id),
                }
              : null,
          );
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
      setSelectedPromotion(promotion);
      showModal("editPromotion");
    }
  };

  const handleView = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    showModal("viewPromotion");
  };

  const renderColumns = () => [
    {
      title: "Tên",
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
      title: "Khoảng thời gian",
      key: "period",
      render: (_: string, record: Promotion) => (
        <span>
          {moment(record.startDate).format("DD/MM/YYYY")} -{" "}
          {moment(record.endDate).format("DD/MM/YYYY")}
        </span>
      ),
    },
    // {
    //   title: "Giảm giá",
    //   dataIndex: "discount",
    //   key: "discount",
    // },
    {
      title: "Số lượng",
      dataIndex: "scholarshipQuantity",
      key: "scholarshipQuantity",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: string, record: Promotion) => {
        const now = moment();
        const start = moment(record.startDate);
        const end = moment(record.endDate);

        if (now.isBefore(start)) return <Tag color="blue">Upcoming</Tag>;
        if (now.isAfter(end)) return <Tag color="red">Expired</Tag>;
        return <Tag color="green">Active</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record: Promotion) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
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
          onPromotionCreated={fetchPromotions}
        />

        <PromotionsTable
          columns={renderColumns()}
          data={promotionsResponse?.data || []}
        />

        <Modal
          title={<Title level={3}>Details</Title>}
          open={isVisible("viewPromotion")}
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
              {/* <Paragraph>
                <strong>Giảm giá: </strong> {selectedPromotion.discount}%
              </Paragraph> */}
              <Paragraph>
                <strong>Khoảng thời gian: </strong>
                {moment(selectedPromotion.startDate).format(
                  "DD/MM/YYYY",
                )} - {moment(selectedPromotion.endDate).format("DD/MM/YYYY")}
              </Paragraph>
              <Paragraph>
                <strong>Số lượng: </strong>
                {selectedPromotion.scholarshipQuantity} /
                {selectedPromotion.maxQuantity}
              </Paragraph>
              <Paragraph>
                <strong>Phương thức đăng ký: </strong>
                {selectedPromotion.registrationMethod}
              </Paragraph>
            </Typography>
          )}
        </Modal>

        <EditPromotionForm
          isModalVisible={isVisible("editPromotion")}
          hideModal={() => hideModal("editPromotion")}
          promotion={selectedPromotion}
          onUpdate={fetchPromotions}
        />
      </div>
    </div>
  );
};

export default PromotionPage;
