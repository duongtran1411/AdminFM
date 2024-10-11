import { ApplicationDocument } from "./applicationdocument.model";

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
}
