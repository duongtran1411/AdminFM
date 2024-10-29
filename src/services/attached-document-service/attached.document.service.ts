import { AttachedDocument } from "../../models/attached.document.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class AttachedDocumentService {
  async getAll(): Promise<Response<AttachedDocument[]>> {
    try {
      const response = await axiosInstance.get<Response<AttachedDocument[]>>(
        "/attacheddocuments",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching attached documents:", error);
      throw error;
    }
  }

  async add(
    documentType: string,
    applicationId: number,
    file: File,
  ): Promise<Response<AttachedDocument>> {
    try {
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("applicationId", applicationId.toString());
      formData.append("file", file);

      const response = await axiosInstance.post<Response<AttachedDocument>>(
        "/attacheddocuments",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error adding attached document:", error);
      throw error;
    }
  }

  async viewFileByApplicationId(applicationId: number): Promise<Blob> {
    try {
      const response = await axiosInstance.get<Blob>(
        `/attacheddocuments/view/${applicationId}`,
        {
          responseType: "blob",
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error viewing file by application ID:", error);
      throw error;
    }
  }
}

export default new AttachedDocumentService();
