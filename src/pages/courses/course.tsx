// import { useEffect, useState } from "react";
// import { Button, Layout, Dropdown, Input } from "antd";
// import TabsMenu from "../../components/student/TabsMenu";
// import useModals from "../../hooks/useModal";
// import { AiOutlineMore } from "react-icons/ai";
// import CoursesTable from "../../components/course/CourseTable";
// import AddCourseButton from "../../components/course/AddCourseButton";
// import { courseService } from "../../services/courses-service/courses.service";

// interface CoursesList {}

// const CoursePage = () => {
//   const { isVisible, showModal, hideModal } = useModals();
//   const [courses, setCourses] = useState<CoursesList[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState<CoursesList | null>(
//     null,
//   );

//   const fetchCourses = async () => {
//     try {
//       const data = await courseService.getAllCourses();
//       setCourses(data);
//     } catch (error) {
//       setError("Error loading courses");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const columns = [
//     {
//       title: "Center",
//       dataIndex: "center",
//       key: "center",
//     },
//     {
//       title: "Course Name",
//       dataIndex: "course_name",
//       key: "course_name",
//     },
//     {
//       title: "Course Code",
//       dataIndex: "course_code",
//       key: "course_code",
//     },
//     // Thêm các column nếu cần
//   ];
//   const onCreateSuccess = () => {
//     fetchCourses();
//   };

//   const onUpdateSuccess = () => {
//     fetchCourses();
//   };

//   if (loading) {
//     return <p>Loading courses...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   return (
//     <>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           padding: "20px",
//         }}
//       >
//         <div style={{ width: "100%", maxWidth: "100%" }}>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               marginBottom: "16px",
//             }}
//           >
//             {/* Button Add Course */}
//             <AddCourseButton
//               onCourseCreated={() => showModal("createCourse")}
//             />
//           </div>
//           <Input.Search
//             placeholder="Tìm kiếm tên Course..."
//             allowClear
//             // onSearch={handleSearch}
//             style={{ width: 400, marginBottom: 16 }}
//           />

//           {/* Create Course modal */}
//           <AddCourseForm
//             isModalVisible={isVisible("createCourse")}
//             hideModal={() => hideModal("createCourse")}
//             onTeacherCreated={onCreateSuccess}
//           />

//           {/* Course Data Table */}
//           <CoursesTable
//             columns={columns}
//             data={courses}
//             onDelete={handleDelete}
//             onEdit={handleEdit}
//           />

//           {/* Edit Course modal */}
//           <EditCourseForm
//             isModalVisible={isVisible("editCourse")}
//             hideModal={() => hideModal("editCourse")}
//             teacher={selectedCourse}
//             onUpdate={onUpdateSuccess}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default CoursePage;
