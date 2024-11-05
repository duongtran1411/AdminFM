import { AxiosResponse } from "axios";
import { Response } from "../../models/response.model";
import { Student } from "../../models/student.model";
import axiosInstance from "../../utils/axiosInstance";

class StudentService {
  async findAll(): Promise<Response<Student[]>> {
    const response: AxiosResponse<Response<Student[]>> =
      await axiosInstance.get(`/students`);
    return response.data;
  }

  async create(studentList: Student): Promise<Student> {
    const response: AxiosResponse<Student> = await axiosInstance.post(
      "/students",
      studentList,
    );
    return response.data;
  }

  async findByClassId(classId?: string): Promise<Response<Student[]>> {
    const response: AxiosResponse<Response<Student[]>> =
      await axiosInstance.get(`/students/class/${classId}`);
    return response.data;
  }

  async findStudentsWithoutClass(): Promise<Response<Student[]>> {
    const response: AxiosResponse<Response<Student[]>> =
      await axiosInstance.get("/students/without-class");
    return response.data;
  }

  // Cập nhật một student theo ID
  async update(id: number, studentList: Student): Promise<Student> {
    const response: AxiosResponse<Student> = await axiosInstance.put(
      `/students/${id}`,
      studentList,
    );
    return response.data;
  }

  async remove(id: number): Promise<Response<void>> {
    const response: AxiosResponse<Response<void>> = await axiosInstance.delete(
      `/students/${id}`,
    );
    return response.data;
  }

  async createStudentWithClass(
    classId: number,
    studentIds: number[],
  ): Promise<Response<Student[]>> {
    try {
      const response: AxiosResponse<Response<Student[]>> =
        await axiosInstance.post("/students/assign-class", {
          classId,
          studentId: studentIds,
        });
      return response.data;
    } catch (error: any) {
      throw new Error("Lỗi khi gán sinh viên vào lớp: " + error.message);
    }
  }
}

export const studentService = new StudentService();
