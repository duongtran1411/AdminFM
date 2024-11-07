export interface ScheduleData {
  id: number;
  date: string;
  class: { id: number; name: string };
  shift: { id: number; name: string; startTime: string; endTime: string };
  teacher: { id: number; name: string };
  module: { module_id: number; module_name: string; code: string };
  classroom: { id: number; name: string };
}

export interface CreateScheduleData {
  id: number;
  date: string;
  classId: string | undefined;
  shiftId: number;
  teacherId: number;
  moduleId: number;
  classroomId: number;
}

export interface ClassDay {
  selectedDays: string;
  shiftIds: number[];
}

export interface AutoGenerateScheduleDto {
  schedules: {
    createScheduleDto: {
      moduleId: number;
      classroomId: number;
      teacherId: number;
      startDate: string;
      classId: number;
      classDay: ClassDay[];
    };
  }[];
}
