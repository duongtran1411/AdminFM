import { CoursesFamily } from "./courses.model";
import { Shifts } from "./shifts";

// Định nghĩa interface cho StudentClass
export interface StudentClass {
  id: number;
  classId: string;
  studentId: string;
}

export interface Freshmen {
  id: number;
  studentId: number;
  name: string;
  birthDate: Date;
  coursesFamily: CoursesFamily;
  shift: Shifts;
}
export interface FreshmenResponse {
  statusCode: number;
  message: string;
  data: Freshmen[];
}
// Định nghĩa interface cho StudentList
export interface Student {
  id: number;
  studentId: number;
  name: string;
  birthDate: Date;
  studentClasses: StudentClass[];
  class: string;
}
