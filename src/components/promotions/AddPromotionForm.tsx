import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
} from "antd";
import { Promotion } from "../../models/promotions.model";
import PromotionsService from "../../services/promotions-service/promotions.service";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface AddPromotionFormProps {
  visible: boolean;
  hideModal: () => void;
  onPromotionCreated: () => void;
}

const AddPromotionForm: React.FC<AddPromotionFormProps> = ({
  visible,
  hideModal,
  onPromotionCreated,
}) => {
  const [form] = Form.useForm();

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const newPromotion: Promotion = {
        ...values,
        name: values.name,
        description: values.description,
        startDate: values.period[0].format("YYYY-MM-DD"),
        endDate: values.period[1].format("YYYY-MM-DD"),
        discountType: values.discountType,
        discount: values.discount,
        scholarshipQuantity: values.scholarshipQuantity,
        condition: values.condition,
        maxQuantity: values.maxQuantity,
        registrationMethod: values.registrationMethod,
        requiredDocument: values.requiredDocument,
      };

      await PromotionsService.addPromotion(newPromotion);
      notification.success({ message: "Thêm ưu đãi thành công" });
      hideModal();
      onPromotionCreated();
      form.resetFields();
    } catch (error) {
      notification.error({ message: "Lỗi khi thêm ưu đãi" });
    }
  };

  return (
    <Modal
      title="Tạo mới Ưu đãi"
      visible={visible}
      onCancel={hideModal}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="period" label="Thời gian" rules={[{ required: true }]}>
          <RangePicker />
        </Form.Item>
        <Form.Item
          name="discount"
          label="Mức ưu đãi"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item
          name="scholarshipQuantity"
          label="Số lượng học bổng"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="maxQuantity"
          label="Số lượng tối đa"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          name="registrationMethod"
          label="Phương thức đăng ký"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPromotionForm;
