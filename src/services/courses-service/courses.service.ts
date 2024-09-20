import { Courses } from "../../models/courses.model";
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

  async addCourse(course: Courses): Promise<Courses[]> {
    try {
      const response = await axiosInstance.post<Courses[]>("/courses", course);
      return response.data;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  }

  async deleteCourse(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/courses/${id}`);
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  }

  async updateCourse(id: string, course: any): Promise<void> {
    try {
      await axiosInstance.patch(`/courses/${id}`, course);
    } catch (error) {
      console.error("Error updating courses:", error);
      throw error;
    }
  }
}
export const courseService = new CourseService();
