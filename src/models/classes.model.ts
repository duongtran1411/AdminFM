import { Cohort } from "./cohort.model";
import { CoursesFamily } from "./courses.model";
import { ClassStatus } from "./enum/class.status.enum";
import { Semester } from "./semester.model";

export interface Class {
  id: number;
  name: string;
  coursesFamily: CoursesFamily;
  tick: boolean;
  totalStudent: number;
  studentCount: number;
  status: ClassStatus;
  admissionDate: string;
  semester?: Semester;
  cohort: Cohort;
}

export interface Classroom {
  id: number;
  name: string;
  buildingId: number;
}
