import { useState, useEffect } from "react";
import { notification } from "antd";
import { StudentResit } from "../models/student-resit.model";
import { moduleService } from "../services/module-serice/module.service";
import classService from "../services/class-service/class.service";
import studentResitService from "../services/student-resit-service/student.resit.service";
import { studentService } from "../services/student-service/student.service";

export interface ResitRequestWithDetails extends StudentResit {
  moduleCode?: string;
  className?: string;
  student?: string;
}

export const useResitRequests = () => {
  const [resitRequests, setResitRequests] = useState<ResitRequestWithDetails[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [editingRequest, setEditingRequest] =
    useState<ResitRequestWithDetails | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const fetchResitRequests = async () => {
    setLoading(true);
    try {
      const response = await studentResitService.getAll();
      const detailedRequests = await Promise.all(
        response.data.map(async (request) => {
          const [moduleResponse, classResponse, studentResponse] =
            await Promise.all([
              moduleService.getModuleById(request.moduleId as number),
              classService.getClassById(request.classId as number),
              studentService.findOne(request.studentId as number),
            ]);

          return {
            ...request,
            moduleCode: moduleResponse.data.code,
            className: classResponse.data.name,
            student: studentResponse.data.studentId,
          };
        }),
      );
      setResitRequests(detailedRequests);
    } catch (error) {
      console.error("Failed to fetch resit requests:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách đăng ký học lại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: ResitRequestWithDetails) => {
    setEditingRequest(record);
    setEditNote(record.note || "");
    setEditStatus(record.status || "");
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingRequest) return;

    try {
      await studentResitService.update(editingRequest.id!, {
        status: editStatus,
        note: editNote,
      });

      notification.success({
        message: "Thành công",
        description: "Cập nhật đơn đăng ký thành công",
      });

      const updatedRequests = resitRequests.map((request) =>
        request.id === editingRequest.id
          ? { ...request, status: editStatus, note: editNote }
          : request,
      );
      setResitRequests(updatedRequests);
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật đơn đăng ký",
      });
    }
  };

  useEffect(() => {
    fetchResitRequests();
  }, []);

  return {
    resitRequests,
    loading,
    editingRequest,
    isModalVisible,
    editNote,
    editStatus,
    handleEdit,
    handleUpdate,
    setIsModalVisible,
    setEditNote,
    setEditStatus,
  };
};
