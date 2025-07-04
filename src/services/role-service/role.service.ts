import axiosInstance from "../../utils/axiosInstance";

export interface RoleData {
  id: number;
  name: string;
}

class RoleService {
  async getRoles(): Promise<RoleData[]> {
    try {
      const response = await axiosInstance.get<RoleData[]>("/roles");
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  }
}
export const roleService = new RoleService();
