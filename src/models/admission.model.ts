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
}
