import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApplicationDocument } from "../../models/applicationdocument.model";
import admissionService from "../../services/admission-program-service/admission.service";
import Loading from "../common/loading";

const AddApplicationForm = () => {
  const [applicationDocument, setApplicationDocument] = useState<
    ApplicationDocument[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { admissionId } = useParams();

  const fetchAdmissionProgram = async () => {
    if (admissionId) {
      const response = await admissionService.getById(Number(admissionId));
      setApplicationDocument(response.data.applicationDocuments);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchAdmissionProgram();
  }, [admissionId]);

  if (loading) {
    return <Loading />;
  }
  const columns = [
    {
      title: "Loại hồ sơ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tệp đính kèm",
      key: "actions",
      render: (_) => <Button type="link">+ Thêm tệp</Button>,
    },
  ];

  const data = applicationDocument.map((item) => ({
    ...item,
    key: item.id,
  }));

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Hồ sơ đính kèm</h1>
      <Table dataSource={data} columns={columns} pagination={false} />
    </div>
  );
};

export default AddApplicationForm;
