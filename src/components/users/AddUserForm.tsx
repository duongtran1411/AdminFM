import { Form, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { roleService } from "../../services/role-service/role.service";
import { Users } from "../../models/users.model";
import { userService } from "../../services/user-service/user.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onUserCreated: () => void;
}

interface Role {
  role_id: number;
  role_name: string;
}

const AddUserForm = ({ isModalVisible, hideModal, onUserCreated }: Props) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    try {
      const roleData = await roleService.getRoles();
      setRoles(roleData);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newUser: Users = {
        ...values,
      };
      await userService.create(newUser);
      await onUserCreated();
      notification.success({ message: "User created successfully!" });
      form.resetFields();
      hideModal();
    } catch (error: any) {
      notification.error({
        message: "User Creation Failed!",
        description: "Username already exists. Please choose a different one.",
      });
    }
  };

  return (
    <Modal
      title="Create New User"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Create"
      cancelText="Cancel"
      centered
    >
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        style={{ marginBottom: "20px" }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: "Please input the Username!",
            },
          ]}
        >
          <Input placeholder="Enter Username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input the password!",
            },
          ]}
        >
          <Input.Password placeholder="Enter Password" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please input the email!",
            },
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
        >
          <Input placeholder="Enter Email" />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="Select Role">
            {roles.map((role) => (
              <Select.Option key={role.role_id} value={role.role_name}>
                {" "}
                {role.role_name}{" "}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
