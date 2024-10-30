import { ClassStatus } from "./class.status.model";

export interface Class {
  id: number;
  name: string;
  coursesFamilyId: number;
  tick: boolean;
  totalStudent: number;
  studentCount: number;
  status: ClassStatus;
  admissionDate: string;
}

export interface Classroom {
  id: number;
  name: string;
  buildingId: number;
}
