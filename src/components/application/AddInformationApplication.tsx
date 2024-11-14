import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Checkbox,
  Table,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import { CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import priorityService from "../../services/priority-service/priority.service";
import { Priority } from "../../models/priority.model";

interface PriorityData {
  id: number;
  priorityId: number | null;
  description: string;
}

const AddInformationApplication = ({ setFormData, formRef }) => {
  const [form] = Form.useForm();
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [isSpecialCare, setIsSpecialCare] = useState(false);
  const [priorityOptions, setPriorityOptions] = useState<Priority[]>([]);
  const [priorityData, setPriorityData] = useState<PriorityData[]>([]);

  useEffect(() => {
    const fetchCourseFamily = async () => {
      const cfm = await courseFamilyService.getAll();
      setCoursesFamily(cfm);
    };
    fetchCourseFamily();
  }, []);

  useEffect(() => {
    const fetchPriorityOptions = async () => {
      const priorities = await priorityService.getAll();
      setPriorityOptions(priorities.data);
    };
    fetchPriorityOptions();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: "",
      birthdate: "",
      gender: null,
      email: "",
      phone: "",
      admissionProgramId: null,
      courses_family_id: null,
      permanentResidence: "",
      cardId: "",
    });
  }, [form]);

  const handleFormChange = () => {
    const formData = {
      ...form.getFieldsValue(),
      tick: isSpecialCare,
      intensiveCareList: priorityData.map((priority) => ({
        priorityId: priority.priorityId,
        description: priority.description,
      })),
    };
    setFormData(formData);
  };

  const handleAddPriority = () => {
    setPriorityData([
      ...priorityData,
      { id: Date.now(), priorityId: null, description: "" },
    ]);
  };

  const handleRemovePriority = (id: number) => {
    setPriorityData(priorityData.filter((priority) => priority.id !== id));
  };

  const handlePriorityChange = (id: number, field: string, value: any) => {
    setPriorityData(
      priorityData.map((priority) =>
        priority.id === id ? { ...priority, [field]: value } : priority,
      ),
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">Thông tin cá nhân</h1>
      <Form
        ref={formRef}
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại của bạn" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="cardId"
              label="Card ID"
              rules={[{ required: true, message: "Vui lòng nhập card ID!" }]}
            >
              <Input placeholder="Nhập card ID" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nữ">Nữ</Select.Option>
                <Select.Option value="Khác">Khác</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="birthdate"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="courses_family_id"
              label="Courses Family"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn courses family!",
                },
              ]}
            >
              <Select placeholder="Chọn Courses Family">
                {coursesfamily.map((c) => (
                  <Select.Option
                    key={c.course_family_id}
                    value={c.course_family_id}
                  >
                    {c.course_family_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="permanentResidence"
              label="Hộ khẩu thường trú"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập hộ không thường trú!",
                },
              ]}
            >
              <Input placeholder="Nhập hộ khẩu thường trú" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập Email" />
            </Form.Item>
          </Col>
        </Row>
        <Checkbox
          checked={isSpecialCare}
          onChange={(e) => {
            const checked = e.target.checked;
            setIsSpecialCare(checked);
            const formData = {
              ...form.getFieldsValue(),
              tick: checked,
              intensiveCareList: priorityData.map((priority) => ({
                priorityId: priority.priorityId,
                description: priority.description,
              })),
            };

            setFormData(formData);
          }}
        >
          Chăm sóc đặc biệt
        </Checkbox>

        {isSpecialCare && (
          <>
            <Table dataSource={priorityData} pagination={false} rowKey="id">
              <Table.Column
                title="Tên diện ưu tiên"
                dataIndex="priorityId"
                render={(value, record: PriorityData) => (
                  <Select
                    value={value}
                    onChange={(val) =>
                      handlePriorityChange(record.id, "priorityId", val)
                    }
                    style={{ width: "100%" }}
                  >
                    {priorityOptions.map((option) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              <Table.Column
                title="Mô tả"
                dataIndex="description"
                width={400}
                render={(text, record: PriorityData) => (
                  <Input
                    value={text}
                    onChange={(e) =>
                      handlePriorityChange(
                        record.id,
                        "description",
                        e.target.value,
                      )
                    }
                  />
                )}
              />
              <Table.Column
                title="Action"
                render={(_, record: PriorityData) => (
                  <Button onClick={() => handleRemovePriority(record.id)}>
                    Xoá
                  </Button>
                )}
              />
            </Table>
            <Button onClick={handleAddPriority}>Thêm diện ưu tiên</Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default AddInformationApplication;
