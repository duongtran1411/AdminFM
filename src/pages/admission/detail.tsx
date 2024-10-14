import { Layout } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AttachedDocumentList from "../../components/admission/AttachedDocumentList";
import DetailAdmissionProgram from "../../components/admission/DetailAdmissionProgram";
import AdmissionTabsMenu from "../../components/admission/TabMenu";
import Loading from "../../components/common/loading";
import { AdmissionProgram } from "../../models/admission.model";
import { Response } from "../../models/response.model";
import AdmissionService from "../../services/admission-program-service/admission.service";
import AddApplicationForm from "../../components/application/AddApplicationForm";

const AdmissionDetail = () => {
  const [activeTab, setActiveTab] = useState<string>("1");
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
    <>
      <AdmissionTabsMenu onTabChange={setActiveTab} />
      {activeTab === "1" ? (
        <div className="flex justify-between h-full p-6 items-stretch">
          <div className="flex-1 flex flex-col">
            <DetailAdmissionProgram
              admissionProgram={selectedAdmissionProgram}
              onUpdate={handleUpdateSuccess}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <AttachedDocumentList
              applicationDocument={selectedAdmissionProgram}
              onUpdate={handleUpdateSuccess}
            />
          </div>
        </div>
      ) : (
        <Layout
          className="rounded-lg"
          style={{
            background: "white",
            padding: "20px",
            minHeight: "100vh",
            position: "relative",
          }}
        >
          <AddApplicationForm />
        </Layout>
      )}
    </>
  );
};

export default AdmissionDetail;
