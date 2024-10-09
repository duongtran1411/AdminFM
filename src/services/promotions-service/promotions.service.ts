import { Promotion } from "../../models/promotions.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

export interface PromotionResponse {
  statusCode: number;
  message: string;
  data: Promotion[];
}

class PromotionsService {
  async getPromotions(): Promise<Promotion[]> {
    try {
      const response = await axiosInstance.get<PromotionResponse>("/promotions");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching promotions:", error);
      throw error;
    }
  }

  async getPromotionById(promotionId: number): Promise<Promotion> {
    try {
      const response = await axiosInstance.get<Promotion>(`/promotions/${promotionId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching promotion:", error);
      throw error;
    }
  }

  async addPromotion(
    promotionData: Response<PromotionResponse>
  ): Promise<Response<PromotionResponse>> {
    const response = await axiosInstance.post<Response<PromotionResponse>>(
      "/promotions",
      promotionData
    );
    if (response.data.data === null) {
      throw new Error(response.data.message);
    }
    return response.data;
  }

  async updatePromotion(promotionId: number, promotionData: any): Promise<void> {
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
