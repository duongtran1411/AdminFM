import { StudentProfile } from "../../models/student.profile.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class StudentProfileService {
  async getAll(): Promise<Response<StudentProfile>> {
    const response = await axiosInstance.get<Response<StudentProfile>>(
      "/student-profile",
    );
    return response.data;
  }

  async add(studentProfile: StudentProfile): Promise<Response<StudentProfile>> {
    const response = await axiosInstance.post<Response<StudentProfile>>(
      "/student-profile",
      studentProfile,
    );
    return response.data;
  }
}

export default new StudentProfileService();
