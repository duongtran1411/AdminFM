export interface Class {
  id: number;
  name: string;
  coursesFamilyId: number;
  tick: boolean;
  totalStudent: number;
}

export interface Classroom {
  id: number;
  name: string;
  buildingId: number;
}
