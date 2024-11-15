export interface Priority {
  id: number;
  priorityId: number;
  description: string;
  name: string;
  isSelected: boolean;
}

export interface CreatePriorityDto {
  name: string;
}
