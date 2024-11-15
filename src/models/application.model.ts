import { AdmissionProgram } from "./admission.model";
import { AttachedDocument } from "./attached.document.model";
import { ApplicationStatus } from "./enum/application.status.enum";
import { IntensiveCare } from "./intensive.care.model";
import { Parent } from "./parent.model";
import { StudentProfile } from "./student.profile.model";

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
  parent?: Parent[];
  studentProfile?: StudentProfile;
  course_family_id?: number;
  attachedDocuments?: AttachedDocument[];
  intensiveCare?: IntensiveCare[];
}
