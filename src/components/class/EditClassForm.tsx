// components/class/EditClassForm.tsx
import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";

interface EditClassFormProps {
  visible: boolean;
  onEdit: (values: any) => void;
  onCancel: () => void;
  initialValues: any; // Giá trị ban đầu từ lớp học cần chỉnh sửa
}

const EditClassForm: React.FC<EditClassFormProps> = ({
  visible,
  onEdit,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onEdit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Chỉnh Sửa Lớp Học"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên Lớp"
          rules={[{ required: true, message: "Vui lòng nhập tên lớp" }]}
        >
          <Input placeholder="Nhập tên lớp" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập Nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditClassForm;
