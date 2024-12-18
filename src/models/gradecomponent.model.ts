import { GradeComponentStatus } from "./enum/gradecomponent.enum";
import { GradeCategory } from "./gradecategory.model";

export interface GradeComponent {
  id?: number;
  name?: string;
  weight?: number;
  status?: GradeComponentStatus;
  gradeCategory?: GradeCategory;
}
