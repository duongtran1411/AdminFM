import { Promotion } from "../../models/promotions.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class PromotionsService {
  async getPromotions(): Promise<Response<Promotion[]>> {
    try {
      const response = await axiosInstance.get<Response<Promotion[]>>(
        "/promotions",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching promotions:", error);
      throw error;
    }
  }

  async getPromotionById(promotionId: number): Promise<Response<Promotion>> {
    try {
      const response = await axiosInstance.get<Response<Promotion>>(
        `/promotions/${promotionId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching promotion:", error);
      throw error;
    }
  }

  async addPromotion(promotionData: Promotion): Promise<Response<Promotion>> {
    try {
      const response = await axiosInstance.post<Response<Promotion>>(
        "/promotions",
        promotionData,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding promotion:", error);
      throw error;
    }
  }

  async updatePromotion(
    promotionId: number,
    promotionData: any,
  ): Promise<void> {
    try {
      await axiosInstance.put(`/promotions/${promotionId}`, promotionData);
    } catch (error) {
      console.error("Error updating promotion:", error);
      throw error;
    }
  }

  async deletePromotion(promotionId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/promotions/${promotionId}`);
    } catch (error) {
      console.error("Error deleting promotion:", error);
      throw error;
    }
  }
}

export default new PromotionsService();
