// services/userService.ts
import { AxiosResponse } from "axios";
import {
  LoginRequestPayload,
  RegisterRequestPayload,
} from "../../redux/auth/actions";
import axiosInstance from "../../utils/axiosInstance";

interface LoginResponse {
  access_token: string;
}

export const loginUser = async (
  payload: LoginRequestPayload,
): Promise<AxiosResponse<LoginResponse>> => {
  try {
    const respone = await axiosInstance.post("/auth/login", payload);
    const token = respone.data.access_token;
    localStorage.setItem("token", token);
    return respone;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const registerUser = async (
  payload: RegisterRequestPayload,
): Promise<AxiosResponse<LoginResponse>> => {
  try {
    return await axiosInstance.post("/auth/register", payload);
  } catch (error: any) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem("token");
};
