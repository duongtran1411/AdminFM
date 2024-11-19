import { Student } from "./attendance.model";
import { Module } from "./courses.model";
import { GradeComponent } from "./gradecomponent.model";

export interface GradeCategory {
  id?: number;
  name?: string;
  module?: Module;
  gradeComponents?: GradeComponent[];
}

export interface GradeData {
  student: Student | null;
  module: Module | null;
  grades: {
    id: number | null;
    score: number | null;
    gradeComponent: {
      id: number;
      name: string;
      gradeCategory: {
        id: number;
        name: string;
      };
    };
  }[];
}

export interface GradeInput {
  studentId: number;
  moduleId: number;
  gradeComponentId: number;
  score: number;
}
