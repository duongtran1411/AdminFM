import { ExamScheduleMaster } from "../../models/exam.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class ExamScheduleMasterService {
  async getAll(): Promise<Response<ExamScheduleMaster[]>> {
    const { data } = await axiosInstance.get<Response<ExamScheduleMaster[]>>(
      "/exam-schedule-master",
    );
    return data;
  }

  async getById(id: number | undefined): Promise<Response<ExamScheduleMaster>> {
    const { data } = await axiosInstance.get<Response<ExamScheduleMaster>>(
      `/exam-schedule-master/${id}`,
    );
    return data;
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

  async remove(id: number | undefined): Promise<Response<void>> {
    const response = await axiosInstance.delete<Response<void>>(
      `/exam-schedule-master/${id}`,
    );
    return response.data;
  }

  async update(
    id: number,
    examScheduleMaster: ExamScheduleMaster,
  ): Promise<Response<ExamScheduleMaster>> {
    const { data } = await axiosInstance.put<Response<ExamScheduleMaster>>(
      `/exam-schedule-master/${id}`,
      examScheduleMaster,
    );
    return data;
  }
}

export default new ExamScheduleMasterService();
