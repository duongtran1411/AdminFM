import { ExamRoom } from "../../models/exam.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class ExamRoomService {
  async getAll(): Promise<Response<ExamRoom[]>> {
    const response = await axiosInstance.get<Response<ExamRoom[]>>(
      "/exam-room",
    );
    return response.data;
  }

  async create(examRoom: ExamRoom): Promise<Response<ExamRoom>> {
    const response = await axiosInstance.post<Response<ExamRoom>>(
      "/exam-room",
      examRoom,
    );
    return response.data;
  }
}

export default new ExamRoomService();
