import { FileExcelOutlined, FormOutlined } from "@ant-design/icons";
import { FloatButton, message, Tooltip } from "antd";
import { RcFile } from "antd/es/upload";
import { FaPlus } from "react-icons/fa";
import useModals from "../../hooks/useModal";
import { Class } from "../../models/class.model";
import classService from "../../services/class-service/class.service";
import { uploadFile } from "../../services/upload-service/upload.service";
import ImportForm from "../shared/ImportForm";
import AddClassForm from "./AddClassForm";
const FloatButtonGroup = ({ onSuccess }: { onSuccess: () => void }) => {
  const handleUpload = async (file: RcFile) => {
    try {
      console.log(file.name);
      await uploadFile(file);
      message.success("File uploaded successfully!");
      hideModal("importClassExcel");
      await onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Failed to upload file. Please try again.");
    }
  };

  const handleAddClass = async (classData: Class) => {
    try {
      await classService.addClass(classData);
      message.success("Class added successfully!");
      hideModal("addClassModal");
      await onSuccess();
    } catch (error) {
      console.error("Error adding class:", error);
      message.error("Failed to add class. Please try again.");
    }
  };

  const { showModal, hideModal, isVisible } = useModals();
  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ insetInlineEnd: 24 }}
        icon={<FaPlus />}
      >
        <Tooltip title="Import Excel" placement="left">
          <FloatButton
            icon={<FileExcelOutlined />}
            onClick={() => showModal("importClassExcel")}
          />
        </Tooltip>
        <Tooltip title="Add" placement="left">
          <FloatButton
            icon={<FormOutlined />}
            onClick={() => showModal("addClassModal")}
          />
        </Tooltip>
      </FloatButton.Group>

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
