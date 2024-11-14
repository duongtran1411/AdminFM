import { Button, notification } from "antd";
import { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Application } from "../../models/application.model";
import { Parent } from "../../models/parent.model";
import { StudentProfile } from "../../models/student.profile.model";
import applicationService from "../../services/application-service/application.service";
import attachedDocumentService from "../../services/attached-document-service/attached.document.service";
import Loading from "../common/loading";
import NavigateBack from "../shared/NavigateBack";
import AddAttachedDocumentForm from "./AddAttachedDocumentForm";
import ApplicationTabsMenu from "./TabsMenu";
import EditInfomationParent from "./edit/EditInfomationParent";
import EditInformationApplication from "./edit/EditInformationApplication";
import EditStudentProfileForm from "./edit/EditStudentProfileForm";

const EditApplicationForm = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const formRef = useRef<FormInstance>(null);
  const [formData, setFormData] = useState<Application | null>(null);
  const [parentData, setParentData] = useState<Parent[]>([]);
  const [studentProfileData, setStudentProfileData] =
    useState<StudentProfile>();
  const [attachedDocuments, setAttachedDocuments] = useState<{
    [key: string]: File;
  }>({});
  const [resetUploadKey, setResetUploadKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (applicationId) {
        setLoading(true);
        try {
          const response = await applicationService.getById(
            Number(applicationId),
          );
          setFormData(response.data);
          console.log(response.data);
          if (response.data.parents) {
            setParentData(response.data.parents);
          }
          if (response.data.studentProfile) {
            setStudentProfileData(response.data.studentProfile);
          }
        } catch (error) {
          notification.error({
            message: "Lỗi khi tải thông tin hồ sơ",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchApplicationData();
  }, [applicationId]);

  const saveDocuments = async (applicationId: number) => {
    for (const [documentType, file] of Object.entries(attachedDocuments)) {
      await attachedDocumentService.add(documentType, applicationId, file);
    }
  };

  const handleUpdate = async () => {
    try {
      if (formRef.current && formData) {
        setLoading(true);
        await formRef.current.validateFields();

        // if (studentProfileData) {
        //   await studentProfileService.update(
        //     studentProfileData.id!,
        //     studentProfileData
        //   );
        // }

        // Update parents
        // for (const parent of parentData) {
        //   if (parent.id) {
        //     await parentService.update(parent.id, parent);
        //   } else {
        //     await parentService.add(parent);
        //   }
        // }

        const updatedFormData = {
          ...formData,
          birthdate: dayjs(formData.birthdate).format("YYYY-MM-DD"),
          intensiveCareList: formData.intensiveCareList?.map((item) => ({
            ...item,
            description: item.description,
          })),
        };

        await applicationService.update(Number(applicationId), updatedFormData);
        await saveDocuments(Number(applicationId));

        notification.success({
          message: "Cập nhật hồ sơ tuyển sinh thành công",
        });

        navigate(-1);
      }
    } catch (error) {
      notification.error({
        message: "Lỗi cập nhật hồ sơ tuyển sinh",
      });
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
          <EditInformationApplication
            setFormData={setFormData}
            formRef={formRef}
          />
          <ApplicationTabsMenu onTabChange={setActiveTab} />
          {activeTab === "1" && (
            <EditInfomationParent
              setFormData={(data) => setParentData(data)}
              formRef={formRef}
            />
          )}
          {activeTab === "2" && (
            <EditStudentProfileForm
              setFormData={(data) => setStudentProfileData(data)}
              formRef={formRef}
            />
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => navigate(-1)}>Hủy</Button>
            <Button
              onClick={handleUpdate}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Cập nhật
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditApplicationForm;
