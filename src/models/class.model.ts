export interface Class {
  id: number;
  name: string;
  coursesFamilyId: number;
  shiftId: number;
  tick: boolean;
}

export interface Classroom {
  id: number;
  name: string;
  buildingId: number;
}
