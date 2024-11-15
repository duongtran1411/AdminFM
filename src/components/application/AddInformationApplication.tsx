import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Table,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { CoursesFamily } from "../../models/courses.model";
import { Priority } from "../../models/priority.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import priorityService from "../../services/priority-service/priority.service";

interface PriorityData {
  id: number;
  priorityId: number | null;
  name?: string;
  description: string;
  isSelected?: boolean;
  isCustom?: boolean;
}

const AddInformationApplication = ({ setFormData, formRef }) => {
  const [form] = Form.useForm();
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [isSpecialCare, setIsSpecialCare] = useState(false);
  const [priorityOptions, setPriorityOptions] = useState<Priority[]>([]);
  const [priorityData, setPriorityData] = useState<PriorityData[]>([]);
  const [newPriorityName, setNewPriorityName] = useState<string>("");
  const [isAddingPriority, setIsAddingPriority] = useState(false);
  const [priorityToDelete, setPriorityToDelete] = useState<number | null>(null);
  const [editingPriorityId, setEditingPriorityId] = useState<number | null>(
    null,
  );
  const [editingPriorityName, setEditingPriorityName] = useState<string>("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const [coursesResponse, prioritiesResponse] = await Promise.all([
        courseFamilyService.getAll(),
        priorityService.getAll(),
      ]);
      setCoursesFamily(coursesResponse);
      setPriorityOptions(prioritiesResponse.data);
    };
    fetchInitialData();
  }, []);

  // Form handlers
  const handleFormChange = () => {
    const formValues = form.getFieldsValue();
    setFormData({
      ...formValues,
      tick: isSpecialCare,
      intensiveCareList: isSpecialCare
        ? priorityData
            .filter((p) => p.priorityId && p.description)
            .map((priority) => ({
              priorityId: priority.priorityId,
              description: priority.description,
            }))
        : [],
    });
  };

  const handlePrioritySelect = (priorityId: number, checked: boolean) => {
    if (checked) {
      const priority = priorityOptions.find((p) => p.id === priorityId);
      if (priority) {
        setPriorityData((prev) => [
          ...prev,
          {
            id: Date.now(),
            priorityId: priority.id || null,
            name: priority.name,
            description: "",
            isSelected: true,
          },
        ]);
      }
    } else {
      setPriorityData((prev) =>
        prev.filter((p) => p.priorityId !== priorityId),
      );
    }
    handleFormChange();
  };

  const handlePriorityChange = (id: number, field: string, value: any) => {
    setPriorityData((prev) =>
      prev.map((priority) =>
        priority.id === id ? { ...priority, [field]: value } : priority,
      ),
    );
    handleFormChange();
  };

  const handleAddCustomPriority = () => setIsAddingPriority(true);

  const handleConfirmPriority = async () => {
    if (!newPriorityName.trim()) return;

    try {
      const response = await priorityService.add({ name: newPriorityName });
      setPriorityOptions((prev) => [...prev, response.data]);
      setNewPriorityName("");
      setIsAddingPriority(false);
    } catch (error) {
      console.error("Error adding priority:", error);
    }
  };

  const handleDeletePriority = (id: number | string) => {
    if (id === "new") {
      setIsAddingPriority(false);
      setNewPriorityName("");
    } else {
      setPriorityToDelete(id as number);
    }
  };

  const handleConfirmDelete = async () => {
    if (priorityToDelete === null) return;

    try {
      await priorityService.delete(priorityToDelete);
      setPriorityOptions((prev) =>
        prev.filter((p) => p.id !== priorityToDelete),
      );
      setPriorityData((prev) =>
        prev.filter((p) => p.priorityId !== priorityToDelete),
      );
      setPriorityToDelete(null);
    } catch (error) {
      console.error("Error deleting priority:", error);
    }
  };

  const handleUpdatePriority = async (id: number) => {
    if (!editingPriorityName.trim()) return;

    try {
      const response = await priorityService.update(id, {
        name: editingPriorityName,
      });
      setPriorityOptions((prev) =>
        prev.map((p) => (p.id === id ? response.data : p)),
      );
      setEditingPriorityId(null);
      setEditingPriorityName("");
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          <i>Thông tin cá nhân</i>
        </h2>
      </div>

      <div className="p-6">
        <Form
          ref={formRef}
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          className="space-y-6"
        >
          <div className="p-2 bg-gray-50 rounded-lg">
            <h2 className="text-md font-medium text-gray-700 mb-4">
              Thông tin cơ bản
            </h2>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" className="rounded-md" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                  ]}
                >
                  <Input
                    placeholder="Nhập số điện thoại của bạn"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="cardId"
                  label="Card ID"
                  rules={[
                    { required: true, message: "Vui lòng nhập card ID!" },
                  ]}
                >
                  <Input placeholder="Nhập card ID" className="rounded-md" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính!" },
                  ]}
                >
                  <Select placeholder="Chọn giới tính" className="rounded-md">
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                    <Select.Option value="Khác">Khác</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="birthdate"
                  label="Ngày sinh"
                  rules={[
                    { required: true, message: "Vui lòng nhập ngày sinh!" },
                  ]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Contact Information Section */}
          <div className="p-2 bg-gray-50 rounded-lg">
            <h2 className="text-md font-medium text-gray-700 mb-4">
              Thông tin liên hệ
            </h2>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Nhập Email" className="rounded-md" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="permanentResidence"
                  label="Hộ khẩu thường trú"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập hộ khẩu thường trú!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập hộ khẩu thường trú"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <h2 className="text-md font-medium text-gray-700 mb-4">
              Thông tin học tập
            </h2>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="courses_family_id"
                  label="Chương trình học"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn chương trình học!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn chương trình học"
                    className="rounded-md"
                  >
                    {coursesfamily.map((c) => (
                      <Select.Option
                        key={c.course_family_id}
                        value={c.course_family_id}
                      >
                        {c.course_family_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-4">
              <Checkbox
                checked={isSpecialCare}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsSpecialCare(checked);
                  const formData = {
                    ...form.getFieldsValue(),
                    tick: checked,
                    intensiveCareList: priorityData
                      .filter((p) => p.priorityId && p.description)
                      .map((priority) => ({
                        priorityId: priority.priorityId,
                        description: priority.description,
                      })),
                  };
                  setFormData(formData);
                }}
                className="mr-2"
              />
              <span className="text-md font-medium text-gray-700">
                Chăm sóc đặc biệt
              </span>
            </div>

            {isSpecialCare && (
              <div className="mt-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Danh sách diện ưu tiên
                  </h3>
                  <Table
                    dataSource={[
                      ...priorityOptions,
                      ...(isAddingPriority
                        ? [{ id: "new", name: "", isNew: true }]
                        : []),
                      ...priorityData.filter((p) => !p.priorityId),
                    ]}
                    pagination={false}
                    rowKey={(record) => record.id?.toString() || ""}
                    className="rounded-lg border border-gray-200 mb-4"
                  >
                    <Table.Column
                      title="Tên diện ưu tiên"
                      width="30%"
                      render={(_, record: any) => {
                        if (record.isNew) {
                          return (
                            <div className="flex gap-2">
                              <Input
                                value={newPriorityName}
                                onChange={(e) =>
                                  setNewPriorityName(e.target.value)
                                }
                                placeholder="Nhập tên diện ưu tiên"
                                className="rounded-md"
                              />
                              <Button
                                type="primary"
                                onClick={handleConfirmPriority}
                                disabled={!newPriorityName.trim()}
                              >
                                Xác nhận
                              </Button>
                            </div>
                          );
                        }

                        if (editingPriorityId === record.id) {
                          return (
                            <div className="flex gap-2">
                              <Input
                                value={editingPriorityName}
                                onChange={(e) =>
                                  setEditingPriorityName(e.target.value)
                                }
                                placeholder="Nhập tên diện ưu tiên"
                                className="rounded-md"
                              />
                              <Button
                                type="primary"
                                onClick={() => handleUpdatePriority(record.id)}
                                disabled={!editingPriorityName.trim()}
                              >
                                Xác nhận
                              </Button>
                              <Button
                                onClick={() => {
                                  setEditingPriorityId(null);
                                  setEditingPriorityName("");
                                }}
                              >
                                Hủy
                              </Button>
                            </div>
                          );
                        }

                        return <span>{record.name}</span>;
                      }}
                    />
                    <Table.Column
                      title="Mô tả"
                      width="40%"
                      render={(_, record: any) => {
                        if (!record.isCustom) {
                          const selectedPriority = priorityData.find(
                            (p) => p.priorityId === record.id,
                          );
                          if (selectedPriority) {
                            return (
                              <Input
                                value={selectedPriority.description}
                                onChange={(e) =>
                                  handlePriorityChange(
                                    selectedPriority.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Nhập mô tả"
                                className="rounded-md"
                              />
                            );
                          }
                          return null;
                        }
                        return (
                          <Input
                            value={record.description}
                            onChange={(e) =>
                              handlePriorityChange(
                                record.id,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Nhập mô tả"
                            className="rounded-md"
                          />
                        );
                      }}
                    />
                    <Table.Column
                      title="Bắt buộc"
                      width="10%"
                      align="center"
                      render={(_, record: any) => (
                        <Checkbox
                          checked={priorityData.some((p) =>
                            !record.isCustom
                              ? p.priorityId === record.id
                              : p.id === record.id,
                          )}
                          onChange={(e) => {
                            if (!record.isCustom) {
                              handlePrioritySelect(record.id, e.target.checked);
                            } else {
                              if (!e.target.checked) {
                                setPriorityData((prev) =>
                                  prev.filter((p) => p.id !== record.id),
                                );
                              }
                            }
                          }}
                        />
                      )}
                    />
                    <Table.Column
                      width="20%"
                      align="center"
                      render={(_, record: any) => (
                        <div className="flex justify-center gap-2">
                          {!record.isNew && editingPriorityId !== record.id && (
                            <Button
                              type="link"
                              onClick={() => {
                                setEditingPriorityId(record.id);
                                setEditingPriorityName(record.name);
                              }}
                              icon={<EditOutlined />}
                            ></Button>
                          )}
                          {record.isNew && (
                            <Button
                              type="text"
                              danger
                              onClick={() => handleDeletePriority("new")}
                              icon={<DeleteOutlined />}
                            />
                          )}
                        </div>
                      )}
                    />
                  </Table>
                </div>

                <Button
                  onClick={handleAddCustomPriority}
                  type="link"
                  className="text-blue-500 pl-0"
                >
                  + Thêm diện ưu tiên khác
                </Button>
              </div>
            )}
          </div>
        </Form>
      </div>

      <Modal
        title="Xác nhận xóa"
        open={priorityToDelete !== null}
        onOk={handleConfirmDelete}
        onCancel={() => setPriorityToDelete(null)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa diện ưu tiên này không?</p>
      </Modal>
    </div>
  );
};

export default AddInformationApplication;
