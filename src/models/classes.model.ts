import { ClassStatus } from "./enum/class.status.enum";

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
