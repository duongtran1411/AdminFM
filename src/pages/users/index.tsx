import { Layout, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import TabsMenu from "../../components/student/TabsMenu";
import AddUserButton from "../../components/users/AddUserButton";
import AddUserForm from "../../components/users/AddUserForm";
import UsersTable from "../../components/users/UsersTable";
import useModals from "../../hooks/useModal";
import { Users } from "../../models/users.model";
import { userService } from "../../services/user-service/user.service";
import EditUserForm from "../../components/users/EditUserForm";

const UserPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const fetchUser = async () => {
    try {
      const data = await userService.getAllUser();
      setUsers(data);
    } catch (error) {
      setError("Error loading Users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  const handleDelete = async (uid: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await userService.deleteUser(uid);
          setUsers(users.filter((u) => u.id !== uid));
          notification.success({ message: "User deleted successfully" });
        } catch (error) {
          notification.error({ message: "Error deleting User" });
        }
      },
    });
  };

  // Khi chọn chỉnh sửa, hiển thị form và đặt sinh viên đang chỉnh sửa
  const handleEdit = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      showModal("editUser");
    }
  };

  const onCreateSuccess = () => {
    fetchUser();
  };

  const onUpdateSuccess = () => {
    fetchUser();
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Layout
      className="rounded-lg flex justify-center items-center"
      style={{
        background: "white",
      }}
    >
      <div className="w-full max-w-6xl">
        <div className="flex justify-between flex-wrap">
          <TabsMenu tabItems={[]} />
          <AddUserButton onUserCreated={() => showModal("createUser")} />
        </div>
        <AddUserForm
          isModalVisible={isVisible("createUser")}
          hideModal={() => hideModal("createUser")}
          onUserCreated={onCreateSuccess} // Truyền hàm callback
        />
        <UsersTable
          columns={columns}
          data={users}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      <EditUserForm
        isModalVisible={isVisible("editUser")}
        hideModal={() => hideModal("editUser")}
        user={selectedUser}
        onUpdate={onUpdateSuccess}
      />
    </Layout>
  );
};

export default UserPage;
