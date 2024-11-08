import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Divider } from "antd";
import { useEffect, useState } from "react";

const AddInformationParent = ({ setFormData, formRef }) => {
  const [forms, setForms] = useState([{ key: 0 }]);
  const [parentForms] = Form.useForm();

  useEffect(() => {
    if (!parentForms.getFieldValue("parents")) {
      parentForms.setFieldsValue({
        parents: [
          {
            name: "",
            gender: null,
            email: "",
            phone: "",
            job: "",
          },
        ],
      });
    }
  }, [parentForms]);

  const handleFormChange = (_: any, allFields: any) => {
    const parentValues = forms.map((_, index) => ({
      ...allFields.parents[index],
    }));
    setFormData(parentValues);
  };

  const addParentForm = () => {
    setForms([...forms, { key: forms.length }]);
  };

  const removeParentForm = (keyToRemove: number) => {
    const newForms = forms.filter((form) => form.key !== keyToRemove);
    setForms(newForms);

    const currentValues = parentForms.getFieldsValue();
    const newParents = currentValues.parents.filter(
      (_, index) => index !== keyToRemove,
    );

    parentForms.setFieldsValue({ parents: newParents });
    setFormData(newParents);
  };

  return (
    <div className="p-6 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Thông tin cha/mẹ</h1>
      </div>
      <Form
        ref={formRef}
        form={parentForms}
        layout="vertical"
        onValuesChange={handleFormChange}
      >
        {forms.map((form, index) => (
          <div key={form.key}>
            {index > 0 && <Divider className="my-8" />}
            <div className="relative">
              {index > 0 && (
                <Button
                  type="text"
                  danger
                  className="absolute -top-4 right-0"
                  onClick={() => removeParentForm(form.key)}
                >
                  <DeleteOutlined />
                </Button>
              )}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={["parents", index, "name"]}
                    label="Họ và tên cha/mẹ"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên!" },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name={["parents", index, "phone"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại của bạn" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={["parents", index, "job"]}
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
                    name={["parents", index, "gender"]}
                    label="Giới tính"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính!" },
                    ]}
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
                    name={["parents", index, "email"]}
                    label="Email"
                    rules={[{ type: "email", message: "Email không hợp lệ!" }]}
                  >
                    <Input placeholder="Nhập Email" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </Form>
      <Button
        onClick={addParentForm}
        type="dashed"
        className="hover:bg-gray-50 flex justify-center items-center gap-2"
        block
      >
        <PlusOutlined />
        Thêm phụ huynh
      </Button>
    </div>
  );
};

export default AddInformationParent;
