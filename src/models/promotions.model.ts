export interface Promotion {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    discountType: string;
    discount: number;
    scholarshipQuantity: number;
    condition: string;
    maxQuantity: number;
    registrationMethod: string;
    requiredDocument: string;
    createdAt: Date;
    updatedAt: Date;
  }