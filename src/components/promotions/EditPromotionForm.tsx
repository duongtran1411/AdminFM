import { Form, Input, Modal, notification, DatePicker, InputNumber, Select } from "antd";
import { useEffect } from "react";
import { Promotion } from "../../models/promotions.model";
import PromotionsService from "../../services/promotions-service/promotions.service";
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface EditPromotionFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  promotion: Promotion | null;
  onUpdate: () => void;
}

const EditPromotionForm = ({
  isModalVisible,
  hideModal,
  promotion,
  onUpdate,
}: EditPromotionFormProps) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (promotion) {
      form.setFieldsValue({
        name: promotion.name,
        description: promotion.description,
        period: [moment(promotion.startDate), moment(promotion.endDate)],
        discountType: promotion.discountType,
        discount: promotion.discount,
        scholarshipQuantity: promotion.scholarshipQuantity,
        condition: promotion.condition,
        maxQuantity: promotion.maxQuantity,
        registrationMethod: promotion.registrationMethod,
        requiredDocument: promotion.requiredDocument,
      });
    }
  }, [promotion, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (promotion) {
        const { period, ...rest } = values;
        const updatedPromotion: Partial<Promotion> = {
          ...rest,
          startDate: period[0].format('YYYY-MM-DD'),
          endDate: period[1].format('YYYY-MM-DD'),
        };
        
        await PromotionsService.updatePromotion(promotion.id, updatedPromotion);
        hideModal();
        onUpdate();
        notification.success({ message: "Cập nhật ưu đãi thành công" });
      }
    } catch (error) {
      notification.error({ message: "Lỗi khi cập nhật ưu đãi" });
    }
  };

  return (
    <Modal
      title="Chỉnh sửa Ưu đãi"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        hideModal();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="period" label="Thời gian" rules={[{ required: true }]}>
          <RangePicker />
        </Form.Item>
        <Form.Item name="discountType" label="Loại ưu đãi" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="percentage">Giảm giá theo phần trăm</Select.Option>
            <Select.Option value="fixed">Giảm giá cố định</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="discount" label="Mức ưu đãi" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item name="scholarshipQuantity" label="Số lượng học bổng" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item name="condition" label="Điều kiện" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="maxQuantity" label="Số lượng tối đa" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item name="registrationMethod" label="Phương thức đăng ký" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="requiredDocument" label="Hồ sơ yêu cầu" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPromotionForm;
