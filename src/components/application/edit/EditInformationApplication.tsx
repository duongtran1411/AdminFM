import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CoursesFamily } from "../../../models/courses.model";
import { Priority } from "../../../models/priority.model";
import courseFamilyService from "../../../services/course-family-service/course.family.service";
import priorityService from "../../../services/priority-service/priority.service";

interface EditInformationApplicationProps {
  setFormData: (data: any) => void;
  formRef: any;
  applicationData?: any;
  priorityData: Priority[];
  setPriorityData: React.Dispatch<React.SetStateAction<Priority[]>>;
}

const EditInformationApplication = ({
  setFormData,
  formRef,
  applicationData,
  priorityData,
  setPriorityData,
}: EditInformationApplicationProps) => {
  const [form] = Form.useForm();
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [priorityToDelete, setPriorityToDelete] = useState<number | null>(null);
  const [isSpecialCare, setIsSpecialCare] = useState(false);
  const [allPriorities, setAllPriorities] = useState<Priority[]>([]);

  useEffect(() => {
    if (applicationData) {
      form.setFieldsValue({
        name: applicationData.name,
        email: applicationData.email,
        gender: applicationData.gender,
        birthdate: dayjs(applicationData.birthdate),
        phone: applicationData.phone,
        cardId: applicationData.cardId,
        permanentResidence: applicationData.permanentResidence,
        course_family_id: applicationData.coursesFamily?.course_family_id,
      });

      if (
        applicationData.intensiveCare &&
        applicationData.intensiveCare.length > 0
      ) {
        setIsSpecialCare(true);
        const priorityData = applicationData.intensiveCare.map((care) => ({
          id: care.priority?.id,
          priorityId: care.priority?.id,
          description: care.description,
          name: care.priority?.name,
          isSelected: true,
        }));
        setPriorityData(priorityData);
      }
    }

    const fetchInitialData = async () => {
      const coursesResponse = await courseFamilyService.getAll();
      setCoursesFamily(coursesResponse);
    };

    fetchInitialData();
  }, [applicationData, form]);

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const response = await priorityService.getAll();
        setAllPriorities(response.data);
      } catch (error) {
        console.error("Error fetching priorities:", error);
      }
    };

    fetchPriorities();
  }, []);

  const handleFormChange = (changedValues: any, _: any) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handlePriorityChange = (id: number, field: string, value: any) => {
    setPriorityData((prev) =>
      prev.map((priority) =>
        priority.id === id ? { ...priority, [field]: value } : priority,
      ),
    );

    setFormData((prevData) => ({
      ...prevData,
      intensiveCare: priorityData
        .filter((item) => item.isSelected)
        .map((item) => ({
          description: item.description,
          priority: {
            id: item.id,
            priorityId: item.priorityId,
            name: item.name,
            description: item.description,
          },
        })),
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          <i>Thông tin cá nhân</i>
        </h2>
      </div>

      <div className="p-6">
        <Form
          ref={formRef}
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          className="space-y-6"
        >
          <div className="p-2 bg-gray-50 rounded-lg">
            <h2 className="text-md font-medium text-gray-700 mb-4">
              Thông tin cơ bản
            </h2>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" className="rounded-md" />
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
                  <Input
                    placeholder="Nhập số điện thoại của bạn"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="cardId"
                  label="Card ID"
                  rules={[
                    { required: true, message: "Vui lòng nhập card ID!" },
                  ]}
                >
                  <Input placeholder="Nhập card ID" className="rounded-md" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính!" },
                  ]}
                >
                  <Select placeholder="Chọn giới tính" className="rounded-md">
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                    <Select.Option value="Khác">Khác</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="birthdate"
                  label="Ngày sinh"
                  rules={[
                    { required: true, message: "Vui lòng nhập ngày sinh!" },
                  ]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <h2 className="text-md font-medium text-gray-700 mb-4">
              Thông tin liên hệ
            </h2>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Nhập Email" className="rounded-md" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="permanentResidence"
                  label="Hộ khẩu thường trú"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập hộ khẩu thường trú!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập hộ khẩu thường trú"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <h2 className="text-md font-medium text-gray-700 mb-4">
              Thông tin học tập
            </h2>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="course_family_id"
                  label="Chương trình học"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn chương trình học!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn chương trình học"
                    className="rounded-md"
                  >
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
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-4">
              <Checkbox
                checked={isSpecialCare}
                onChange={(e) => {
                  setIsSpecialCare(e.target.checked);
                  if (!e.target.checked) {
                    setPriorityData([]);
                  }
                }}
                className="mr-2"
              />
              <span className="text-md font-medium text-gray-700">
                Chăm sóc đặc biệt
              </span>
            </div>

            <div className="mt-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Danh sách diện ưu tiên
                </h3>
                <Table
                  dataSource={allPriorities}
                  pagination={false}
                  rowKey={(record) => record.id?.toString()}
                  className="rounded-lg border border-gray-200 mb-4"
                >
                  <Table.Column
                    title="Tên diện ưu tiên"
                    dataIndex="name"
                    key="name"
                    width="30%"
                  />
                  <Table.Column
                    title="Mô tả"
                    key="description"
                    width="40%"
                    render={(_, record: Priority) => {
                      const selectedPriority = priorityData.find(
                        (p) => p.id === record.id,
                      );
                      return (
                        <Input
                          value={selectedPriority?.description || ""}
                          onChange={(e) =>
                            handlePriorityChange(
                              record.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Nhập mô tả"
                          className="rounded-md"
                          disabled={!selectedPriority}
                        />
                      );
                    }}
                  />
                  <Table.Column
                    title="Chọn"
                    key="isSelected"
                    width="10%"
                    align="center"
                    render={(_, record: Priority) => (
                      <Checkbox
                        checked={priorityData.some((p) => p.id === record.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPriorityData((prev) => [
                              ...prev,
                              {
                                id: record.id,
                                priorityId: record.id,
                                name: record.name,
                                description: "",
                                isSelected: true,
                              },
                            ]);
                          } else {
                            setPriorityData((prev) =>
                              prev.filter((p) => p.id !== record.id),
                            );
                          }
                        }}
                      />
                    )}
                  />
                </Table>
              </div>

              <Button type="link" className="text-blue-500 pl-0">
                + Thêm diện ưu tiên khác
              </Button>
            </div>
          </div>
        </Form>
      </div>

      <Modal
        title="Xác nhận xóa"
        open={priorityToDelete !== null}
        onCancel={() => setPriorityToDelete(null)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa diện ưu tiên này không?</p>
      </Modal>
    </div>
  );
};

export default EditInformationApplication;
