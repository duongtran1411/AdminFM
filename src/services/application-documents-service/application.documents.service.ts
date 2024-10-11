import { ApplicationDocument } from "../../models/applicationdocument.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class ApplicationDocumentsService {
  async getAll(): Promise<Response<ApplicationDocument[]>> {
    try {
      const response = await axiosInstance.get<Response<ApplicationDocument[]>>(
        "/application-documents",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching application documents:", error);
      throw error;
    }
  }

  async getById(applicationDocumentId: number): Promise<ApplicationDocument> {
    try {
      const response = await axiosInstance.get<ApplicationDocument>(
        `/application-documents/${applicationDocumentId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching application document:", error);
      throw error;
    }
  }

  async add(
    applicationDocumentData: ApplicationDocument,
  ): Promise<Response<ApplicationDocument>> {
    try {
      const response = await axiosInstance.post<Response<ApplicationDocument>>(
        "/application-documents",
        applicationDocumentData,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding application document:", error);
      throw error;
    }
  }

  async update(
    applicationDocumentId: number,
    applicationDocumentData: any,
  ): Promise<void> {
    try {
      await axiosInstance.put(
        `/application-documents/${applicationDocumentId}`,
        applicationDocumentData,
      );
    } catch (error) {
      console.error("Error updating application document:", error);
      throw error;
    }
  }

  async delete(applicationDocumentId: number): Promise<void> {
    try {
      await axiosInstance.delete(
        `/application-documents/${applicationDocumentId}`,
      );
    } catch (error) {
      console.error("Error deleting application document:", error);
      throw error;
    }
  }
}

export default new ApplicationDocumentsService();
