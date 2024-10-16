import { Button, notification } from "antd";
import AddAttachedDocumentForm from "./AddAttachedDocumentForm";
import AddInformationApplication from "./AddInformationApplication";
import { useState, useRef } from "react";
import applicationService from "../../services/application-service/application.service";
import attachedDocumentService from "../../services/attached-document-service/attached.document.service";
import { ApplicationStatus } from "../../models/application.status.enum.model";
import { Application } from "../../models/application.model";
import { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

const initialFormData: Application = {
  name: "",
  email: "",
  gender: "",
  birthdate: "",
  phone: "",
  status: ApplicationStatus.WAITING,
  admissionProgramId: 0,
};

const AddApplicationForm = () => {
  const { admissionId } = useParams();
  console.log(admissionId);
  const formRef = useRef<FormInstance>(null);
  const [formData, setFormData] = useState<Application>(initialFormData);
  const [attachedDocuments, setAttachedDocuments] = useState<{
    [key: string]: File;
  }>({});

  // Hàm reset file đã đính kèm
  const resetAttachedDocuments = () => {
    setAttachedDocuments({});
  };

  const resetForm = () => {
    formRef.current?.resetFields();
    setFormData(initialFormData);
    resetAttachedDocuments();
  };

  const saveDocuments = async (newId: number) => {
    for (const [documentType, file] of Object.entries(attachedDocuments)) {
      console.log(newId);
      await attachedDocumentService.add(documentType, newId, file);
    }
  };

  const handleSave = async () => {
    try {
      if (formRef.current) {
        await formRef.current.validateFields();

        const newFormData = {
          ...formData,
          admissionProgramId: admissionId ? Number(admissionId) : 0,
          birthdate: dayjs(formData.birthdate).format("YYYY-MM-DD"),
        };
        const newApplication = await applicationService.add(newFormData);
        console.log(newApplication);
        await saveDocuments(newApplication.data.id!);

        notification.success({
          message: "Thêm mới hồ sơ tuyển sinh thành công",
        });

        resetForm();
      } else {
        console.error("Form reference is not set.");
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <AddAttachedDocumentForm setAttachedDocument={setAttachedDocuments} />
      <AddInformationApplication setFormData={setFormData} formRef={formRef} />
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSave}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default AddApplicationForm;
