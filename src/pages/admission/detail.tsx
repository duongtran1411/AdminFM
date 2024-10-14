import DetailAdmissionProgram from "../../components/admission/DetailAdmissionProgram";
import AttachedDocumentList from "../../components/admission/AttachedDocumentList";
import { useParams } from "react-router-dom";
import { AdmissionProgram } from "../../models/admission.model";
import { useState, useEffect } from "react";
import AdmissionService from "../../services/admission-program-service/admission.service";
import { Response } from "../../models/response.model";
import Loading from "../../components/common/loading";

const AdmissionDetail = () => {
  const { admissionId } = useParams();
  const [selectedAdmissionProgram, setSelectedAdmissionProgram] =
    useState<Response<AdmissionProgram> | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchAdmissionProgram = async () => {
    if (admissionId) {
      const response = await AdmissionService.getById(Number(admissionId));
      setSelectedAdmissionProgram(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmissionProgram();
  }, [admissionId]);

  const handleUpdateSuccess = () => {
    fetchAdmissionProgram();
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "100%",
        padding: "26px",
      }}
    >
      <div style={{ flex: 1, marginRight: "10px" }}>
        <DetailAdmissionProgram
          admissionProgram={selectedAdmissionProgram}
          onUpdate={handleUpdateSuccess}
        />
      </div>
      <div style={{ flex: 1, marginLeft: "10px" }}>
        <AttachedDocumentList
          applicationDocument={selectedAdmissionProgram}
          onUpdate={handleUpdateSuccess}
        />
      </div>
    </div>
  );
};

export default AdmissionDetail;
