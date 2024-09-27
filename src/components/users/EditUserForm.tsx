import { Select, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { userService } from "../../services/user-service/user.service";
import { roleService } from "../../services/role-service/role.service";
import { Users } from "../../models/users.model";

interface EditUserFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  user: Users | null;
  onUpdate: () => void;
}

interface Role {
  id: number;
  name: string;
}

const EditUserForm = ({
  isModalVisible,
  hideModal,
  user,
  onUpdate,
}: EditUserFormProps) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    try {
      const roles = await roleService.getRoles();
      setRoles(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user) {
      // Đặt giá trị của form khi mở modal với dữ liệu của user
      form.setFieldsValue({
        user_id: user.id,
        username: user.username,
        password: user.password,
        role: user.roles,
      });
    }
  }, [user, form]);

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const updatedUser = {
            ...user,
            ...values,
          };
          await userService.updateUser(updatedUser.user_id, updatedUser);
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({ message: "User updated successfully" });
        } catch (error) {
          notification.error({ message: "Error updating user" });
        }
      },
    });
  };

  return (
    <Modal
      title="Edit User"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields(); // Reset các trường form khi đóng modal
        hideModal();
      }}
      okText="Update"
      cancelText="Cancel"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label="User Name"
          rules={[{ required: true, message: "Please input the username!" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input the password !" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item label="Role" name="role" rules={[{ required: true }]}>
          <Select placeholder="Select Role">
            {roles.map((role) => (
              <Select.Option key={role.id} value={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserForm;
