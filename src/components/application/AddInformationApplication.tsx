import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { Application } from "../../models/application.model";
import { CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";

const AddInformationApplication = ({ setFormData, formRef }) => {
  const [form] = Form.useForm();
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);

  useEffect(() => {
    const fetchCourseFamily = async () => {
      const cfm = await courseFamilyService.getAll();
      setCoursesFamily(cfm);
    };

    fetchCourseFamily();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: "",
      birthdate: "",
      gender: null,
      email: "",
      phone: "",
      admissionProgramId: null,
      coursesFamilyId: null,
      permanentResidence: "",
    });
  }, [form]);

  const handleFormChange = (changedFields: Partial<Application>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...changedFields,
    }));
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
              name="coursesFamilyName"
              label="Courses Family"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập courses family!",
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
              <Input placeholder="Nhập hộ không thường trú" />
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
      </Form>
    </div>
  );
};

export default AddInformationApplication;
