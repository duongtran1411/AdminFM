import { Cohort } from "./cohort.model";
import { CoursesFamily } from "./courses.model";
import { ClassStatus } from "./enum/class.status.enum";

export interface Class {
  id: number;
  name: string;
  coursesFamily: CoursesFamily;
  tick: boolean;
  totalStudent: number;
  studentCount: number;
  status: ClassStatus;
  admissionDate: string;
  term_number?: number;
  cohort: Cohort;
}

export interface Classroom {
  id: number;
  name: string;
  buildingId: number;
}
