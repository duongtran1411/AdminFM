import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Table } from "antd";
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
    if (forms.length === 1) return;
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
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-6">
        <Form
          ref={formRef}
          form={parentForms}
          layout="vertical"
          onValuesChange={handleFormChange}
          className="space-y-6"
        >
          <Table
            pagination={false}
            showHeader={true}
            dataSource={forms}
            columns={[
              {
                title: (
                  <span>
                    Họ và tên <span className="text-red-500">*</span>
                  </span>
                ),
                key: "name",
                render: (_, __, index) => (
                  <Form.Item
                    name={["parents", index, "name"]}
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên!" },
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="Nhập họ và tên"
                      className="rounded-md"
                    />
                  </Form.Item>
                ),
              },
              {
                title: (
                  <span>
                    Số điện thoại <span className="text-red-500">*</span>
                  </span>
                ),
                key: "phone",
                render: (_, __, index) => (
                  <Form.Item
                    name={["parents", index, "phone"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      className="rounded-md"
                    />
                  </Form.Item>
                ),
              },
              {
                title: "Nghề nghiệp",
                key: "job",
                render: (_, __, index) => (
                  <Form.Item name={["parents", index, "job"]} noStyle>
                    <Input
                      placeholder="Nhập nghề nghiệp"
                      className="rounded-md"
                    />
                  </Form.Item>
                ),
              },
              {
                title: (
                  <span>
                    Giới tính <span className="text-red-500">*</span>
                  </span>
                ),
                key: "gender",
                render: (_, __, index) => (
                  <Form.Item
                    name={["parents", index, "gender"]}
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính!" },
                    ]}
                    noStyle
                  >
                    <Select placeholder="Chọn giới tính" className="rounded-md">
                      <Select.Option value="Nam">Nam</Select.Option>
                      <Select.Option value="Nữ">Nữ</Select.Option>
                      <Select.Option value="Khác">Khác</Select.Option>
                    </Select>
                  </Form.Item>
                ),
              },
              {
                title: "Email",
                key: "email",
                render: (_, __, index) => (
                  <Form.Item
                    name={["parents", index, "email"]}
                    rules={[{ type: "email", message: "Email không hợp lệ!" }]}
                    noStyle
                  >
                    <Input placeholder="Nhập Email" className="rounded-md" />
                  </Form.Item>
                ),
              },
              {
                key: "action",
                render: (_, record) =>
                  forms.length > 1 && (
                    <Button
                      type="text"
                      danger
                      onClick={() => removeParentForm(record.key)}
                      icon={<DeleteOutlined />}
                    />
                  ),
              },
            ]}
          />
        </Form>

        <Button
          onClick={addParentForm}
          type="link"
          className="text-blue-500 pl-0 mt-4"
        >
          + Thêm người giám hộ
        </Button>
      </div>
    </div>
  );
};

export default AddInformationParent;
