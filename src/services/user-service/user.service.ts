import { AxiosResponse } from "axios";
import {
  Users,
  CreateUser,
  CreateUserResponse,
} from "../../models/users.model";
import axiosInstance from "../../utils/axiosInstance";

class UserService {
  async create(userData: CreateUser): Promise<CreateUserResponse> {
    try {
      const response = await axiosInstance.post("/users", userData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        throw new Error("Username already exists!");
      }
      throw new Error("Error creating user: " + error.message);
    }
  }

  async getAllUser(): Promise<Users[]> {
    try {
      const response = await axiosInstance.get("/users");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<Users> {
    try {
      const response = await axiosInstance.get<Users>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }

  async updateUser(id: number, user: Users): Promise<Users> {
    try {
      const response: AxiosResponse<Users> = await axiosInstance.put(
        `/users/${id}`,
        user,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error updating user: " + error.message);
    }
  }

  async changePassword(id: number, newPassword: string) {
    const response: AxiosResponse<Users> = await axiosInstance.put(
      `/users/${id}`,
      { password: newPassword },
    );
    return response.data;
  }
}
export const userService = new UserService();
