import { EvaluationLevel } from "./enum/evaluation.level.enum";

export interface Evaluation {
  id?: number;
  studentId?: number;
  teacherId?: number;
  level?: EvaluationLevel;
  comments?: string;
}

export interface CreateEvaluationDto {
  id?: number;
  studentId?: number;
  teacherId?: number;
  level?: string;
  comments?: string;
}
