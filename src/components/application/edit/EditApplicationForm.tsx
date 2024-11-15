import { Button, notification } from "antd";
import { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Application } from "../../../models/application.model";
import { Parent } from "../../../models/parent.model";
import applicationService from "../../../services/application-service/application.service";
import Loading from "../../common/loading";
import NavigateBack from "../../shared/NavigateBack";
import ApplicationTabsMenu from "../TabsMenu";
import EditInfomationParent from "./EditInfomationParent";
import EditInformationApplication from "./EditInformationApplication";
import { Priority } from "../../../models/priority.model";

const EditApplicationForm = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const formRef = useRef<FormInstance>(null);
  const [formData, setFormData] = useState<Application | null>(null);
  const [parentData, setParentData] = useState<Parent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("1");
  const [applicationData, setApplicationData] = useState<Application | null>(
    null,
  );
  const [priorityData, setPriorityData] = useState<Priority[]>([]);

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (applicationId) {
        setLoading(true);
        try {
          const response = await applicationService.getById(
            Number(applicationId),
          );
          setFormData(response.data);
          if (response.data.parent) {
            setParentData(response.data.parent);
          }
          setApplicationData(response.data);
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

  const handleUpdate = async () => {
    try {
      if (formRef.current && formData) {
        setLoading(true);
        await formRef.current.validateFields();

        const updatedFormData = {
          name: formData.name,
          email: formData.email,
          gender: formData.gender,
          birthdate: dayjs(formData.birthdate).format("YYYY-MM-DD"),
          phone: formData.phone,
          cardId: formData.cardId,
          permanentResidence: formData.permanentResidence,
          course_family_id: formData.course_family_id || undefined,
          parent: parentData.map((parent) => ({
            name: parent.name || "",
            gender: parent.gender || "",
            phone: parent.phone || "",
            email: parent.email || "",
            job: parent.job || "",
          })),
          intensiveCare: priorityData?.map((item) => ({
            description: item.description,
            priority: {
              id: item.id,
              priorityId: item.priorityId,
              description: item.description,
              name: item.name,
              isSelected: item.isSelected,
            },
          })),
        };
        console.log(updatedFormData);
        await applicationService.update(Number(applicationId), updatedFormData);

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
          <EditInformationApplication
            setFormData={setFormData}
            formRef={formRef}
            applicationData={applicationData}
            priorityData={priorityData}
            setPriorityData={setPriorityData}
          />
          <ApplicationTabsMenu onTabChange={setActiveTab} />
          {activeTab === "1" && (
            <EditInfomationParent
              setFormData={(data) => setParentData(data)}
              formRef={formRef}
              parentData={applicationData?.parent || []}
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
