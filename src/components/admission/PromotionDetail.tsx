import { Modal, Typography, Space, Divider, Row, Col } from "antd";
import { Promotion } from "../../models/promotions.model";

interface PromotionDetailProps {
  isModalVisible: boolean;
  hideModal: () => void;
  promotion: Promotion | null;
}

const { Title, Text } = Typography;

const PromotionDetail = ({
  isModalVisible,
  hideModal,
  promotion,
}: PromotionDetailProps) => {
  return (
    <Modal
      title="Chi tiết chương trình khuyến mãi"
      visible={isModalVisible}
      onCancel={hideModal}
      footer={null}
      width={600} // Tùy chỉnh chiều rộng của modal
    >
      {promotion ? (
        <div>
          <Title level={4}>{promotion.name}</Title>
          <Divider />
          <Space direction="vertical" size="middle">
            <Text strong>Mô tả:</Text>
            <Text>{promotion.description || "Không có mô tả."}</Text>
          </Space>
          <Divider />
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Row>
              <Col span={8}>
                <Text strong>Ngày bắt đầu:</Text>
              </Col>
              <Col span={16}>
                <Text>
                  {promotion.startDate
                    ? new Date(promotion.startDate).toLocaleDateString("vi-VN")
                    : "Không xác định"}
                </Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Ngày kết thúc:</Text>
              </Col>
              <Col span={16}>
                <Text>
                  {promotion.endDate
                    ? new Date(promotion.endDate).toLocaleDateString("vi-VN")
                    : "Không xác định"}
                </Text>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <Text strong>Mức giảm giá:</Text>
              </Col>
              <Col span={16}>
                <Text>{promotion.discount || "Không xác định"}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Số lượng học bổng:</Text>
              </Col>
              <Col span={16}>
                <Text>{promotion.scholarshipQuantity || "Không xác định"}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Số lượng tối đa:</Text>
              </Col>
              <Col span={16}>
                <Text>{promotion.maxQuantity || "Không xác định"}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Phương thức đăng ký:</Text>
              </Col>
              <Col span={16}>
                <Text>{promotion.registrationMethod || "Không xác định"}</Text>
              </Col>
            </Row>
          </Space>
        </div>
      ) : (
        <p>Không có chi tiết chương trình khuyến mãi.</p>
      )}
    </Modal>
  );
};

export default PromotionDetail;
