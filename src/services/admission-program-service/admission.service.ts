import { AdmissionProgram } from "../../models/admission.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class AdmissionService {
  async getAll(): Promise<Response<AdmissionProgram[]>> {
    try {
      const response = await axiosInstance.get<Response<AdmissionProgram[]>>(
        "/admission-program",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching admissions:", error);
      throw error;
    }
  }

  async getById(admissionId: number): Promise<Response<AdmissionProgram>> {
    try {
      const response = await axiosInstance.get<Response<AdmissionProgram>>(
        `/admission-program/${admissionId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching admission:", error);
      throw error;
    }
  }

  async add(
    admissionData: AdmissionProgram,
  ): Promise<Response<AdmissionProgram>> {
    try {
      const response = await axiosInstance.post<Response<AdmissionProgram>>(
        "/admission-program",
        admissionData,
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding admission:", error);
      throw error;
    }
  }

  async update(admissionId: number, admissionData: any): Promise<void> {
    try {
      await axiosInstance.put(
        `/admission-program/${admissionId}`,
        admissionData,
      );
    } catch (error) {
      console.error("Error updating admission:", error);
      throw error;
    }
  }

  async delete(admissionId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/admission-program/${admissionId}`);
    } catch (error) {
      console.error("Error deleting admission:", error);
      throw error;
    }
  }

  async updateDocumentInApplicationProgram(
    admissionId: number,
    documentIds: number[],
  ): Promise<void> {
    try {
      await axiosInstance.put(
        `/admission-program/${admissionId}/documents`,
        { applicationDocumentIds: documentIds },
      );
    } catch (error) {
      console.error("Error updating documents in admission program:", error);
      throw error;
    }
  }
}

export default new AdmissionService();
