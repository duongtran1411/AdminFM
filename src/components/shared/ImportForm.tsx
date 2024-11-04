import {
  CloseOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Col, Modal, Row, Spin, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import { useState } from "react";

interface ImportModalProps {
  isModalVisible: boolean;
  hideModal: () => void;
  handleUpload: (file: RcFile) => void; // Sửa đổi tham số để truyền file
}

const ImportForm = ({
  isModalVisible,
  hideModal,
  handleUpload,
}: ImportModalProps) => {
  const [file, setFile] = useState<any | null>(null); // Lưu trữ file trong state
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm xử lý khi file được chọn
  const handleChange = (info: any) => {
    if (info) {
      setFile(info.file.originFileObj); // Lưu trữ file vào state
      setFileName(shortenFileName(info.file.name));
    }
  };

  // Hàm xử lý khi người dùng nhấn nút Xóa
  const handleClear = () => {
    setFile(null); // Xóa file đã chọn khỏi state
    setFileName(null);
  };

  const handleUploadClick = async () => {
    if (!file) {
      console.error("Chưa chọn file");
      return;
    }

    setLoading(true);
    try {
      await handleUpload(file);
    } catch (error) {
      console.error("Tải lên thất bại:", error);
    } finally {
      setLoading(false);
      handleClear();
      hideModal();
    }
  };

  // Hàm rút ngắn tên file
  const shortenFileName = (name: string) => {
    const maxLength = 20; // Độ dài tối đa của tên file
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + "...";
    }
    return name;
  };

  return (
    <Modal
      title="Nhập File Excel"
      open={isModalVisible}
      onCancel={hideModal}
      footer={null}
      closeIcon={false}
    >
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin tip="Đang tải lên..." />
          </div>
        ) : !fileName ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Upload
              customRequest={() => {}}
              maxCount={1}
              showUploadList
              onChange={handleChange}
              accept=".xls,.xlsx" // Chỉ cho phép chọn file Excel
            >
              <Button icon={<UploadOutlined />}>Nhấp để Tải lên</Button>
            </Upload>
          </div>
        ) : (
          <Row
            align="middle"
            justify="space-between"
            style={{
              border: "1px dashed #999999",
              borderRadius: 8, // Border radius để bo góc
              padding: 8, // Padding bên trong thẻ
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Col>
              <Row align="middle">
                <Col>
                  <FileExcelOutlined
                    style={{ fontSize: 28, color: "#28a745", margin: "0 12px" }}
                  />
                </Col>
                <Col>
                  <div style={{ textAlign: "left" }}>
                    <span
                      style={{
                        display: "block",
                        fontWeight: "bold",
                      }}
                    >
                      {fileName}
                    </span>
                    <span
                      style={{ display: "block", color: "#888", fontSize: 12 }}
                    >
                      Excel
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col>
              <Button
                icon={<CloseOutlined />}
                onClick={handleClear}
                type="text"
              />
            </Col>
          </Row>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {fileName && !loading && (
            <div>
              <Button onClick={hideModal} type="default" className="m-1">
                Đóng
              </Button>
              <Button onClick={handleUploadClick} type="primary">
                Tải lên
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImportForm;
