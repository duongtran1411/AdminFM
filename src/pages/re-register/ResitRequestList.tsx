import { HistoryOutlined, EditOutlined } from "@ant-design/icons";
import {
  Card,
  Space,
  Table,
  Tag,
  theme,
  Tooltip,
  Typography,
  Button,
} from "antd";
import moment from "moment";
import { ResitRequestWithDetails } from "../../hooks/useResitRequest";
import { useResitRequests } from "../../hooks/useResitRequest";
import { ResitRequestModal } from "../../components/student-resit/ResitRequestModal";

const { Title } = Typography;

export default function ResitRequestList() {
  const { token } = theme.useToken();
  const {
    resitRequests,
    loading,
    isModalVisible,
    editNote,
    editStatus,
    handleEdit,
    handleUpdate,
    setIsModalVisible,
    setEditNote,
    setEditStatus,
  } = useResitRequests();

  const columns = [
    {
      title: "Mã SV",
      dataIndex: "student",
      key: "student",
    },
    {
      title: "Mã môn học",
      dataIndex: "moduleCode",
      key: "moduleCode",
      render: (moduleCode: string, record: ResitRequestWithDetails) => (
        <Tooltip title={record.moduleCode}>
          <span>{moduleCode}</span>
        </Tooltip>
      ),
    },
    {
      title: "Lớp",
      dataIndex: "className",
      key: "className",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          PENDING: "gold",
          APPROVED: "green",
          REJECTED: "red",
        };
        const labels: Record<string, string> = {
          PENDING: "Đang chờ duyệt",
          APPROVED: "Đã duyệt",
          REJECTED: "Từ chối",
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note: string) => note || "-",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: ResitRequestWithDetails) => (
        <Tooltip title="Cập nhật trạng thái">
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        background: token.colorBgLayout,
        minHeight: "100vh",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          margin: "0 auto",
          borderRadius: 8,
          overflow: "auto",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: 8, fontSize: "1.5rem" }}>
              <HistoryOutlined /> Lịch sử đăng ký học lại
            </Title>
          </div>

          <Table
            columns={columns}
            dataSource={resitRequests}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} bản ghi`,
              responsive: true,
            }}
            bordered
            scroll={{ x: "max-content" }}
            style={{ width: "100%" }}
          />
        </Space>

        <ResitRequestModal
          isVisible={isModalVisible}
          editStatus={editStatus}
          editNote={editNote}
          onOk={handleUpdate}
          onCancel={() => setIsModalVisible(false)}
          onStatusChange={setEditStatus}
          onNoteChange={setEditNote}
        />
      </Card>
    </div>
  );
}
