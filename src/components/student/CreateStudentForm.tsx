import { Form, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Freshmen } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";
import Loading from "../common/loading";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onStudentCreated: () => void;
}

const CreateStudentForm = ({
  isModalVisible,
  hideModal,
  onStudentCreated,
}: Props) => {
  const [form] = Form.useForm();
  const { classId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [freshman, setFreshman] = useState<Freshmen[]>([]);
  const [filteredFreshman, setFilteredFreshman] = useState<Freshmen[]>([]);

  const fetchFreshman = async () => {
    try {
      const data = await studentService.findStudentsWithoutClass();
      setFreshman(data.data);
      setFilteredFreshman(data.data);
    } catch (error) {
      setError("Lỗi khi lọc sinh viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreshman();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ classId });
  }, [classId, form]);

  const handleSearch = (value: string) => {
    const searchResult = freshman.filter(
      (f) =>
        f.name.toLowerCase().includes(value.toLowerCase()) ||
        f.studentId.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredFreshman(searchResult);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleSubmit = async () => {
    try {
      const selectedStudentIds = form.getFieldValue("students");
      await studentService.createStudentWithClass(
        Number(classId),
        selectedStudentIds,
      );
      notification.success({ message: "Thêm mới sinh viên thành công!" });
      form.resetFields();
      onStudentCreated();
      hideModal();
    } catch (error) {
      setError("Lỗi khi tạo sinh viên trong lớp: " + error);
    }
  };

  return (
    <Modal
      title="Thêm mới sinh viên"
      open={isModalVisible}
      onCancel={hideModal}
      okText="Tạo mới"
      onOk={handleSubmit}
      cancelText="Huỷ"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item name="students" label="Chọn Sinh Viên">
          <Select
            mode="multiple"
            placeholder="Tìm kiếm và chọn Sinh Viên"
            style={{ width: "100%", marginTop: "10px" }}
            showSearch
            onSearch={handleSearch}
            filterOption={false}
          >
            {filteredFreshman.map((f) => (
              <Select.Option key={f.id} value={f.id}>
                {f.name} - {f.studentId}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateStudentForm;
