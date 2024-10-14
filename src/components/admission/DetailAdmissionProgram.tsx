import { Button, Typography } from "antd";
import { AdmissionProgram } from "../../models/admission.model";
import { Response } from "../../models/response.model";
import EditAdmissionProgramForm from "../../components/admission/EditAdmissionProgramForm"; // Import the Edit modal
import useModals from "../../hooks/useModal"; // Import useModals

interface AdmissionProgramProps {
  admissionProgram: Response<AdmissionProgram> | null;
  onUpdate: () => void;
}

const DetailAdmissionProgram = ({
  admissionProgram,
  onUpdate,
}: AdmissionProgramProps) => {
  const { Paragraph } = Typography;
  const { isVisible, showModal, hideModal } = useModals();

  const handleEditClick = () => {
    showModal("editAdmissionProgram");
  };

  return (
    <div className="max-w-2xs mx-1 p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-md min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Thông tin chung</h2>
      <Typography>
        <Paragraph>
          <strong>Tên: </strong> {admissionProgram?.data.name}
        </Paragraph>
        <Paragraph>
          <strong>Mô tả: </strong> {admissionProgram?.data.description}
        </Paragraph>
        <Paragraph>
          <strong>Thời gian đăng ký: </strong>{" "}
          {admissionProgram?.data.startRegistration.toString()} -{" "}
          {admissionProgram?.data.endRegistration.toString()}
        </Paragraph>
        <Paragraph>
          <strong>Số lượng: </strong> {admissionProgram?.data.quota}
        </Paragraph>
        <Paragraph>
          <strong>Ngày bắt đầu: </strong>{" "}
          {admissionProgram?.data.startDate?.toString()}
        </Paragraph>
        <Paragraph>
          <strong>Ngày kết thúc: </strong>{" "}
          {admissionProgram?.data.endDate?.toString()}
        </Paragraph>
      </Typography>

      <Button
        type="primary"
        className=" hover:bg-green-700"
        onClick={handleEditClick} 
      >
        Sửa
      </Button>

      <EditAdmissionProgramForm
        isModalVisible={isVisible("editAdmissionProgram")}
        hideModal={() => hideModal("editAdmissionProgram")}
        admissionProgram={admissionProgram}
        onUpdate={() => {
          onUpdate();
        }}
      />
    </div>
  );
};

export default DetailAdmissionProgram;
