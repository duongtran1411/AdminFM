import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import attachedDocumentService from "../../services/attached-document-service/attached.document.service";

interface ViewDocumentModalProps {
  applicationId: number;
  visible: boolean;
  onClose: () => void;
}

const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({
  applicationId,
  visible,
  onClose,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (visible) {
        try {
          const pdfBlob = await attachedDocumentService.viewFileByApplicationId(
            applicationId,
          );
          const url = URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
          console.log(url);
        } catch (error) {
          console.error("Failed to load PDF document", error);
        }
      }
    };

    fetchDocument();
  }, [applicationId, visible]);

  return (
    <Modal
      title="View PDF Document"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="80%"
    >
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="PDF Document"
        ></iframe>
      ) : (
        <p>Loading document...</p>
      )}
    </Modal>
  );
};

export default ViewDocumentModal;
