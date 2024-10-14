import { Checkbox, Form, Modal, notification, Table } from "antd";
import { useEffect, useState } from "react";
import { AdmissionProgram } from "../../models/admission.model";
import { Response } from "../../models/response.model";
import admissionService from "../../services/admission-program-service/admission.service";
import applicationDocumentsService from "../../services/application-documents-service/application.documents.service";
import { ApplicationDocument } from "../../models/applicationdocument.model";

interface EditDocumentFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  applicationDocument: Response<AdmissionProgram> | null;
  onUpdate: () => void;
}

const EditDocumentInAdmissionProgramForm = ({
  isModalVisible,
  hideModal,
  applicationDocument,
  onUpdate,
}: EditDocumentFormProps) => {
  const [form] = Form.useForm();

  const [selectedApplicationDocuments, setSelectedApplicationDocuments] =
    useState<number[]>([]);

  const [allApplicationDocuments, setAllApplicationDocuments] = useState<
    ApplicationDocument[]
  >([]);

  useEffect(() => {
    const fetchAllApplicationDocuments = async () => {
      const response = await applicationDocumentsService.getAll();
      setAllApplicationDocuments(response.data);
    };

    fetchAllApplicationDocuments();
  }, []);

  useEffect(() => {
    if (applicationDocument) {
      form.setFieldsValue({
        name: applicationDocument.data.applicationDocuments,
      });

      setSelectedApplicationDocuments(
        applicationDocument.data.applicationDocuments.map((doc) => doc.id),
      );
    }
  }, [applicationDocument, form]);

  const handleOk = async () => {
    if (!applicationDocument) {
      console.error("Application document is null");
      return;
    }

    try {
      await admissionService.updateDocumentInApplicationProgram(
        applicationDocument.data.id,
        selectedApplicationDocuments,
      );
      onUpdate();
      hideModal();
      notification.success({
        message: "Cập nhật tài liệu trong chương trình thành công",
      });
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };

  const columns = [
    {
      title: "Tài liệu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: string, record: any) => (
        <Checkbox
          checked={selectedApplicationDocuments.includes(record.key)}
          onChange={() => {
            const newSelected = selectedApplicationDocuments.includes(
              record.key,
            )
              ? selectedApplicationDocuments.filter((id) => id !== record.key)
              : [...selectedApplicationDocuments, record.key];
            setSelectedApplicationDocuments(newSelected);
          }}
        />
      ),
    },
  ];

  const dataSource = allApplicationDocuments.map((doc) => ({
    key: doc.id,
    name: doc.name,
  }));

  return (
    <Modal
      title="Thành phần hồ sơ"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        hideModal();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      centered
    >
      <Form form={form} layout="vertical">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey="key"
        />
      </Form>
    </Modal>
  );
};

export default EditDocumentInAdmissionProgramForm;
