import { Checkbox, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddAdmissionProgramForm from "../../components/admission/AddAdmissionProgramForm";
import AddApplicationButton from "../../components/application/AddApplicationButton";
import ApplicationTable from "../../components/application/ApplicationTable";
import ButtonChangeStatus from "../../components/application/ButtonChangeStatus";
import ChangeStatusForm from "../../components/application/ChangeStatusForm";
import Loading from "../../components/common/loading";
import useModals from "../../hooks/useModal";
import { AdmissionProgram } from "../../models/admission.model";
import { Application } from "../../models/application.model";
import { CoursesFamily } from "../../models/courses.model";
import { Response } from "../../models/response.model";
import admissionService from "../../services/admission-program-service/admission.service";
import applicationService from "../../services/application-service/application.service";

const ApplicationList = () => {
  const navigate = useNavigate();
  const { isVisible, showModal, hideModal } = useModals();
  const [applicationResponse, setApplicationResponse] = useState<Response<
    Application[]
  > | null>(null);
  const [admissionPrograms, setAdmissionPrograms] = useState<
    AdmissionProgram[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<
    number[]
  >([]);
  const [showAddAdmission, setShowAddAdmission] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    admissionProgramId: null,
  });
  const [filterLoading, setFilterLoading] = useState(false);

  const fetchApplication = async () => {
    try {
      const data = await applicationService.getAll();
      setApplicationResponse(data);
    } catch (error) {
      setError("Error loading Application");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmissionPrograms = async () => {
    try {
      const response = await admissionService.getAll();
      setAdmissionPrograms(response.data);
    } catch (error) {
      setError("Error loading Admission Programs");
    }
  };

  useEffect(() => {
    fetchApplication();
    fetchAdmissionPrograms();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedApplicationIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((key) => key !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const columns = [
    {
      title: (
        <Checkbox
          onChange={() => {
            if (
              selectedApplicationIds.length === applicationResponse?.data.length
            ) {
              setSelectedApplicationIds([]);
            } else {
              setSelectedApplicationIds(
                applicationResponse?.data
                  ?.map((item) => item.id)
                  .filter((id): id is number => id !== undefined) || [],
              );
            }
          }}
          checked={
            selectedApplicationIds.length === applicationResponse?.data.length
          }
        />
      ),
      dataIndex: "select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedApplicationIds.includes(record.id!)}
          onChange={() => handleSelect(record.id!)}
        />
      ),
    },
    {
      title: "Họ và Tên",
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
      title: "Hộ khẩu thường trú",
      dataIndex: "permanentResidence",
      key: "permanentResidence",
    },
    {
      title: "CT Học",
      dataIndex: "coursesFamily",
      key: "coursesFamily",
      render: (coursesFamily: CoursesFamily) =>
        coursesFamily.course_family_name,
    },
    {
      title: "Chương trình tuyển sinh",
      dataIndex: ["admissionProgram", "name"],
      key: "admissionProgram",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  const handleEdit = (id: number) => {
    const application = applicationResponse?.data.find((app) => app.id === id);
    if (application?.admissionProgram?.id) {
      navigate(
        `/admission/${application.admissionProgram.id}/application/${id}`,
      );
    }
  };

  const onUpdateSuccess = () => {
    fetchApplication();
    setSelectedApplicationIds([]);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleApplicationCreate = () => {
    // Show modal to select admission program
    showModal("selectAdmissionProgram");
  };

  const handleAdmissionProgramSelect = (value: string | number) => {
    if (value === "add_new") {
      // Chuyển đến trang admission và mở modal
      navigate("/admission");
      setShowAddAdmission(true);
    } else {
      hideModal("selectAdmissionProgram");
      navigate(`/admission/${value}/application`);
    }
  };

  const handleAddAdmissionSuccess = () => {
    fetchAdmissionPrograms();
    setShowAddAdmission(false);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setFilterLoading(true);
    applicationService
      .getAll({ ...filters, [key]: value })
      .then(setApplicationResponse)
      .finally(() => setFilterLoading(false));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            {selectedApplicationIds.length > 0 && (
              <ButtonChangeStatus
                onChangeStatusClick={() => showModal("changeStatusApplication")}
              />
            )}
            <AddApplicationButton
              onApplicationCreate={handleApplicationCreate}
            />
          </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Input
            placeholder="Tìm kiếm theo họ tên"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            style={{ width: "200px", marginRight: "8px" }}
          />
          <Select
            placeholder="Chọn chương trình tuyển sinh"
            value={filters.admissionProgramId}
            onChange={(value) =>
              handleFilterChange("admissionProgramId", value)
            }
            style={{ width: "20%", marginRight: "8px" }}
          >
            <Select.Option value={null}>Tất cả</Select.Option>
            {admissionPrograms.map((program) => (
              <Select.Option key={program.id} value={program.id}>
                {program.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <ApplicationTable
          data={applicationResponse?.data || []}
          columns={columns}
          onEdit={handleEdit}
          loading={filterLoading}
        />
      </div>
      <ChangeStatusForm
        isModalVisible={isVisible("changeStatusApplication")}
        hideModal={() => hideModal("changeStatusApplication")}
        onStatusChanged={onUpdateSuccess}
        selectedIds={selectedApplicationIds}
      />

      <Modal
        title="Chọn chương trình tuyển sinh"
        open={isVisible("selectAdmissionProgram")}
        onCancel={() => hideModal("selectAdmissionProgram")}
        footer={null}
        width={600}
        centered
        bodyStyle={{ padding: "24px" }}
      >
        <div>
          <p style={{ margin: "0 0 16px", color: "#666", fontSize: "1rem" }}>
            Vui lòng chọn chương trình tuyển sinh để tiếp tục
          </p>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn chương trình tuyển sinh"
            onChange={handleAdmissionProgramSelect}
            size="large"
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {admissionPrograms.map((program) => (
              <Select.Option key={program.id} value={program.id}>
                {program.name}
              </Select.Option>
            ))}
            <Select.Option
              value="add_new"
              style={{ borderTop: "1px solid #f0f0f0", color: "#1890ff" }}
            >
              + Thêm CT tuyển sinh
            </Select.Option>
          </Select>
        </div>

        <AddAdmissionProgramForm
          open={showAddAdmission}
          hideModal={() => setShowAddAdmission(false)}
          onAdmissionProgramCreated={handleAddAdmissionSuccess}
        />
      </Modal>
    </div>
  );
};

export default ApplicationList;
