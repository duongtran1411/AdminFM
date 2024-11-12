import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, Modal, notification, Tooltip } from "antd";
import { useEffect, useState } from "react";
import Loading from "../../components/common/loading";
import AddModuleBotton from "../../components/module/AddModuleButton";
import AddModuleForm from "../../components/module/AddModuleForm";
import EditModuleForm from "../../components/module/EditModuleForm";
import ModuleTable from "../../components/module/ModuleTable";
import useModals from "../../hooks/useModal";
import { Module } from "../../models/courses.model";
import { moduleService } from "../../services/module-serice/module.service";

const ModulePage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [module, setModule] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const fetchModule = async () => {
    try {
      const data = await moduleService.getAllModules();
      setModule(data);
    } catch (error) {
      setError("Error loading Modules");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchModule();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "module_id",
      key: "module_id",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên môn học",
      dataIndex: "module_name",
      key: "module_name",
    },
    {
      title: "Loại thi",
      dataIndex: "exam_type",
      key: "exam_type",
    },
    {
      title: "Số buổi",
      dataIndex: "number_of_classes",
      key: "number_of_classes",
    },
    {
      title: "Danh sách đầu điểm",
      key: "gradeCategories",
      render: (record: Module) => {
        return record.gradeCategories && record.gradeCategories.length > 0
          ? record.gradeCategories.map((category) => category.name).join(", ")
          : "N/A";
      },
    },
    {
      title: "Term NO.",
      dataIndex: "term_number",
      key: "term_number",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Module) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.module_id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              onClick={() => handleDelete(record.module_id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleDelete = async (mid: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa môn học này?",
      okText: "Xóa",
      okType: "danger",
      onOk: async () => {
        try {
          await moduleService.delete(mid);
          setModule(module.filter((c) => c.module_id !== mid));
          notification.success({ message: "Xóa môn học thành công!" });
        } catch (error) {
          notification.error({ message: "Lỗi xóa môn học" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const moduleEdit = module.find((c) => c.module_id === id);
    if (moduleEdit) {
      setSelectedModule(moduleEdit);
      showModal("editModule");
    }
  };

  const onCreateSuccess = () => {
    fetchModule();
  };

  const onUpdateSuccess = () => {
    fetchModule();
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <>
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
            <AddModuleBotton
              onModuleCreated={() => showModal("createModule")}
            />
          </div>
          <Input.Search
            placeholder="Tìm kiếm tên Module..."
            allowClear
            // onSearch={handleSearch}
            style={{ width: 400, marginBottom: 16 }}
          />

          <AddModuleForm
            isModalVisible={isVisible("createModule")}
            hideModal={() => hideModal("createModule")}
            onModuleCreated={onCreateSuccess}
          />

          <ModuleTable columns={columns} data={module} />

          <EditModuleForm
            isModalVisible={isVisible("editModule")}
            hideModal={() => hideModal("editModule")}
            module={selectedModule}
            onUpdate={onUpdateSuccess}
          />
        </div>
      </div>
    </>
  );
};

export default ModulePage;
