import { Button, notification } from "antd";
import { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AdmissionProgram } from "../../models/admission.model";
import { Application } from "../../models/application.model";
import { ApplicationStatus } from "../../models/enum/application.status.enum";
import { Parent } from "../../models/parent.model";
import { StudentProfile } from "../../models/student.profile.model";
import applicationService from "../../services/application-service/application.service";
import attachedDocumentService from "../../services/attached-document-service/attached.document.service";
import parentService from "../../services/parent-service/parent.service";
import studentProfileService from "../../services/student-profile-service/student.profile.service";
import Loading from "../common/loading";
import NavigateBack from "../shared/NavigateBack";
import AddAttachedDocumentForm from "./AddAttachedDocumentForm";
import AddInformationParent from "./AddInfomationParent";
import AddInformationApplication from "./AddInformationApplication";
import AddStudentProfileForm from "./AddStudentProfileForm";
import ApplicationTabsMenu from "./TabsMenu";

const initialFormData: Application = {
  name: "",
  email: "",
  gender: "",
  birthdate: "",
  phone: "",
  cardId: "",
  status: ApplicationStatus.WAITING,
  permanentResidence: "",
  admissionProgram: {} as AdmissionProgram,
  tick: true,
  intensiveCareList: [],
};

const AddApplicationForm = () => {
  const { admissionId } = useParams();
  const formRef = useRef<FormInstance>(null);
  const [formData, setFormData] = useState<Application>(initialFormData);
  const [parentData, setParentData] = useState<Parent[]>([]);
  const [studentProfileData, setStudentProfileData] =
    useState<StudentProfile>();
  const [attachedDocuments, setAttachedDocuments] = useState<{
    [key: string]: File;
  }>({});
  const [resetUploadKey, setResetUploadKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("1");

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
        const newStudentProfileData = {
          ...studentProfileData,
        };
        await studentProfileService.add(newStudentProfileData);
        for (const parent of parentData) {
          const newParentData = {
            ...parent,
          };
          await parentService.add(newParentData);
        }
        const newFormData = {
          ...formData,
          admissionProgramId: admissionId ? Number(admissionId) : 0,
          birthdate: dayjs(formData.birthdate).format("YYYY-MM-DD"),
          tick: formData.tick,
          intensiveCareList: formData.intensiveCareList
            ? formData.intensiveCareList.map((item) => ({
                ...item,
                description: item.description,
              }))
            : [],
        };
        const newApplication = await applicationService.add(newFormData);
        await saveDocuments(newApplication.data.id!);
        notification.success({
          message: "Thêm mới hồ sơ tuyển sinh thành công",
        });
        resetForm();
      } else {
        console.error("Bạn chưa nhập đủ thông tin.");
      }
    } catch (error) {
      console.error("Xác thực không thành công:", error);
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
          <NavigateBack />

          <AddAttachedDocumentForm
            setAttachedDocument={setAttachedDocuments}
            resetUploadKey={resetUploadKey}
          />
          <AddInformationApplication
            setFormData={setFormData}
            formRef={formRef}
          />
          <ApplicationTabsMenu onTabChange={setActiveTab} />
          {activeTab === "1" && (
            <AddInformationParent
              setFormData={(data) => setParentData(data)}
              formRef={formRef}
            />
          )}
          {activeTab === "2" && (
            <AddStudentProfileForm
              setFormData={(data) => setStudentProfileData(data)}
              formRef={formRef}
            />
          )}
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
