import { Response } from "../../models/response.model";
import { StudentResit } from "../../models/student-resit.model";
import axiosInstance from "../../utils/axiosInstance";

class StudentResitService {
  private baseApi = "/student-resit";
  async getAll(): Promise<Response<StudentResit[]>> {
    const { data } = await axiosInstance.get<Response<StudentResit[]>>(
      `${this.baseApi}`,
    );
    return data;
  }

  async add(studentResit: StudentResit): Promise<Response<StudentResit>> {
    const response = await axiosInstance.post<Response<StudentResit>>(
      `${this.baseApi}`,
      studentResit,
    );
    return response.data;
  }

  async update(id: number, sr: StudentResit) {
    const { data } = await axiosInstance.put<Response<StudentResit>>(
      `${this.baseApi}/${id}`,
      sr,
    );
    return data;
  }
}

export default new StudentResitService();
