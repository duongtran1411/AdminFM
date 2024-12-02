import { Classroom } from "./classes.model";
import { ExamType } from "./courses.model";

import { Module } from "./courses.model";
import { Student } from "./student.model";
import { Teachers } from "./teacher.model";

export interface ExamScheduleMaster {
  id?: number;
  module_id?: number;
  exam_type_id?: number;
  exam_date?: string;
  start_time?: string;
  end_time?: string;
  retake_date?: string;
  retake_start_time?: string;
  retake_end_time?: string;
  note?: string;
  module?: Module;
}

export interface UpdateExamScheduleMaster {
  id?: number;
  module?: Module;
  exam_type?: ExamType;
  exam_date?: string;
  start_time?: string;
  end_time?: string;
  retake_date?: string;
  retake_start_time?: string;
  retake_end_time?: string;
  note?: string;
}

export interface ExamRoomStudent {
  is_present?: boolean | null;
  note?: string;
  student?: Student;
}
export interface ExamRoom {
  id: number;
  exam_schedule_master?: ExamScheduleMaster;
  capacity?: number;
  classroom?: Classroom;
  teacher?: Teachers;
  exam_room_students?: ExamRoomStudent[];
}

export interface CreateExamRoom {
  exam_schedule_master_id?: number;
  classroom_id?: number;
  teacher_id?: number;
  capacity?: number;
}
