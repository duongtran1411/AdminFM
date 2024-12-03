import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest, LoginRequestPayload } from "../../redux/auth/actions";
import { RootState } from "../../redux/store";
import SocialSignInButtons from "./SocialSignInButtons";

const { Text, Title } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/students");
    }
  }, [authState.isAuthenticated]);

  const onSubmit = (values: LoginFormData) => {
    console.log(values);
    const payload: LoginRequestPayload = {
      username: values.username,
      password: values.password,
    };
    dispatch(loginRequest(payload));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <Title level={2} className="text-2xl font-bold mb-2">
          Login
        </Title>
        <Text className="text-gray-600">Welcome back</Text>
      </div>
      <Form
        name="login_form"
        initialValues={{
          remember: true,
        }}
        onFinish={onSubmit}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="username"
          rules={[
            {
              type: "string",
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-500 mr-2" />}
            placeholder="Email"
            className="w-full h-12 text-lg border-gray-300 rounded-lg"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-500 mr-2" />}
            placeholder="Password"
            className="w-full h-12 text-lg border-gray-300 rounded-lg"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={authState.loading}
            type="primary"
            htmlType="submit"
            className="w-full h-10 mb-4"
          >
            Log in
          </Button>
          <div className="flex justify-center items-center mb-4">
            <Link
              to={"/auth/forgot-pass"}
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Text className="text-gray-600">Don't have an account?</Text>
            <Link
              to={"/auth/signup"}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign up now
            </Link>
          </div>
          <SocialSignInButtons />
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
