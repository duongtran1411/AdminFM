import React, { useEffect, useState } from "react";
import { Modal, Input, notification } from "antd";
import type { TableProps } from "antd";
import { teacherService } from "../../services/teacher-service/teacher.service";
import { Teachers } from "../../models/teacher.model";
import useModals from "../../hooks/useModal";
import AddTeacherButton from "../../components/teachers/AddTeacherButton";
import AddTeacherForm from "../../components/teachers/AddTeacherForm";
import TeacherTable from "../../components/teachers/TeacherTable";
import EditTeacherForm from "../../components/teachers/EditTeacherForm";
import Loading from "../../components/common/loading";

const TeacherPage: React.FC = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [searchTeacher, setSearchTeacher] = useState<Teachers[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teachers | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.findAll();
      setTeachers(data);
      setSearchTeacher(data);
    } catch (error) {
      setError("Error loading teachers");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTeachers();
  }, []);

  const columns: TableProps<Teachers>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên giảng viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Ngày Sinh",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Module",
      key: "module_name",
      render: (record: Teachers) => {
        return record.modules.map((module) => module.code).join(", ");
      },
    },
    {
      title: "Shift",
      key: "shift_name",
      render: (record: Teachers) => {
        return record.working_shift.map((shift) => shift.name).join(", ");
      },
    },
    {
      title: "Ngày vào làm",
      dataIndex: "working_date",
      key: "working_date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];
  const handleEdit = (id: number) => {
    const teacher = teachers.find((teacher) => teacher.id === id);
    if (teacher) {
      setSelectedTeacher(teacher);
      showModal("editTeacher");
    }
  };
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this teacher?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await teacherService.delete(id);
          setTeachers(teachers.filter((teacher) => teacher.id !== id));
          notification.success({ message: "Teacher deleted successfully" });
          fetchTeachers();
        } catch (error) {
          notification.error({ message: "Error deleting teacher" });
        }
      },
    });
  };

  const onCreateSuccess = () => {
    fetchTeachers();
  };

  const onUpdateSuccess = () => {
    fetchTeachers();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          {/* Button Add Teacher */}
          <AddTeacherButton
            onTeacherCreated={() => showModal("createTeacher")}
          />
        </div>
        <Input.Search
          placeholder="Tìm kiếm tên giảng viên..."
          allowClear
          // onSearch={handleSearch}
          style={{ width: 400, marginBottom: 16 }}
        />

        {/* Create Teacher modal */}
        <AddTeacherForm
          isModalVisible={isVisible("createTeacher")}
          hideModal={() => hideModal("createTeacher")}
          onTeacherCreated={onCreateSuccess}
        />

        {/* Teacher Data Table */}
        <TeacherTable
          columns={columns}
          data={searchTeacher}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* Edit Teacher modal */}
        <EditTeacherForm
          isModalVisible={isVisible("editTeacher")}
          hideModal={() => hideModal("editTeacher")}
          teacher={selectedTeacher}
          onUpdate={onUpdateSuccess}
        />
      </div>
    </div>
  );
};

export default TeacherPage;
