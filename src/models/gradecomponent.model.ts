import { GradeCategory } from "./gradecategory.model";

export interface GradeComponent {
  id?: number;
  name?: string;
  weight?: number;
  isResit?: boolean;
  gradeCategory?: GradeCategory;
}
