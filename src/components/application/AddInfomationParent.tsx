import { Col, Form, Input, Row, Select } from "antd";
import { useEffect } from "react";
import { Parent } from "../../models/parent.model";

const AddInformationParent = ({ setFormData, formRef }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: "",
      gender: null,
      email: "",
      phone: "",
      job: "",
    });
  }, [form]);

  const handleFormChange = (changedFields: Partial<Parent>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...changedFields,
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">Thông tin cha/mẹ</h1>
      <Form
        ref={formRef}
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Họ và tên cha/mẹ"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại của bạn" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="job"
              label="Nghề nghiệp"
              rules={[
                {
                  message: "Vui lòng nhập nghề nghiệp!",
                },
              ]}
            >
              <Input placeholder="Nhập nghề nghiệp" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nữ">Nữ</Select.Option>
                <Select.Option value="Khác">Khác</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: "email", message: "Email không hợp lệ!" }]}
            >
              <Input placeholder="Nhập Email" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddInformationParent;
