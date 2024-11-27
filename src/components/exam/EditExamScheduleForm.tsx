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
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ExamType, Module } from "../../models/courses.model";
import { UpdateExamScheduleMaster } from "../../models/exam.model";
import examScheduleMasterService from "../../services/exam-service/exam.schedule.master.service";
import { moduleService } from "../../services/module-serice/module.service";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialData: UpdateExamScheduleMaster | null;
}

const EditExamScheduleForm: React.FC<Props> = ({
  visible,
  onCancel,
  onSuccess,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [modules, setModules] = useState<Module[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [moduleResponse, examTypeResponse] = await Promise.all([
          moduleService.getAllModules(),
          moduleService.getAllExamTypes(),
        ]);
        setModules(moduleResponse.data);
        setExamTypes(examTypeResponse.data);
      } catch (error) {
        notification.error({ message: "Lỗi khi tải dữ liệu" });
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  useEffect(() => {
    if (initialData && visible) {
      form.setFieldsValue({
        module_id: initialData.module?.module_id,
        exam_type_id: initialData.exam_type?.id,
        note: initialData.note,
        exam_date: initialData.exam_date ? moment(initialData.exam_date) : null,
        exam_time:
          initialData.start_time && initialData.end_time
            ? [
                moment(initialData.start_time, "HH:mm:ss"),
                moment(initialData.end_time, "HH:mm:ss"),
              ]
            : null,
        retake_date: initialData.retake_date
          ? moment(initialData.retake_date)
          : null,
        retake_time:
          initialData.retake_start_time && initialData.retake_end_time
            ? [
                moment(initialData.retake_start_time, "HH:mm:ss"),
                moment(initialData.retake_end_time, "HH:mm:ss"),
              ]
            : null,
      });
    }
  }, [initialData, visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!initialData?.id) return;

      const formattedValues = {
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

      await examScheduleMasterService.update(initialData.id, formattedValues);
      notification.success({ message: "Cập nhật lịch thi thành công" });
      onSuccess();
    } catch (error: any) {
      notification.error({
        message: "Lỗi khi cập nhật lịch thi",
        description: error.response?.data?.error || "Đã có lỗi xảy ra",
      });
    }
  };

  const renderFormItems = () => (
    <>
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
      {renderExamTimeFields(
        "exam_date",
        "exam_time",
        "Ngày thi",
        "Thời gian thi",
      )}

      <Divider orientation="left">Lần thi 2</Divider>
      {renderExamTimeFields(
        "retake_date",
        "retake_time",
        "Ngày thi lại",
        "Thời gian thi lại",
      )}
    </>
  );

  const renderExamTimeFields = (
    dateFieldName: string,
    timeFieldName: string,
    dateLabel: string,
    timeLabel: string,
  ) => (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name={dateFieldName}
          label={dateLabel}
          rules={[
            {
              required: true,
              message: `Vui lòng chọn ${dateLabel.toLowerCase()}`,
            },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder={`Chọn ${dateLabel.toLowerCase()} (DD/MM/YYYY)`}
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={timeFieldName}
          label={timeLabel}
          rules={[
            {
              required: true,
              message: `Vui lòng chọn ${timeLabel.toLowerCase()}`,
            },
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
  );

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: 500 }}>
          Chỉnh sửa lịch thi
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={700}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        preserve={false}
      >
        {renderFormItems()}
      </Form>
    </Modal>
  );
};

export default EditExamScheduleForm;
