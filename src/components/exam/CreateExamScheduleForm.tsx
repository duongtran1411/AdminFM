import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  TimePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { ExamScheduleMaster } from "../../models/exam.model";
import examScheduleMasterService from "../../services/exam-service/exam.schedule.master.service";
import { moduleService } from "../../services/module-serice/module.service";
import { ExamType, Module } from "../../models/courses.model";
import moment from "moment";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateExamScheduleForm: React.FC<Props> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [modules, setModules] = useState<Module[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  useEffect(() => {
    fetchModules();
    fetchExamTypes();
  }, []);

  const fetchModules = async () => {
    const response = await moduleService.getAllModules();
    setModules(response.data);
  };

  const fetchExamTypes = async () => {
    const response = await moduleService.getAllExamTypes();
    setExamTypes(response.data);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues: ExamScheduleMaster = {
        module_id: values.module_id,
        exam_type_id: values.exam_type_id,
        exam_date: values.exam_date.format("YYYY-MM-DD"),
        start_time: values.exam_time[0].format("HH:mm:ss"),
        end_time: values.exam_time[1].format("HH:mm:ss"),
        retake_date: values.retake_date.format("YYYY-MM-DD"),
        retake_start_time: values.retake_time[0].format("HH:mm:ss"),
        retake_end_time: values.retake_time[1].format("HH:mm:ss"),
        note: values.note,
      };

      await examScheduleMasterService.create(formattedValues);
      notification.success({ message: "Tạo lịch thi thành công" });
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      notification.error({
        message: "Lỗi khi tạo lịch thi",
        description: error.response.data.error,
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: 500 }}>
          Tạo lịch thi mới
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={700}
      okText="Tạo lịch thi"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        preserve={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="module_id"
              label="Môn thi"
              rules={[{ required: true, message: "Vui lòng chọn môn thi" }]}
            >
              <Select
                showSearch
                placeholder="Chọn môn thi"
                optionFilterProp="children"
                options={modules.map((module) => ({
                  value: module.module_id,
                  label: `${module.code} - ${module.module_name}`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="exam_type_id"
              label="Loại thi"
              rules={[{ required: true, message: "Vui lòng chọn loại thi" }]}
            >
              <Select
                placeholder="Chọn loại thi"
                options={examTypes.map((type) => ({
                  value: type.id,
                  label: type.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="note" label="Ghi chú">
              <Input placeholder="Nhập ghi chú" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Lần thi 1</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="exam_date"
              label="Ngày thi"
              rules={[{ required: true, message: "Vui lòng chọn ngày thi" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày thi (DD/MM/YYYY)"
                suffixIcon={<CalendarOutlined />}
                disabledDate={(current) => {
                  return current && current < moment().startOf("day");
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="exam_time"
              label="Thời gian thi"
              rules={[
                { required: true, message: "Vui lòng chọn thời gian thi" },
              ]}
            >
              <TimePicker.RangePicker
                style={{ width: "100%" }}
                format="HH:mm"
                placeholder={["Giờ bắt đầu", "Giờ kết thúc"]}
                suffixIcon={<ClockCircleOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Lần thi 2</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="retake_date"
              label="Ngày thi lại"
              rules={[
                { required: true, message: "Vui lòng chọn ngày thi lại" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày thi lại (DD/MM/YYYY)"
                suffixIcon={<CalendarOutlined />}
                disabledDate={(current) => {
                  return current && current < moment().startOf("day");
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="retake_time"
              label="Thời gian thi lại"
              rules={[
                { required: true, message: "Vui lòng chọn thời gian thi lại" },
              ]}
            >
              <TimePicker.RangePicker
                style={{ width: "100%" }}
                format="HH:mm"
                placeholder={["Giờ bắt đầu", "Giờ kết thúc"]}
                suffixIcon={<ClockCircleOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateExamScheduleForm;
