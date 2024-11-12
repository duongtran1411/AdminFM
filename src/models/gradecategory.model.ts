import { Module } from "./courses.model";
import { GradeComponent } from "./gradecomponent.model";

export interface GradeCategory {
  id?: number;
  name?: string;
  module?: Module;
  gradeComponents?: GradeComponent[];
}
