import { Button, Table, Tag, Upload } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFilePdf } from "react-icons/fa";
import { MdDescription, MdImage, MdInsertDriveFile } from "react-icons/md";
import { useParams } from "react-router-dom";
import { ApplicationDocument } from "../../../models/applicationdocument.model";
import { AttachedDocument } from "../../../models/attached.document.model";
import admissionService from "../../../services/admission-program-service/admission.service";
import Loading from "../../common/loading";
import { apiEndpoint } from "../../../config";

interface AttachedFileType {
  file?: File;
  name: string;
  isExisting: boolean;
  filePath?: string;
}

interface EditAttachedDocumentFormProps {
  setAttachedDocument: (data: { [key: string]: File }) => void;
  resetUploadKey: number;
  attachedDocuments?: AttachedDocument[];
  onDataChange?: (data: any) => void;
}

const EditAttachedDocumentForm = ({
  setAttachedDocument,
  resetUploadKey,
  attachedDocuments = [],
  onDataChange,
}: EditAttachedDocumentFormProps) => {
  const [loading, setLoading] = useState(true);
  const [applicationDocument, setApplicationDocument] = useState<
    ApplicationDocument[]
  >([]);
  const [attachedFiles, setAttachedFiles] = useState<{
    [key: string]: AttachedFileType;
  }>({});
  const { admissionId } = useParams();

  useEffect(() => {
    const fetchAdmissionProgram = async () => {
      if (admissionId) {
        const response = await admissionService.getById(Number(admissionId));
        setApplicationDocument(response.data.applicationDocuments);
      }
      setLoading(false);
    };

    fetchAdmissionProgram();
  }, [admissionId]);

  useEffect(() => {
    if (attachedDocuments.length > 0) {
      const existingFiles: { [key: string]: AttachedFileType } = {};
      attachedDocuments.forEach((doc) => {
        existingFiles[doc.documentType || ""] = {
          name: doc.filePath.split("/").pop() || "",
          isExisting: true,
          filePath: doc.filePath,
        };
      });
      setAttachedFiles(existingFiles);
    }
  }, [attachedDocuments]);

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

  const handleFileUpload = (recordName: string, file: File) => {
    setAttachedFiles((prev) => {
      const newAttachedFiles = {
        ...prev,
        [recordName]: {
          file,
          name: file.name,
          isExisting: false,
        },
      };
      return newAttachedFiles;
    });

    const newDocs = { [recordName]: file };
    setAttachedDocument(newDocs);
    onDataChange?.(newDocs);
  };

  const handleFileRemove = (recordName: string) => {
    setAttachedFiles((prev) => {
      const newAttachedFiles = { ...prev };
      delete newAttachedFiles[recordName];
      return newAttachedFiles;
    });

    const newDocs = {};
    setAttachedDocument(newDocs);
    onDataChange?.(newDocs);
  };

  const handleFilePreview = (fileData: AttachedFileType) => {
    if (fileData.isExisting && fileData.filePath) {
      const fileUrl = `${import.meta.env.VITE_API_URL || apiEndpoint}/${
        fileData.filePath
      }`;
      const fileName = fileData.filePath.split("/").pop() || "";
      const extension = fileName.split(".").pop()?.toLowerCase();

      const link = document.createElement("a");
      link.href = fileUrl;

      if (
        extension === "pdf" ||
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png"
      ) {
        window.open(fileUrl, "_blank");
      } else {
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (fileData.file) {
      const fileURL = URL.createObjectURL(fileData.file);
      window.open(fileURL, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          <i>Thông tin đính kèm</i>
        </h2>
      </div>

      <div className="p-6">
        <Table
          dataSource={applicationDocument}
          columns={[
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
                        onClick={() => {
                          const fileData = attachedFiles[record.name];
                          if (fileData.isExisting && fileData.filePath) {
                            handleFilePreview(fileData);
                          } else if (fileData.file) {
                            handleFilePreview(fileData);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {getFileTypeIcon(attachedFiles[record.name].name)}
                      </span>
                      <AiOutlineClose
                        style={{
                          marginLeft: 8,
                          cursor: "pointer",
                          color: "red",
                        }}
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
          ]}
          pagination={false}
          className="rounded-lg border border-gray-200"
        />
      </div>
    </div>
  );
};

export default EditAttachedDocumentForm;
