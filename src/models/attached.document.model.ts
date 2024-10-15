import { Application } from "./application.model";

export interface AttachedDocument {
    id: number;
    documentType: string;
    filePath: string;
    applications: Application;
  }
  