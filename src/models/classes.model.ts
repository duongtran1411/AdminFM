export interface Class {
  id: number;
  name: string;
  coursesFamilyId: number;
  shiftId: number;
  tick: boolean;
  tick_to_create_schedules: boolean;
}

export interface Classroom {
  id: number;
  name: string;
  buildingId: number;
}
