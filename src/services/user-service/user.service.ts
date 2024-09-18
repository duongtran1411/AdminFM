import { AxiosResponse } from "axios";
import { Users } from "../../models/users.model";
import axiosInstance from "../../utils/axiosInstance";

export interface UsersData {
  user_id: number;
  username: string;
  password: string;
  email: string;
  role: string;
}

class UserService {
  async create(usersList: Users): Promise<Users> {
    try {
      return await axiosInstance.post("/user/addUser", usersList);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        throw new Error("Username or email already exists!");
      }
      throw new Error("Error creating user: " + error.message);
    }
  }
  async getAllUser(): Promise<UsersData[]> {
    try {
      const response = await axiosInstance.get<UsersData[]>("/user");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/user/${id}`);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<UsersData> {
    try {
      const response = await axiosInstance.get<UsersData>(`/user/id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }

  async updateUser(id: number, user: UsersData): Promise<UsersData> {
    try {
      const response: AxiosResponse<UsersData> = await axiosInstance.put(
        `/user/${id}`,
        user,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error updating user: " + error.message);
    }
  }

  async changePassword(id: number, newPassword: string) {
    const response: AxiosResponse<UsersData> = await axiosInstance.put(
      `/user/${id}`,
      { password: newPassword },
    );
    return response.data;
  }
}
export const userService = new UserService();
