import { Courses } from "../../models/course.model";
import axiosInstance from "../../utils/axiosInstance";

class CourseService {
  async getAllCourses(): Promise<Courses[]> {
    try {
      const response = await axiosInstance.get<Courses[]>("/courses");
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  }
}
export const courseService = new CourseService();
