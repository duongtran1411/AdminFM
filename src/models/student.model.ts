import { Application } from "./application.model";
import { Attendance } from "./attendance.model";
import { Class } from "./classes.model";
import { Cohort } from "./cohort.model";
import { CoursesFamily } from "./courses.model";
import { StudentStatus } from "./enum/student.status.enum";
import { Shifts } from "./shifts";

export interface Freshmen {
  id: number;
  studentId: string;
  name: string;
  birthdate: Date;
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
  studentId: string;
  name: string;
  email: string;
  gender: string;
  birthdate: Date;
  phone: string;
  coursesFamily: CoursesFamily;
  class: Class;
  status: StudentStatus;
  attendance: Attendance;
  cohort?: Cohort;
  application?: Application;
  permanentResidence?: string;
}
