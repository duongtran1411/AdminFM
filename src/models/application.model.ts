import { AdmissionProgram } from "./admission.model";
import { ApplicationStatus } from "./enum/application.status.enum";
import { IntensiveCare } from "./intensive.care.model";

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
  cardId: string;
  priorityId?: number;
  tick?: boolean;
  intensiveCareList?: IntensiveCare[];
}
