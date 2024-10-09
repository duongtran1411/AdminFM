import { useEffect, useState } from "react";
import useModals from "../../hooks/useModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Modal, notification } from "antd";
import { AiOutlineMore } from "react-icons/ai";
import Loading from "../../components/common/loading";
import PromotionsService from "../../services/promotions-service/promotions.service";
import { Promotion } from "../../models/promotions.model";

const PromotionPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const fetchPromotions = async () => {
    try {
      const data = await PromotionsService.getPromotions();
      setPromotions(data);
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
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Course Code",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button
            type="text"
            icon={<AiOutlineMore style={{ fontSize: "20px" }} />}
            style={{ float: "right" }}
          />
        </Dropdown>
      ),
    },
    // Thêm các column nếu cần
  ];

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Course?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await PromotionsService.deletePromotion(id);
          setPromotions(promotions.filter((c) => c.id !== id));
          notification.success({ message: "Promotion deleted successfully" });
        } catch (error) {
          notification.error({ message: "Error deleting Promotion" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const promotion = promotions.find((c) => c.id === id);
    if (promotion) {
      setSelectedPromotion(promotion);
      showModal("editPromotion");
    }
  };

  const onCreateSuccess = () => {
    fetchPromotions();
  };

  const onUpdateSuccess = () => {
    fetchPromotions();
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
            isModalVisible={isVisible("createPromotion")}
            hideModal={() => hideModal("createPromotion")}
            onPromotionCreated={onCreateSuccess}
          />

          <PromotionsTable columns={columns} data={promotions} />

          <EditPromotionForm
            isModalVisible={isVisible("editPromotion")}
            hideModal={() => hideModal("editPromotion")}
            promotion={selectedPromotion}
            onUpdate={onUpdateSuccess}
          />
        </div>
      </div>
    </>
  );};

export default PromotionPage;
