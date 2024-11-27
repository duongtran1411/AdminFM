import {
  CreateExamRoom,
  ExamRoom,
  ExamRoomStudent,
} from "../../models/exam.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class ExamRoomService {
  async getAll(): Promise<Response<ExamRoom[]>> {
    const { data } = await axiosInstance.get<Response<ExamRoom[]>>(
      "/exam-room",
    );
    return data;
  }

  async create(examRoom: CreateExamRoom): Promise<Response<ExamRoom>> {
    const { data } = await axiosInstance.post<Response<ExamRoom>>(
      "/exam-room",
      examRoom,
    );
    return data;
  }

  async remove(id: number): Promise<Response<null>> {
    const { data } = await axiosInstance.delete<Response<null>>(
      `/exam-room/${id}`,
    );
    return data;
  }

  async findOne(id: number) {
    const { data } = await axiosInstance.get<Response<ExamRoom>>(
      `/exam-room/${id}`,
    );
    return data;
  }

  async update(id: number, examRoom: ExamRoomStudent) {
    const { data } = await axiosInstance.put<Response<ExamRoom>>(
      `/exam-room/${id}`,
      examRoom,
    );
    return data;
  }

  async findByExamScheduleMasterId(examScheduleMasterId: number) {
    const { data } = await axiosInstance.get<Response<ExamRoom[]>>(
      `/exam-room/exam-schedule-master/${examScheduleMasterId}`,
    );
    return data;
  }

  async addStudentsToRoom(examRoomId: number, studentId: number[]) {
    const { data } = await axiosInstance.post<Response<ExamRoom>>(
      `/exam-room/${examRoomId}/students`,
      { student_id: studentId },
    );
    return data;
  }

  async updateStudentPresence(
    examRoomId: number,
    studentId: number,
    updateData: ExamRoomStudent,
  ) {
    const { data } = await axiosInstance.patch<Response<ExamRoom>>(
      `/exam-room/${examRoomId}/students/${studentId}`,
      updateData,
    );
    return data;
  }
}

export default new ExamRoomService();
