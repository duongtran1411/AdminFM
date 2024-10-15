import { ApplicationStatus } from "./application.status.enum.model";

export interface Application {
  id: number;
  name: string;
  email: string;
  gender: string;
  birthDate: Date;
  phone: string;
  status: ApplicationStatus;
}
