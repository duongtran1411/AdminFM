import { ExamScheduleMaster } from "../../models/exam.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class ExamScheduleMasterService {
  async getAll(): Promise<Response<ExamScheduleMaster[]>> {
    const response = await axiosInstance.get<Response<ExamScheduleMaster[]>>(
      "/exam-schedule-master",
    );
    return response.data;
  }

  async create(
    examScheduleMaster: ExamScheduleMaster,
  ): Promise<Response<ExamScheduleMaster>> {
    const response = await axiosInstance.post<Response<ExamScheduleMaster>>(
      "/exam-schedule-master",
      examScheduleMaster,
    );
    return response.data;
  }
}

export default new ExamScheduleMasterService();
