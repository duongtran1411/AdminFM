import { CreateEvaluationDto, Evaluation } from "../../models/evaluation.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class EvaluationService {
  private base = "/evaluation";

  async getAll(): Promise<Response<Evaluation[]>> {
    try {
      const response = await axiosInstance.get<Response<Evaluation[]>>(
        `${this.base}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      throw error;
    }
  }

  async getEvaluationByClass(classId: number): Promise<Evaluation[]> {
    try {
      const response = await axiosInstance.get<Response<Evaluation[]>>(
        `${this.base}/class/${classId}`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching evaluations by class:", error);
      throw error;
    }
  }

  async createOrUpdateMultiple(data: {
    evaluations: CreateEvaluationDto[];
  }): Promise<void> {
    try {
      const response = await axiosInstance.post(`${this.base}/multiple`, {
        evaluations: data.evaluations,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating multiple evaluations:", error);
      throw error;
    }
  }
}

export default new EvaluationService();
