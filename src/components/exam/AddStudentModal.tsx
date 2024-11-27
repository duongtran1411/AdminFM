import { Form, Input, Modal, Table, Tag, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Student } from "../../models/student.model";
import examRoomService from "../../services/exam-service/exam.room.service";
import { studentService } from "../../services/student-service/student.service";

interface AddStudentsModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  examRoomId: number;
  capacity: number;
  currentStudentCount: number;
}

const AddStudentsModal: React.FC<AddStudentsModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  examRoomId,
  capacity,
  currentStudentCount,
}) => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (visible) {
      fetchStudents();
    }
  }, [visible]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.findAll();
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      notification.error({ message: "Lỗi khi tải danh sách sinh viên" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndFilter = (searchValue: string) => {
    let result = students;

    if (searchValue) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          s.studentId
            ?.toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
      );
    }

    setFilteredStudents(result);
  };

  useEffect(() => {
    handleSearchAndFilter(searchValue);
  }, [searchValue, students]);

  const handleSubmit = async () => {
    try {
      if (selectedRowKeys.length + currentStudentCount > capacity) {
        notification.error({
          message: `Số lượng sinh viên không được vượt quá ${capacity}`,
        });
        return;
      }

      setLoading(true);
      await examRoomService.addStudentsToRoom(
        examRoomId,
        selectedRowKeys as number[],
      );

      notification.success({ message: "Thêm sinh viên thành công" });
      form.resetFields();
      setSelectedRowKeys([]);
      onSuccess();
    } catch (error) {
      notification.error({ message: "Lỗi khi thêm sinh viên" });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã SV",
      dataIndex: "studentId",
      key: "studentId",
      render: (studentId: string | null) => <Tag>{studentId || "N/A"}</Tag>,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: Student) => ({
      disabled: false,
      name: record.name,
    }),
  };

  return (
    <Modal
      title="Thêm sinh viên vào phòng thi"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Thêm"
      cancelText="Hủy"
      width={800}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item>
          <Input.Search
            placeholder="Tìm kiếm theo Mã SV hoặc Tên"
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: "100%" }}
            disabled={loading}
          />
        </Form.Item>
      </Form>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Modal>
  );
};

export default AddStudentsModal;
