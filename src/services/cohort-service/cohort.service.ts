import { Cohort } from "../../models/cohort.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class CohortService {
  async getAllCohort(): Promise<Response<Cohort[]>> {
    try {
      const response = await axiosInstance.get<Response<Cohort[]>>("/cohorts");
      return response.data;
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      throw error;
    }
  }

  async addCohort(cohort: Cohort): Promise<Response<Cohort>> {
    try {
      const response = await axiosInstance.post<Response<Cohort>>(
        "/cohorts",
        cohort,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cohort:", error);
      throw error;
    }
  }

  async updateCohort(id: string, cohortData: any): Promise<Response<Cohort>> {
    try {
      const response = await axiosInstance.patch<Response<Cohort>>(
        `/cohorts/${id}`,
        cohortData,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating cohort:", error);
      throw error;
    }
  }

  async deleteCohort(id: number): Promise<Response<void>> {
    try {
      const response = await axiosInstance.delete<Response<void>>(
        `/cohorts/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting cohort:", error);
      throw error;
    }
  }
}

export default new CohortService();
