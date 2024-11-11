import { Response } from "../../models/response.model";
import { Semester } from "../../models/semester.model";
import axiosInstance from "../../utils/axiosInstance";

class SemesterService {
  async findAll(): Promise<Semester[]> {
    try {
      const response = await axiosInstance.get<Response<Semester[]>>(
        "/semesters",
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching semesters:", error);
      throw error;
    }
  }
}

export default new SemesterService();
