import { Class } from "./classes.model";
import { Teachers } from "./teacher.model";

export interface Attendance {
  student: Student;
  status: number;
  note: string | null;
  class: Class;
  teacher: Teachers;
}
export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  gender: string;
  birthdate: string;
  phone?: string;
  permanentResidence: string;
  cohort: string;
}
export interface CreateAttendance {
  status: number;
  note?: string;
  teacherId: number;
  studentId: number;
  classId: number;
  scheduleId: number;
}
