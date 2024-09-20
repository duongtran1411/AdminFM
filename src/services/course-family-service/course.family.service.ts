import { CoursesFamily } from "../../models/courses.model";
import axiosInstance from "../../utils/axiosInstance";

class CoursesFamilyService {
  async getAll(): Promise<CoursesFamily[]> {
    try {
      const response = await axiosInstance.get<CoursesFamily[]>(
        "/coursesfamily",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Courses Family:", error);
      throw error;
    }
  }

  async add(cfm: CoursesFamily): Promise<CoursesFamily[]> {
    try {
      const response = await axiosInstance.post<CoursesFamily[]>(
        "/coursesfamily",
        cfm,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Courses Family:", error);
      throw error;
    }
  }

  async update(id: number, cfm: any): Promise<void> {
    try {
      await axiosInstance.patch(`/coursesfamily/${id}`, cfm);
    } catch (error) {
      console.error("Error updating Courses Family:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/coursesfamily/${id}`);
    } catch (error) {
      console.error("Error deleting Courses Family:", error);
      throw error;
    }
  }

  //   async getClassroomsByBId(buildingId: number): Promise<Classroom[]> {
  //     try {
  //       const response: AxiosResponse<Classroom[]> = await axiosInstance.get(
  //         `classroom/building/${buildingId}/classrooms`,
  //       );
  //       return response.data;
  //     } catch (error: any) {
  //       console.error("Error fetching classrooms by building ID:", error);
  //       throw new Error("Error fetching classrooms: " + error.message);
  //     }
  //   }
}

export default new CoursesFamilyService();
