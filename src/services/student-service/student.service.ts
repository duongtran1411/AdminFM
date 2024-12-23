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

  async findOne(id: number): Promise<Response<Student>> {
    const response: AxiosResponse<Response<Student>> = await axiosInstance.get(
      `/students/${id}`,
    );
    return response.data;
  }

  async create(studentList: Student): Promise<Student> {
    const response: AxiosResponse<Student> = await axiosInstance.post(
      "/students",
      studentList,
    );
    return response.data;
  }

  async findByClassId(classId?: number): Promise<Response<Student[]>> {
    const response: AxiosResponse<Response<Student[]>> =
      await axiosInstance.get(`/students/class/${classId}`);
    return response.data;
  }

  async findStudentsWithoutClass(): Promise<Response<Student[]>> {
    const response: AxiosResponse<Response<Student[]>> =
      await axiosInstance.get("/students/without-class");
    return response.data;
  }

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

  async uploadAvatar(
    id: number,
    file: File,
  ): Promise<Response<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response: AxiosResponse<Response<{ avatarUrl: string }>> =
      await axiosInstance.post(`/students/${id}/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    return response.data;
  }

  async deleteAvatar(id: number): Promise<Response<void>> {
    const response: AxiosResponse<Response<void>> = await axiosInstance.delete(
      `/students/${id}/avatar`,
    );
    return response.data;
  }

  async findStudentsByModule(moduleId: number): Promise<Response<Student[]>> {
    const response: AxiosResponse<Response<Student[]>> =
      await axiosInstance.get(`/students/module/${moduleId}`);
    return response.data;
  }

  async checkPass(
    moduleCode: string,
    studentId: number,
  ): Promise<Response<{ message: string; data: string }>> {
    const response: AxiosResponse<Response<{ message: string; data: string }>> =
      await axiosInstance.get(
        `/students/check-pass/${moduleCode}/${studentId}`,
      );
    return response.data;
  }

  async findStudentByUserId(userId: number): Promise<Student> {
    const response = await axiosInstance.get(`/students/user/${userId}`);
    return response.data.data;
  }
}

export const studentService = new StudentService();
