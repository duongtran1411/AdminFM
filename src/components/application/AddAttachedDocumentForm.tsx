import { Button, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApplicationDocument } from "../../models/applicationdocument.model";
import admissionService from "../../services/admission-program-service/admission.service";
import Loading from "../common/loading";

const AddAttachedDocumentForm = ({ setAttachedDocument }) => {
  const [loading, setLoading] = useState(true);
  const [applicationDocument, setApplicationDocument] = useState<
    ApplicationDocument[]
  >([]);
  const [attachedFiles, setAttachedFiles] = useState<{ [key: string]: File }>(
    {},
  ); // State to track attached files
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
      width: "50%",
    },
    {
      title: "Tệp đính kèm",
      key: "actions",
      render: (_, record) => (
        <>
          {attachedFiles[record.name] ? (
            <span>{attachedFiles[record.name]?.name}</span>
          ) : (
            <Upload
              beforeUpload={(file) => {
                handleFileUpload(record.name, file);
                return false; 
              }}
            >
              <Button type="link">+ Thêm tệp</Button>
            </Upload>
          )}
        </>
      ),
      width: "50%",
    },
  ];

  const data = applicationDocument.map((item) => ({
    ...item,
    key: item.id,
  }));

  const handleFileUpload = (recordName: string, file: File) => {
    setAttachedFiles((prev) => {
      const newAttachedFiles = { ...prev, [recordName]: file };
      return newAttachedFiles;
    });
    setAttachedDocument((prev) => ({ ...prev, [recordName]: file }));
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">Thông tin đính kèm</h1>
      <Table dataSource={data} columns={columns} pagination={false} />
    </div>
  );
};

export default AddAttachedDocumentForm;
