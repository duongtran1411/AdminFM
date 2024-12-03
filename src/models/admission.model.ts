import { ApplicationDocument } from "./applicationdocument.model";
import { Promotion } from "./promotions.model";
export interface AdmissionProgram {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startRegistration: Date;
  endRegistration: Date;
  quota: number;
  applicationDocuments: ApplicationDocument[];
  promotions: Promotion[];
  promotionId?: number;
}

export interface CreateAdmissionProgramRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startRegistration: string;
  endRegistration: string;
  quota: number;
  applicationDocuments: { id: number }[];
  promotions: { id: number }[];
}

export interface UpdateAdmissionProgramRequest
  extends CreateAdmissionProgramRequest {}
