import { Button, Typography } from "antd";
import { AdmissionProgram } from "../../models/admission.model";
import { Response } from "../../models/response.model";
import EditAdmissionProgramForm from "../../components/admission/EditAdmissionProgramForm"; // Import the Edit modal
import useModals from "../../hooks/useModal"; // Import useModals
import dayjs from "dayjs"; // Import dayjs for date formatting

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
    <div className="max-w-2xl mx-0 p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-md min-h-full flex flex-col">
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
          {dayjs(admissionProgram?.data.startRegistration).format("DD/MM/YYYY")}{" "}
          - {dayjs(admissionProgram?.data.endRegistration).format("DD/MM/YYYY")}
        </Paragraph>
        <Paragraph>
          <strong>Số lượng: </strong> {admissionProgram?.data.quota}
        </Paragraph>
        <Paragraph>
          <strong>Ngày bắt đầu: </strong>{" "}
          {dayjs(admissionProgram?.data.startDate).format("DD/MM/YYYY")}
        </Paragraph>
        <Paragraph>
          <strong>Ngày kết thúc: </strong>{" "}
          {dayjs(admissionProgram?.data.endDate).format("DD/MM/YYYY")}
        </Paragraph>
      </Typography>

      <div className="mt-auto">
        <Button type="primary" onClick={handleEditClick}>
          Sửa
        </Button>
      </div>

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
