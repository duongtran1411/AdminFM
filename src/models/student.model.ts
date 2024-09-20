// Định nghĩa interface cho StudentClass
export interface StudentClass {
  id: number;
  classId: string;
  studentId: string;
}

// Định nghĩa interface cho Class
export interface Class {
  id: number;
  name: string;
  // Có thể thêm các trường khác nếu cần
}

// Định nghĩa interface cho StudentList
export interface Student {
  id: number;
  studentId: number;
  name: string;
  birthDate: Date;
  studentClasses: StudentClass[];
  class: string;
}
