import { Col, Form, Input, Row } from "antd";
import { useEffect } from "react";
import { StudentProfile } from "../../models/student.profile.model";

const AddStudentProfileForm = ({ setFormData, formRef }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (
      !form.getFieldsValue(true) ||
      Object.keys(form.getFieldsValue(true)).length === 0
    ) {
      form.setFieldsValue({
        highSchool: "",
        university: "",
        workingCompany: "",
        companyAddress: "",
        companyPosition: "",
        portfolio: "",
      });
    }
  }, [form]);

  const handleFormChange = (changedFields: Partial<StudentProfile>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...changedFields,
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">Thông tin lý lịch</h1>
      <Form
        ref={formRef}
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="highSchool" label="Trường THPT">
              <Input placeholder="Nhập trường THPT" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trường Đại học" name="university">
              <Input placeholder="Nhập trường Đại học" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="workingCompany" label="Công ty">
              <Input placeholder="Nhập công ty" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="companyAddress" label="Địa chỉ công ty">
              <Input placeholder="Nhập địa chỉ công ty" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="companyPosition" label="Chức vụ">
              <Input placeholder="Nhập chức vụ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="portfolio" label="Link portfolio">
              <Input placeholder="Nhập link portfolio" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddStudentProfileForm;
