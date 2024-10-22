import { FileExcelOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";
import { RcFile } from "antd/es/upload";
import useModals from "../../hooks/useModal";
import { Response } from "../../models/response.model";
import classService, {
  ClassResponse,
} from "../../services/class-service/class.service";
import { uploadFile } from "../../services/upload-service/upload.service";
import ImportForm from "../shared/ImportForm";
import AddClassForm from "./AddClassForm";

const FloatButtonGroup = ({ onSuccess }: { onSuccess: () => void }) => {
  const handleUpload = async (file: RcFile) => {
    try {
      await uploadFile(file);
      message.success("File uploaded successfully!");
      hideModal("importClassExcel");
      await onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Failed to upload file. Please try again.");
    }
  };

  const handleAddClass = async (classData: Response<ClassResponse>) => {
    try {
      await classService.addClass(classData);
      message.success("Thêm lớp thành công!");
      hideModal("addClassModal");
      await onSuccess();
    } catch (error) {
      message.error("Không đủ số lượng sinh viên.");
    }
  };

  const { showModal, hideModal, isVisible } = useModals();

  return (
    <>
      <div style={{ position: "fixed", top: 100, right: 24, zIndex: 1000 }}>
        <Tooltip>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={() => showModal("importClassExcel")}
            style={{ marginRight: 8 }}
          >
            Import Excel
          </Button>
        </Tooltip>
        <Tooltip>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => showModal("addClassModal")}
          >
            Thêm lớp
          </Button>
        </Tooltip>
      </div>

      <ImportForm
        isModalVisible={isVisible("importClassExcel")}
        hideModal={() => hideModal("importClassExcel")}
        handleUpload={handleUpload}
      />

      <AddClassForm
        visible={isVisible("addClassModal")}
        onAdd={handleAddClass}
        onCancel={() => hideModal("addClassModal")}
      />
    </>
  );
};

export default FloatButtonGroup;
