export interface Module {
  module_id: number;
  module_name: string;
  module_code: string;
  exam_type: string;
}

export interface Courses {
  course_id: number;
  course_name: string;
  course_code: string;
  course_family_id: number;
  modules: Module[];
}
