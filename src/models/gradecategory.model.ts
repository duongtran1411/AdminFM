import { Student } from "./attendance.model";
import { Module } from "./courses.model";
import { GradeComponent } from "./gradecomponent.model";

export interface GradeCategory {
  id?: number;
  name?: string;
  module?: Module;
  gradeComponents?: GradeComponent[];
  weight?: number;
}

export interface GradeData {
  student: Student | null;
  module: Module | null;
  grades: {
    id: number | null;
    original_score: number | null;
    resit_score: number | null;
    gradeComponent: {
      id: number;
      name: string;
      isResit: boolean;
      gradeCategory: {
        id: number;
        name: string;
        weight: string;
      };
    };
  }[];
  finalGrade: {
    id: number;
    average_grade: string;
    first_attempt_grade: string | null;
    status: string;
    remarks: string;
    attempt: number;
  } | null;
}

export interface GradeInput {
  studentId: number;
  moduleId: number;
  gradeComponentId?: number;
  score?: number;
  average_grade?: number;
  remarks?: string;
  status?: string;
  isResit?: boolean;
}
