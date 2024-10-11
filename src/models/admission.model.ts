import { ApplicationDocument } from "./applicationdocument.model";

export interface AdmissionProgram {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startRegister: Date;
  endRegister: Date;
  quota: number;

  applicationDocumentIds: ApplicationDocument[];
}
