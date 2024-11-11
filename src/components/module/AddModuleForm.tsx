import { Form, Input, InputNumber, Modal, notification } from "antd";
import { Module } from "../../models/courses.model";
import { moduleService } from "../../services/module-serice/module.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onModuleCreated: () => void;
}

const AddModuleForm = ({
  isModalVisible,
  hideModal,
  onModuleCreated,
}: Props) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    const newModule: Module = {
      ...values,
    };
    await moduleService.add(newModule);
    onModuleCreated();
    notification.success({ message: "Thêm mới môn học thành công!" });
    form.resetFields();
    hideModal();
  };

  return (
    <Modal
      title="Thêm mới môn học"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Thêm mới"
      cancelText="Hủy"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="module_name"
          label="Tên môn học"
          rules={[{ required: true, message: "Vui lòng nhập tên môn học!" }]}
        >
          <Input placeholder="Nhập tên môn học" />
        </Form.Item>
        <Form.Item
          name="code"
          label="Code"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập code!",
            },
          ]}
        >
          <Input placeholder="Nhập code" />
        </Form.Item>
        <Form.Item
          name="exam_type"
          label="Loại thi"
          rules={[{ required: true, message: "Vui lòng nhập loại thi!" }]}
        >
          <Input placeholder="Nhập loại thi" />
        </Form.Item>
        <Form.Item
          name="number_of_classes"
          label="Số buổi học"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số buổi học!",
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập số buổi học"
            style={{ width: "50%" }}
          />
        </Form.Item>
        <Form.Item
          name="term_number"
          label="Term"
          rules={[{ required: true, message: "Vui lòng nhập Term!" }]}
        >
          <InputNumber placeholder="Nhập Term Number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModuleForm;
