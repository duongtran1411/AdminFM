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
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-6">
        <Form
          ref={formRef}
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          className="space-y-6"
        >
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Thông tin học vấn
            </h2>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="highSchool" label="Trường THPT">
                  <Input
                    placeholder="Nhập trường THPT"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Trường Đại học" name="university">
                  <Input
                    placeholder="Nhập trường Đại học"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Thông tin công việc
            </h2>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="workingCompany" label="Công ty">
                  <Input
                    placeholder="Nhập tên công ty"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="companyPosition" label="Chức vụ">
                  <Input placeholder="Nhập chức vụ" className="rounded-md" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="companyAddress" label="Địa chỉ công ty">
                  <Input
                    placeholder="Nhập địa chỉ công ty"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="portfolio" label="Link portfolio">
                  <Input
                    placeholder="Nhập link portfolio"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddStudentProfileForm;
