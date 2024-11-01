import { Button, Table, Tag, Upload } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFilePdf } from "react-icons/fa";
import { MdDescription, MdImage, MdInsertDriveFile } from "react-icons/md";
import { useParams } from "react-router-dom";
import { ApplicationDocument } from "../../models/applicationdocument.model";
import admissionService from "../../services/admission-program-service/admission.service";
import Loading from "../common/loading";

const AddAttachedDocumentForm = ({ setAttachedDocument, resetUploadKey }) => {
  const [loading, setLoading] = useState(true);
  const [applicationDocument, setApplicationDocument] = useState<
    ApplicationDocument[]
  >([]);
  const [attachedFiles, setAttachedFiles] = useState<{ [key: string]: File }>(
    {},
  );
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

  useEffect(() => {
    setAttachedFiles({});
    setAttachedDocument({});
  }, [resetUploadKey]);

  if (loading) {
    return <Loading />;
  }

  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconStyle = { fontSize: "1em", marginRight: 4 };
    const tagStyle = {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 8px",
      borderRadius: "8px",
      border: "1px solid",
    };

    switch (extension) {
      case "pdf":
        return (
          <Tag
            style={{
              ...tagStyle,
              color: "#FF5252",
              borderColor: "#FF5252",
              backgroundColor: "white",
            }}
          >
            <FaFilePdf style={{ ...iconStyle, color: "#FF5252" }} />
            PDF
          </Tag>
        );
      case "doc":
      case "docx":
      case "txt":
        return (
          <Tag
            style={{
              ...tagStyle,
              color: "#4285F4",
              borderColor: "#4285F4",
              backgroundColor: "white",
            }}
          >
            <MdDescription style={{ ...iconStyle, color: "#4285F4" }} />
            DOC
          </Tag>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <Tag
            style={{
              ...tagStyle,
              color: "#34A853",
              borderColor: "#34A853",
              backgroundColor: "white",
            }}
          >
            <MdImage style={{ ...iconStyle, color: "#34A853" }} />
            IMG
          </Tag>
        );
      default:
        return (
          <Tag
            style={{
              ...tagStyle,
              color: "#9E9E9E",
              borderColor: "#9E9E9E",
              backgroundColor: "white",
            }}
          >
            <MdInsertDriveFile style={{ ...iconStyle, color: "#9E9E9E" }} />
            FILE
          </Tag>
        );
    }
  };
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {attachedFiles[record.name] ? (
            <>
              <span
                onClick={() => handleFilePreview(attachedFiles[record.name])}
                style={{ cursor: "pointer" }}
              >
                {getFileTypeIcon(attachedFiles[record.name].name)}
              </span>
              <AiOutlineClose
                style={{ marginLeft: 8, cursor: "pointer", color: "red" }}
                onClick={() => handleFileRemove(record.name)}
              />
            </>
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
        </div>
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

  const handleFileRemove = (recordName: string) => {
    setAttachedFiles((prev) => {
      const newAttachedFiles = { ...prev };
      delete newAttachedFiles[recordName];
      return newAttachedFiles;
    });
    setAttachedDocument((prev) => {
      const newAttachedDocuments = { ...prev };
      delete newAttachedDocuments[recordName];
      return newAttachedDocuments;
    });
  };

  function handleFilePreview(file: File) {
    const fileURL = URL.createObjectURL(file);

    const extension = file.name.split(".")?.pop()?.toLowerCase();

    if (extension === "doc" || extension === "docx") {
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(fileURL, "_blank");
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">Thông tin đính kèm</h1>
      <Table dataSource={data} columns={columns} pagination={false} />
    </div>
  );
};

export default AddAttachedDocumentForm;
