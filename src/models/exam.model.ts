export interface ExamScheduleMaster {
  id: number;
  module_id: number;
  exam_type_id: number;
}

export interface ExamRoom {
  id: number;
  exam_schedule_master_id?: number;
  classroom_id?: number;
  teacher_id?: number;
  student_id?: number[];
}
