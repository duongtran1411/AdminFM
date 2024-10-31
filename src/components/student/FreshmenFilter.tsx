import { SearchOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";

interface StudentFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  admissionPrograms: string[];
  selectedAdmissionProgram: string | null;
  onAdmissionProgramChange: (value: string | null) => void;
  coursesFamilies: string[];
  selectedCoursesFamily: string | null;
  onCoursesFamilyChange: (value: string | null) => void;
}

const FreshmenFilter: React.FC<StudentFilterProps> = ({
  searchTerm,
  onSearchChange,
  admissionPrograms,
  selectedAdmissionProgram,
  onAdmissionProgramChange,
  coursesFamilies,
  selectedCoursesFamily,
  onCoursesFamilyChange,
}) => {
  return (
    <div className="flex justify-start mb-4 gap-5">
      <Input
        placeholder="Tìm kiếm theo họ tên"
        prefix={<SearchOutlined />}
        style={{ width: 300 }}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select
        style={{ width: 260 }}
        placeholder="Lọc theo chương trình tuyển sinh"
        allowClear
        value={selectedAdmissionProgram}
        onChange={onAdmissionProgramChange}
      >
        {admissionPrograms.map((program) => (
          <Select.Option key={program} value={program}>
            {program}
          </Select.Option>
        ))}
      </Select>
      <Select
        style={{ width: 200 }}
        placeholder="Lọc theo khóa học"
        allowClear
        value={selectedCoursesFamily}
        onChange={onCoursesFamilyChange}
      >
        {coursesFamilies.map((family) => (
          <Select.Option key={family} value={family}>
            {family}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default FreshmenFilter;
