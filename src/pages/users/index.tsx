import React, { useEffect, useState } from "react";
import { Modal, Input, notification } from "antd";
import type { TableProps } from "antd";
import AddUserButton from "../../components/users/AddUserButton";
import useModals from "../../hooks/useModal";
import AddUserForm from "../../components/users/AddUserForm";
import UsersTable from "../../components/users/UsersTable";
import { userService } from "../../services/user-service/user.service";
import EditUserForm from "../../components/users/EditUserForm";

interface UserList {
  user_id: number;
  username: string;
  password: string;
  email: string;
  role: string;
}

const UserPage: React.FC = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [users, setUsers] = useState<UserList[]>([]);
  const [searchUser, setSearchUser] = useState<UserList[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserList | null>(null);
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

  // const handleEdit = async () => {
  //   try {
  //     const values = await editForm.validateFields();
  //     if (editUser) {
  //       const updatedUser: UserList = {
  //         user_id: editUser.user_id,
  //         username: values.username,
  //         password: values.password,
  //         email: values.email,
  //         role: values.role,
  //       };
  //       await userService.updateUser(editUser.user_id, updatedUser);
  //       setIsEditModalVisible(false);
  //       form.resetFields();
  //       fetchUsers();
  //     }
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //   }

  // };
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
          await userRo;
          setUsers(users.filter((user) => user.user_id !== userId));
          notification.success({ message: "User deleted successfully" });
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

  // const menu = (user: UserList) => (
  //   <Menu>
  //     <Menu.Item key="edit" onClick={() => showEditModal(user)}>
  //       Edit
  //     </Menu.Item>
  //     <Menu.Item key="delete" onClick={() => handleDelete(user.user_id)}>
  //       Delete
  //     </Menu.Item>
  //   </Menu>
  // );

  // const showEditModal = (user: UserList) => {
  //   console.log(user);
  //   setEditingUser(user);
  //   editForm.setFieldsValue({
  //     username: user.username,
  //     password: user.password,
  //     email: user.email,
  //     role: user.role,
  //   });
  //   setIsEditModalVisible(true);
  // };

  const columns: TableProps<UserList>["columns"] = [
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
        <UsersTable
          columns={columns}
          data={searchUser}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
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
