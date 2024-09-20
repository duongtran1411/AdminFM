import { Building } from "../../models/building.model";
import axiosInstance from "../../utils/axiosInstance";

class BuildingService {
  async getAllBuilding(): Promise<Building[]> {
    try {
      const response = await axiosInstance.get<Building[]>("/building");
      return response.data;
    } catch (error) {
      console.error("Error fetching buildings:", error);
      throw error;
    }
  }

  async addBuilding(build: Building): Promise<Building[]> {
    try {
      const response = await axiosInstance.post<Building[]>("/building", build);
      return response.data;
    } catch (error) {
      console.error("Error fetching building:", error);
      throw error;
    }
  }

  async updateBuilding(id: string, buildingData: any): Promise<void> {
    try {
      await axiosInstance.patch(`/building/${id}`, buildingData);
    } catch (error) {
      console.error("Error updating building:", error);
      throw error;
    }
  }

  async deleteBuilding(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/building/${id}`);
    } catch (error) {
      console.error("Error deleting building:", error);
      throw error;
    }
  }
}

export default new BuildingService();
