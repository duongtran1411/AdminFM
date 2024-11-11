export interface Module {
  module_id: number;
  module_name: string;
  code: string;
  exam_type: string;
  number_of_classes: number;
  term_number?: number;
}

export interface Courses {
  course_id: number;
  course_name: string;
  course_code: string;
  course_family_id: number;
  modules: Module[];
}

export interface CoursesFamily {
  course_family_id: number;
  course_family_name: string;
  year: string;
  courses: Courses[];
}
