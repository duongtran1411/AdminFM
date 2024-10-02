import { AxiosResponse } from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { Freshmen, Student } from "../../models/student.model";

export interface StudentCountData {
  total: number;
}

class StudentService {
  // Tạo một student mới
  async create(studentList: Student): Promise<Student> {
    try {
      const response: AxiosResponse<Student> = await axiosInstance.post(
        "/students",
        studentList,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error creating student: " + error.message);
    }
  }

  async createFreshmen(freshmen: Freshmen): Promise<Freshmen> {
    try {
      const response: AxiosResponse<Freshmen> = await axiosInstance.post(
        "/students",
        freshmen,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error creating freshmen: " + error.message);
    }
  }

  async findAll(classId?: string): Promise<Student[]> {
    try {
      const response: AxiosResponse<Student[]> = await axiosInstance.get(
        `/students/class/${classId}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error fetching students: " + error.message);
    }
  }

  async findStudentsWithoutClass(): Promise<Freshmen[]> {
    try {
      const response: AxiosResponse<Freshmen[]> = await axiosInstance.get(
        "/students/without-class",
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        "Error fetching students without class: " + error.message,
      );
    }
  }

  // Lấy một student theo ID
  async findOne(id: number): Promise<Student> {
    try {
      const response: AxiosResponse<Student> = await axiosInstance.get(
        `/students/${id}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error fetching student: " + error.message);
    }
  }

  // Cập nhật một student theo ID
  async update(id: number, studentList: Student): Promise<Student> {
    try {
      const response: AxiosResponse<Student> = await axiosInstance.put(
        `/students/${id}`,
        studentList,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error updating student: " + error.message);
    }
  }

  // Xóa một student theo ID
  async remove(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/students/${id}`);
    } catch (error: any) {
      throw new Error("Error deleting student: " + error.message);
    }
  }
}

export const studentService = new StudentService();
