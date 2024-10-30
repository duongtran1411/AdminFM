export interface Promotion {
  id: number;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  discount?: number;
  scholarshipQuantity?: number;
  condition?: string;
  maxQuantity?: number;
  registrationMethod?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
