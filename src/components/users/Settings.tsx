import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import * as jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Users } from "../../models/users.model";
import { userService } from "../../services/user-service/user.service";

const { Title } = Typography;

const Settings = () => {
  const [profile, setProfile] = useState<Users | null>(null);
  const [form] = useForm();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: any = jwt_decode.jwtDecode(token);
        const userId = decoded.sub;

        // Make sure userProfile is treated as ProfileData
        const userProfile: Users = await userService.getUserById(userId);

        setProfile(userProfile);
        form.setFieldsValue({ username: userProfile.username });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async () => {
    const { oldPassword, newPassword } = form.getFieldsValue();
    if (oldPassword !== profile?.password) {
      notification.error({ message: "Old password is incorrect!" });
      return;
    }
    const response = await userService.changePassword(
      profile!!.id,
      newPassword,
    );
    form.resetFields();
    if (response) {
      notification.success({ message: "Password changed successfully!" });
    }
  };
  return (
    <div className="bg-white ml-10 mt-10 p-8 shadow-lg max-w-xl flex">
      <div style={{ width: "100px", height: "100px" }}>
        <Image
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
        />
      </div>

      <Form
        className="ml-20"
        name="signup_form"
        initialValues={{
          remember: true,
        }}
        onFinish={onSubmit}
        layout="vertical"
        requiredMark="optional"
        form={form}
      >
        <Title level={3} className="text-2xl font-bold mb-2">
          Change a password
        </Title>
        <Form.Item name="username">
          <Input
            prefix={<UserOutlined className="text-gray-500 mr-2" />}
            className="w-full h-12 text-lg border-gray-300 rounded-lg"
            readOnly
            value={profile?.username}
          />
        </Form.Item>
        <Form.Item
          name="oldPassword"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-500 mr-2" />}
            placeholder="Old Password"
            className="w-full h-12 text-lg border-gray-300 rounded-lg"
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-500 mr-2" />}
            placeholder="New Password"
            className="w-full h-12 text-lg border-gray-300 rounded-lg"
          />
        </Form.Item>
        <Form.Item
          name="rePassword"
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!"),
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-500 mr-2" />}
            placeholder="Re-Type New Password"
            className="w-full h-12 text-lg border-gray-300 rounded-lg"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-20 h-12">
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Settings;
