import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import AddApplicationButton from "../../components/application/AddApplicationButton";
import ApplicationTable from "../../components/application/ApplicationTable";
import Loading from "../../components/common/loading";
import TabsMenu from "../../components/student/TabsMenu";
import { Application } from "../../models/application.model";
import { Response } from "../../models/response.model";
import applicationService from "../../services/application-service/application.service";

const ApplicationPage = () => {
  const navigate = useNavigate();
  const { admissionId } = useParams();
  //   const { isVisible, showModal, hideModal } = useModals();
  const [applicationResponse, setApplicationResponse] = useState<Response<
    Application[]
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //   const [selectedApplication, setSelectedApplication] =
  //     useState<Application | null>(null);

  const fetchApplication = async () => {
    try {
      const data = await applicationService.getAll();
      setApplicationResponse(data);
    } catch (error) {
      setError("Error loading Application");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplication();
  }, []);

  const menu = (_: Application) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        // onClick={() => handleEdit(ad.id)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        style={{ color: "red" }}
        icon={<DeleteOutlined style={{ color: "red" }} />}
        // onClick={() => handleDelete(ad.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Ngày Sinh",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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

  //   const handleDelete = async () => {
  //     Modal.confirm({
  //       title: "Bạn có chắc chắn muốn xóa thành phần hồ sơ này?",
  //       okText: "Xóa",
  //       okType: "danger",
  //       onOk: async () => {
  //         try {
  //             await applicationDocumentsService.delete(adId);
  //             fetchApplicationDocument();
  //           notification.success({
  //             message: "Thành phần hồ sơ đã được xóa thành công!",
  //           });
  //         } catch (error) {
  //           notification.error({
  //             message: "Lỗi xóa thành phần hồ sơ",
  //           });
  //         }
  //       },
  //     });
  //   };

  //   const handleEdit = (id: number) => {
  //     const application = applicationResponse?.data.find((s) => s.id === id);
  //     if (application) {
  //       setSelectedApplication(application);
  //       showModal("editApplication");
  //     }
  //   };

  //   const onCreateSuccess = () => {
  //     fetchApplication();
  //   };

  //   const onUpdateSuccess = () => {
  //     fetchApplication();
  //   };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleApplicationCreate = () => {
    navigate(`/admission/${admissionId}/application`);
  };

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
          <TabsMenu tabItems={[]} />
          <AddApplicationButton onApplicationCreate={handleApplicationCreate} />
        </div>
        <ApplicationTable
          data={applicationResponse?.data || []}
          columns={columns}
        />
      </div>
      {/* <EditApplicationForm
        isModalVisible={isVisible("editApplication")}
        hideModal={() => hideModal("editApplication")}
        application={selectedApplication}
        onUpdate={onUpdateSuccess}
      /> */}
    </div>
  );
};

export default ApplicationPage;
