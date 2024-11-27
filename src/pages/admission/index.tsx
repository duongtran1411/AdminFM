import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Modal, notification, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddAdmissionProgramButton from "../../components/admission/AddAdmissionProgramButton";
import AddAdmissionProgramForm from "../../components/admission/AddAdmissionProgramForm";
import AdmissionProgramTable from "../../components/admission/AdmissionProgramTable";
import PromotionDetail from "../../components/admission/PromotionDetail";
import Loading from "../../components/common/loading";
import useModals from "../../hooks/useModal";
import { AdmissionProgram } from "../../models/admission.model";
import { Promotion } from "../../models/promotions.model";
import { Response } from "../../models/response.model";
import admissionService from "../../services/admission-program-service/admission.service";
import promotionsService from "../../services/promotions-service/promotions.service";

const AdmissionPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [admissionProgramsResponse, setAdmissionProgramsResponse] =
    useState<Response<AdmissionProgram[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useState<Response<AdmissionProgram> | null>(null);
  const navigate = useNavigate();
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );
  const [isPromotionDetailVisible, setIsPromotionDetailVisible] =
    useState(false);

  const fetchAdmissionPrograms = async () => {
    try {
      const response = await admissionService.getAll();
      setAdmissionProgramsResponse(response);
    } catch (error) {
      setError("Error loading admission programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissionPrograms();
  }, []);

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Thời gian tuyển sinh",
      key: "period",
      render: (_: string, record: AdmissionProgram) => (
        <span>
          {moment(record.startDate).format("DD/MM/YYYY")} -{" "}
          {moment(record.endDate).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Thời gian đăng ký",
      key: "registration",
      render: (_: string, record: AdmissionProgram) => (
        <span>
          {moment(record.startRegistration).format("DD/MM/YYYY")} -{" "}
          {moment(record.endRegistration).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Số lượng tuyển sinh",
      dataIndex: "quota",
      key: "quota",
    },
    {
      title: "Khuyến mãi",
      key: "promotions",
      render: (record: AdmissionProgram) => {
        if (record.promotions.length === 0) {
          return (
            <span>
              <Link
                to="/promotions"
                style={{ color: "#1E90FF", cursor: "pointer" }}
              >
                N/A
              </Link>
            </span>
          );
        }
        return record.promotions.map((promo, index) => (
          <span
            key={promo.id}
            onClick={() => handlePromotionClick(promo.id)}
            style={{ cursor: "pointer", color: "#1E90FF" }}
          >
            {promo.name}
            {index < record.promotions.length - 1 && ", "}
          </span>
        ));
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record: AdmissionProgram) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleView = (id: number) => {
    navigate(`/admission/${id}`);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa chương trình tuyển sinh này?",
      okText: "Xóa",
      okType: "danger",
      onOk: async () => {
        try {
          await admissionService.delete(id);
          if (admissionProgramsResponse) {
            const updatedAdmissionPrograms =
              admissionProgramsResponse.data.filter((p) => p.id !== id);
            setAdmissionProgramsResponse({
              ...admissionProgramsResponse,
              data: updatedAdmissionPrograms,
            });
          }
          notification.success({
            message: "Chương trình tuyển sinh đã được xóa thành công",
          });
        } catch (error) {
          notification.error({
            message: "Lỗi khi xóa chương trình tuyển sinh",
          });
        }
      },
    });
  };

  const onCreateSuccess = () => {
    fetchAdmissionPrograms();
  };

  const handlePromotionClick = async (promotionId: number) => {
    try {
      const promotionDetails = await promotionsService.getPromotionById(
        promotionId,
      );
      setSelectedPromotion(promotionDetails.data);
      setIsPromotionDetailVisible(true);
    } catch (error) {
      notification.error({ message: "Error fetching promotion details" });
    }
  };

  const handlePromotionDetailClose = () => {
    setIsPromotionDetailVisible(false);
    setSelectedPromotion(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
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
          <AddAdmissionProgramButton
            onAdmissionProgramCreated={() =>
              showModal("createAdmissionProgram")
            }
          />

          <AddAdmissionProgramForm
            open={isVisible("createAdmissionProgram")}
            hideModal={() => hideModal("createAdmissionProgram")}
            onAdmissionProgramCreated={onCreateSuccess}
          />

          <AdmissionProgramTable
            columns={columns}
            data={
              admissionProgramsResponse ? admissionProgramsResponse.data : []
            }
          />
        </div>
      </div>
      <PromotionDetail
        promotion={selectedPromotion}
        isModalVisible={isPromotionDetailVisible}
        hideModal={handlePromotionDetailClose}
      />
    </>
  );
};

export default AdmissionPage;
