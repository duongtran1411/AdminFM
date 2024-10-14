import { List, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { AdmissionProgram } from "../../models/admission.model";
import { Response } from "../../models/response.model";
import useModals from "../../hooks/useModal";
import EditDocumentInAdmissionProgramForm from "./EditDocumentInAdmissionProgramForm";

interface ApplicationDocumentProps {
  applicationDocument: Response<AdmissionProgram> | null;
  onUpdate: () => void;
}

const AttachedDocumentList = ({
  applicationDocument,
  onUpdate,
}: ApplicationDocumentProps) => {
  const { isVisible, showModal, hideModal } = useModals();

  const handleEditClick = () => {
    showModal("editDocumetInAdmissionProgram");
  };

  return (
    <div className="max-w-2xs mx-0 p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-md min-h-[400px]">
      <div className="flex items-center mb-5">
        <h2 className="text-2xl font-bold mr-2">Thành phần hồ sơ</h2>
        <QuestionCircleOutlined className="text-red-500" />
      </div>
      <div className="flex-grow">
        <List
          dataSource={applicationDocument?.data.applicationDocuments}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className="py-2 border-b border-gray-200 last:border-b-0"
            >
              <span className="text-green-600 mr-2">•</span>
              {item.name}
            </List.Item>
          )}
        />
      </div>
      <EditDocumentInAdmissionProgramForm
        isModalVisible={isVisible("editDocumetInAdmissionProgram")}
        hideModal={() => hideModal("editDocumetInAdmissionProgram")}
        applicationDocument={applicationDocument}
        onUpdate={onUpdate}
      />
      <Button
        type="primary"
        className=" hover:bg-green-700"
        onClick={handleEditClick}
      >
        Sửa
      </Button>
    </div>
  );
};

export default AttachedDocumentList;
