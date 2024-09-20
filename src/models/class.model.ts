import { Building } from "./building.model";

export interface Class {
  id: number;
  name: string;
  classRoomId: number;
}

export interface Classroom {
  id: number;
  name: string;
  building: Building[];
}
