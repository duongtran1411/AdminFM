import { AdmissionProgram } from "./admission.model";
import { ApplicationStatus } from "./enum/application.status.enum";

export interface Application {
  id?: number;
  name: string;
  email: string;
  gender: string;
  birthdate: string;
  phone: string;
  status: ApplicationStatus;
  permanentResidence: string;
  admissionProgram: AdmissionProgram;
}
