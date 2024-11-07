import { Button, notification } from "antd";
import { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdmissionProgram } from "../../models/admission.model";
import { Application } from "../../models/application.model";
import { ApplicationStatus } from "../../models/enum/application.status.enum";
import applicationService from "../../services/application-service/application.service";
import attachedDocumentService from "../../services/attached-document-service/attached.document.service";
import Loading from "../common/loading";
import NavigateBack from "../shared/NavigateBack";
import AddAttachedDocumentForm from "./AddAttachedDocumentForm";
import AddInformationApplication from "./AddInformationApplication";
import AddInformationParent from "./AddInfomationParent";
import { Parent } from "../../models/parent.model";
import parentService from "../../services/parent-service/parent.service";

const initialFormData: Application = {
  name: "",
  email: "",
  gender: "",
  birthdate: "",
  phone: "",
  status: ApplicationStatus.WAITING,
  permanentResidence: "",
  admissionProgram: {} as AdmissionProgram,
};

const AddApplicationForm = () => {
  const { admissionId } = useParams();
  const formRef = useRef<FormInstance>(null);
  const [formData, setFormData] = useState<Application>(initialFormData);
  const [parentData, setParentData] = useState<Parent>();
  const [attachedDocuments, setAttachedDocuments] = useState<{
    [key: string]: File;
  }>({});
  const [resetUploadKey, setResetUploadKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const resetAttachedDocuments = () => {
    setAttachedDocuments({});
    setResetUploadKey((prevKey) => prevKey + 1);
  };

  const resetForm = () => {
    formRef.current?.resetFields();
    setFormData(initialFormData);
    resetAttachedDocuments();
  };

  const saveDocuments = async (newId: number) => {
    for (const [documentType, file] of Object.entries(attachedDocuments)) {
      await attachedDocumentService.add(documentType, newId, file);
    }
  };

  const handleSave = async () => {
    try {
      if (formRef.current) {
        setLoading(true);

        await formRef.current.validateFields();
        const newParentData = {
          ...parentData,
        };
        await parentService.add(newParentData);

        const newFormData = {
          ...formData,
          admissionProgramId: admissionId ? Number(admissionId) : 0,
          birthdate: dayjs(formData.birthdate).format("YYYY-MM-DD"),
        };

        const newApplication = await applicationService.add(newFormData);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div
            onClick={() => navigate(`/admission/${admissionId}`)}
            className="cursor-pointer mb-4"
          >
            <NavigateBack />
          </div>

          <AddAttachedDocumentForm
            setAttachedDocument={setAttachedDocuments}
            resetUploadKey={resetUploadKey}
          />
          <AddInformationApplication
            setFormData={setFormData}
            formRef={formRef}
          />
          <AddInformationParent setFormData={setParentData} formRef={formRef} />
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSave}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Lưu
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddApplicationForm;
