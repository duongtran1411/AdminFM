import { Application } from "../../models/application.model";
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
      console.error("Error fetching application:", error);
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
}

export default new ApplicationService();
