import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import AddApplicationDocumentButton from "../../components/applicationdocuments/AddApplicationDocumentButton";
import AddApplicationDocumentForm from "../../components/applicationdocuments/AddApplicationDocumentForm";
import ApplicationDocumentTable from "../../components/applicationdocuments/ApplicationDocumentTable";
import EditApplicationDocumentForm from "../../components/applicationdocuments/EditApplicationDocumentForm";
import Loading from "../../components/common/loading";
import TabsMenu from "../../components/student/TabsMenu";
import useModals from "../../hooks/useModal";
import { ApplicationDocument } from "../../models/applicationdocument.model";
import { Response } from "../../models/response.model";
import applicationDocumentsService from "../../services/application-documents-service/application.documents.service";

const ApplicationDocumentPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [applicationDocumentsResponse, setApplicationDocumentsResponse] =
    useState<Response<ApplicationDocument[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplicationDocument, setSelectedApplicationDocument] =
    useState<ApplicationDocument | null>(null);

  const fetchApplicationDocument = async () => {
    try {
      const data = await applicationDocumentsService.getAll();
      console.log(data);
      setApplicationDocumentsResponse(data);
    } catch (error) {
      setError("Error loading Application Document");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplicationDocument();
  }, []);

  const menu = (ad: ApplicationDocument) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(ad.id)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        style={{ color: "red" }}
        icon={<DeleteOutlined style={{ color: "red" }} />}
        onClick={() => handleDelete(ad.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Tên thành phần hồ sơ",
      dataIndex: "name",
      key: "name",
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
  ];

  const handleDelete = async (adId: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa thành phần hồ sơ này?",
      okText: "Xóa",
      okType: "danger",
      onOk: async () => {
        try {
          await applicationDocumentsService.delete(adId);
          fetchApplicationDocument();
          notification.success({
            message: "Thành phần hồ sơ đã được xóa thành công!",
          });
        } catch (error) {
          notification.error({
            message: "Lỗi xóa thành phần hồ sơ",
          });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const applicationDocument = applicationDocumentsResponse?.data.find(
      (s) => s.id === id,
    );
    if (applicationDocument) {
      setSelectedApplicationDocument(applicationDocument);
      showModal("editApplicationDocument");
    }
  };

  const onCreateSuccess = () => {
    fetchApplicationDocument();
  };

  const onUpdateSuccess = () => {
    fetchApplicationDocument();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "50%", maxWidth: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <TabsMenu tabItems={[]} />
          <AddApplicationDocumentButton
            onApplicationDocumentCreated={() =>
              showModal("createApplicationDocument")
            }
          />
        </div>
        <AddApplicationDocumentForm
          isModalVisible={isVisible("createApplicationDocument")}
          hideModal={() => hideModal("createApplicationDocument")}
          onApplicationDocumentCreated={onCreateSuccess}
        />
        <ApplicationDocumentTable
          data={applicationDocumentsResponse?.data || []}
          columns={columns}
        />
      </div>
      <EditApplicationDocumentForm
        isModalVisible={isVisible("editApplicationDocument")}
        hideModal={() => hideModal("editApplicationDocument")}
        applicationDocument={selectedApplicationDocument}
        onUpdate={onUpdateSuccess}
      />
    </div>
  );
};

export default ApplicationDocumentPage;
