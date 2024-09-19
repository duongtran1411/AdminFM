// components/class/AddClassForm.tsx
import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface AddClassFormProps {
  visible: boolean;
  onAdd: (values: any) => void;
  onCancel: () => void;
}

const AddClassForm: React.FC<AddClassFormProps> = ({
  visible,
  onAdd,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onAdd(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Thêm Lớp Học"
      visible={visible}
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
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClassForm;
