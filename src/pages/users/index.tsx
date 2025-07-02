import { Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import AddUserButton from "../../components/users/AddUserButton";
import AddUserForm from "../../components/users/AddUserForm";
import EditUserForm from "../../components/users/EditUserForm";
import UsersTable from "../../components/users/UsersTable";
import useModals from "../../hooks/useModal";
import { Users } from "../../models/users.model";
import { userService } from "../../services/user-service/user.service";

const UserPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [users, setUsers] = useState<Users[]>([]);
  const [searchUsers, setSearchUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  const fetchUser = async () => {
    try {
      const data = await userService.getAllUser();
      setUsers(data);
      setSearchUsers(data);
    } catch (error) {
      setError("Error loading Users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSearch = (value: string) => {
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(value.toLowerCase()),
    );
    setSearchUsers(filteredUsers);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: ( index: number) => index + 1,
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
      title: "Role",
      dataIndex: "roles",
      key: "roles",
    },
  ];

  const handleDelete = async (uid: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
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
          <AddUserButton onUserCreated={() => showModal("createUser")} />
        </div>

        <Input.Search
          placeholder="Search by username..."
          allowClear
          onSearch={handleSearch}
          style={{ width: 400, marginBottom: 16 }}
        />

        {/* Create User modal */}
        <AddUserForm
          isModalVisible={isVisible("createUser")}
          hideModal={() => hideModal("createUser")}
          onUserCreated={onCreateSuccess}
        />

        {/* User Data Table */}
        <UsersTable
          columns={columns}
          data={searchUsers}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* Edit User modal */}
        <EditUserForm
          isModalVisible={isVisible("editUser")}
          hideModal={() => hideModal("editUser")}
          user={selectedUser}
          onUpdate={onUpdateSuccess}
        />
      </div>
    </div>
  );
};

export default UserPage;
