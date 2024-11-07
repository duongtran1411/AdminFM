import { Parent } from "../../models/parent.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class ParentService {
  async add(parent: Parent): Promise<Response<Parent>> {
    try {
      const response = await axiosInstance.post<Response<Parent>>(
        "/parent",
        parent,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding parent:", error);
      throw error;
    }
  }
}

export default new ParentService();
