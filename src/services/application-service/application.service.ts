import { Application } from "../../models/application.model";
import { ApplicationStatus } from "../../models/enum/application.status.enum";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class ApplicationService {
  async getAll(): Promise<Response<Application[]>> {
    try {
      const response = await axiosInstance.get<Response<Application[]>>(
        "/applications",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  }

  async getByAdmissionId(
    admissionId: number,
  ): Promise<Response<Application[]>> {
    try {
      const response = await axiosInstance.get<Response<Application[]>>(
        `/applications/addmission/${admissionId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching applications by admissionId:", error);
      throw error;
    }
  }

  async add(application: Application): Promise<Response<Application>> {
    try {
      const response = await axiosInstance.post<Response<Application>>(
        "/applications",
        application,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding application:", error);
      throw error;
    }
  }

  async update(
    applicationId: number,
    applicationData: Partial<Application>,
  ): Promise<Response<Application>> {
    try {
      const response = await axiosInstance.put<Response<Application>>(
        `/applications/${applicationId}`,
        applicationData,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  }

  async changeStatus(
    applicationId: number,
    status: ApplicationStatus,
  ): Promise<Response<Application>> {
    try {
      const response = await axiosInstance.put<Response<Application>>(
        `/applications/${applicationId}/status`,
        { status },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating application status:", error);
      throw error;
    }
  }

  async changeStatusMultiple(
    id: number[],
    status: ApplicationStatus,
  ): Promise<Response<Application>> {
    try {
      const response = await axiosInstance.patch<Response<Application>>(
        "/applications/status-multiple",
        { id, status },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating multiple application statuses:", error);
      throw error;
    }
  }
}

export default new ApplicationService();
