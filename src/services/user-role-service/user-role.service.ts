import axiosInstance from "../../utils/axiosInstance";

export interface UserRoleData {
  userId: number;
  roleId: number;
}

class UserRoleService {
  // async create(userrole: UserRoleData): Promise<UserRoleData> {
  //
  // }
}

export const userRoleService = new UserRoleService();
