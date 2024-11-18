import { GradeCategory } from "./gradecategory.model";

export interface GradeComponent {
  id?: number;
  name?: string;
  weight?: number;
  gradeCategory?: GradeCategory;
}
