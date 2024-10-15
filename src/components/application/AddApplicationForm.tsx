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

const AddApplicationForm = () => {
  const formRef = useRef<FormInstance>(null);
  const [formData, setFormData] = useState<Application>({
    id: 0,
    name: "",
    email: "",
    gender: "",
    birthDate: "",
    phone: "",
    status: ApplicationStatus.WAITING,
  });
  const [attachedDocuments, setAttachedDocuments] = useState<{
    [key: string]: File;
  }>({});

  // Hàm reset file đã đính kèm
  const resetAttachedDocuments = () => {
    setAttachedDocuments({});
  };

  const handleSave = async () => {
    try {
      if (formRef.current) {
        await formRef.current.validateFields();

        const applications = await applicationService.getAll();
        const newId = applications.data.length + 1;
        const newFormData = {
          ...formData,
          id: newId,
          birthdate: dayjs(formData.birthDate).format("YYYY-MM-DD"),
        };
        await applicationService.add(newFormData);

        if (attachedDocuments && newFormData) {
          for (const [documentType, file] of Object.entries(
            attachedDocuments,
          )) {
            await attachedDocumentService.add(
              documentType,
              newFormData.id,
              file,
            );
          }

          notification.success({
            message: "Thêm mới hồ sơ tuyển sinh thành công",
          });

          // Reset form fields and attached documents after successful save
          formRef.current.resetFields();
          setFormData({
            id: 0,
            name: "",
            email: "",
            gender: "",
            birthDate: "",
            phone: "",
            status: ApplicationStatus.WAITING,
          });
          resetAttachedDocuments();
        }
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
