import { ApplicationStatus } from "./application.status.enum.model";

export interface Application {
  id?: number;
  name: string;
  email: string;
  gender: string;
  birthdate: string;
  phone: string;
  status: ApplicationStatus;
  permanentResidence: string;
  admissionProgramId: number;
}
