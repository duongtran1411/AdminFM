import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import AddModuleBotton from "../../components/module/AddModuleButton";
import ModuleTable from "../../components/module/ModuleTable";
import useModals from "../../hooks/useModal";
import { Module } from "../../models/courses.model";
import { moduleService } from "../../services/module-serice/module.service";
import AddModuleForm from "../../components/module/AddModuleForm";
import EditModuleForm from "../../components/module/EditModuleForm";

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

  const menu = (module: Module) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(module.module_id)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        style={{ color: "red" }}
        key="delete"
        icon={<DeleteOutlined style={{ color: "red" }} />}
        onClick={() => handleDelete(module.module_id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "module_id",
      key: "module_id",
    },
    {
      title: "Module Name",
      dataIndex: "module_name",
      key: "module_name",
    },
    {
      title: "Exam Type",
      dataIndex: "exam_type",
      key: "exam_type",
    },
    {
      title: "Số buổi",
      dataIndex: "number_of_classes",
      key: "number_of_classes",
    },
    {
      title: "",
      key: "actions",
      render: (_, record: Module) => (
        <Dropdown overlay={() => menu(record)} trigger={["click"]}>
          <Button
            type="text"
            icon={<AiOutlineMore style={{ fontSize: "20px" }} />}
            style={{ float: "right" }}
          />
        </Dropdown>
      ),
    },

    // Thêm các column nếu cần
  ];

  const handleDelete = async (mid: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Module?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await moduleService.delete(mid);
          setModule(module.filter((c) => c.module_id !== mid));
          notification.success({ message: "Module deleted successfully" });
        } catch (error) {
          notification.error({ message: "Error deleting Module" });
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

  if (loading) {
    return <p>Loading module...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <div>Loading...</div>;
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
            {/* Button Add Module */}
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

          {/* Create Module modal */}
          <AddModuleForm
            isModalVisible={isVisible("createModule")}
            hideModal={() => hideModal("createModule")}
            onModuleCreated={onCreateSuccess}
          />

          {/* Module Data Table */}
          <ModuleTable columns={columns} data={module} />

          {/* Edit Module modal */}
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
