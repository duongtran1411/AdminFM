export interface Users {
  id: number;
  username: string;
  password: string;
  email: string;
  roles: string[];
}

export interface CreateUser {
  username: string;
  password: string;
  email?: string;
  roleId: number;
}

export interface CreateUserResponse {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}
