import React, { useEffect, useState } from "react";
import { Modal, Input, notification } from "antd";
import type { TableProps } from "antd";
import AddUserButton from "../../components/users/AddUserButton";
import useModals from "../../hooks/useModal";
import AddUserForm from "../../components/users/AddUserForm";
import UsersTable from "../../components/users/UsersTable";
import { userService } from "../../services/user-service/user.service";
import EditUserForm from "../../components/users/EditUserForm";
import { Users } from "../../models/users.model";

const UserPage: React.FC = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [users, setUsers] = useState<Users[]>([]);
  const [searchUser, setSearchUser] = useState<Users[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUser();
      setUsers(data);
      setSearchUser(data);
    } catch (error) {
      setError("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onCreateSuccess = () => {
    fetchUsers();
  };

  const onUpdateSuccess = () => {
    fetchUsers();
  };

  const handleEdit = (id: number) => {
    const user = users.find((s) => s.user_id === id);
    if (user) {
      setSelectedUser(user);
      showModal("editUser");
    }
  };

  const handleDelete = async (userId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await userService.deleteUser(userId);
          setUsers(users.filter((user) => user.user_id !== userId));
          notification.success({ message: "User deleted successfully" });
          fetchUsers();
        } catch (error) {
          notification.error({ message: "Error deleting user" });
        }
      },
    });
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

  const handleSearch = (txt: string) => {
    const searchValue = txt.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchValue) ||
        (user.email && user.email.toLowerCase().includes(searchValue)),
    );
    setSearchUser(filtered);
  };

  const columns: TableProps<Users>["columns"] = [
    {
      title: "Username",
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
      dataIndex: "role",
      key: "role",
    },
  ];

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
          {/* Button Add User */}
          <AddUserButton onUserCreated={() => showModal("createUser")} />
        </div>
        <Input.Search
          placeholder="Search users"
          allowClear
          onSearch={handleSearch}
          style={{ width: 400, marginBottom: 16 }}
        />

        {/* Create user modal */}
        <AddUserForm
          isModalVisible={isVisible("createUser")}
          hideModal={() => hideModal("createUser")}
          onUserCreated={onCreateSuccess}
        />

        {/* User Data Table */}
        <UsersTable
          columns={columns}
          data={searchUser}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* Edit user modal */}
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
