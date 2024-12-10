import { Checkbox } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddApplicationButton from "../../components/application/AddApplicationButton";
import ApplicationTable from "../../components/application/ApplicationTable";
import ButtonChangeStatus from "../../components/application/ButtonChangeStatus";
import ChangeStatusForm from "../../components/application/ChangeStatusForm";
import Loading from "../../components/common/loading";
import useModals from "../../hooks/useModal";
import { Application } from "../../models/application.model";
import { Response } from "../../models/response.model";
import applicationService from "../../services/application-service/application.service";
import { CoursesFamily } from "../../models/courses.model";

const ApplicationPage = () => {
  const navigate = useNavigate();
  const { admissionId } = useParams();
  const { isVisible, showModal, hideModal } = useModals();
  const [applicationResponse, setApplicationResponse] = useState<Response<
    Application[]
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<
    number[]
  >([]);

  const fetchApplication = async () => {
    try {
      const data = await applicationService.getByAdmissionId(
        Number(admissionId),
      );
      setApplicationResponse(data);
    } catch (error) {
      setError("Error loading Application");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
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
          checked={selectedApplicationIds.includes(record.id)}
          onChange={() => handleSelect(record.id)}
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
    navigate(`/admission/${admissionId}/application/${id}`);
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
              onApplicationCreate={() =>
                navigate(`/admission/${admissionId}/application`)
              }
            />
          </div>
        </div>
        <ApplicationTable
          data={applicationResponse?.data || []}
          columns={columns}
          onEdit={handleEdit}
          loading={loading}
        />
      </div>
      <ChangeStatusForm
        isModalVisible={isVisible("changeStatusApplication")}
        hideModal={() => hideModal("changeStatusApplication")}
        onStatusChanged={onUpdateSuccess}
        selectedIds={selectedApplicationIds}
      />
    </div>
  );
};

export default ApplicationPage;
