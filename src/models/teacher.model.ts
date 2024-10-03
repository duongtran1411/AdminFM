import { Module } from "./courses.model";
import { Shifts } from "./shifts";

export interface Teachers {
  id: number;
  name: string;
  gender: string;
  birthdate: Date;
  phone: string;
  email: string;
  working_date: Date;
  modules: Module[];
  working_shift: Shifts[];
}
