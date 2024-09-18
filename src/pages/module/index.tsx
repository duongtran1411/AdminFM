import { useState } from 'react';
import { Button, Layout, Dropdown, Menu, Form, Modal, Input, Select } from 'antd';
import TabsMenu from '../../components/student/TabsMenu';
import useModals from '../../hooks/useModal';
import { AiOutlineMore } from 'react-icons/ai';
import AddCourseButton from '../../components/courses/AddCourseButton';
import ModuleTable from '../../components/module/ModuleTable';
import AddModuleBotton from '../../components/module/AddModuleButton';

interface ModuleList {

}

const ModulePage = () => {
    const { isVisible, showModal, hideModal } = useModals();
    const [searchModule, setSearchModule] = useState<ModuleList[]>([]);



    const menu = (module: ModuleList) => (
        <Menu>
            <Menu.Item
                key="edit"
            // onClick={() => showEditModal(user)}
            >
                Edit
            </Menu.Item>
            <Menu.Item
                key="delete"
            // onClick={() => handleDelete(user)}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'Name',
            dataIndex: 'module_name',
            key: 'module_name',
        },
        {
            title: 'Course',
            dataIndex: 'course_name',
            key: 'course_name',
        },
        {
            title: 'Type',
            dataIndex: 'type_name',
            key: 'type_name',
        },
        {
            title: 'Center',
            dataIndex: 'center',
            key: 'center',
        },
        {
            title: 'Exam Type',
            dataIndex: 'exam_type',
            key: 'exam_type',
        },
        // Thêm các column nếu cần
        {
            title: "",
            key: "actions",
            render: (_, record: ModuleList) => (
                <Dropdown overlay={() => menu(record)} trigger={["click"]}>
                    <Button
                        type="text"
                        icon={<AiOutlineMore style={{ fontSize: "20px" }} />}
                        style={{ float: "right" }}
                    />
                </Dropdown>
            ),
        },
    ];


    return (
        <>
            {/* Edit modal */}
            {/* <Modal
                title="Edit User"
                footer={[
                    <Button key="cancel" >
                        Cancel
                    </Button>,
                    <Button key="save" type="primary">
                        Save
                    </Button>,
                ]}
                centered
            >
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: "Please input the username!" },
                        ]}
                    >
                        <Input placeholder='Enter Username' />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please input the email!" },
                            { type: "email", message: "The input is not valid E-mail!" },
                        ]}
                    >
                        <Input placeholder='Enter Email' />
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[
                            { required: true },
                        ]}
                    >
                    </Form.Item>
                </Form>
            </Modal> */}

            <Layout
                className="rounded-lg flex justify-center items-center"
                style={{
                    background: "white",
                    padding: "20px",
                    minHeight: "100vh",
                }}
            >
                <div className="w-full max-w-6xl mb-auto">
                    <div className="flex justify-between flex-wrap">
                        <TabsMenu tabItems={[]} />
                        <AddModuleBotton onModuleCreated={() => showModal("createModule  ")} />
                    </div>
                    {/* <AddCourseForm isModalVisible={isVisible("createCourse")} hideModal={() => hideModal("createCourse")} onCourseCreated={} /> */}
                    <Input.Search
                        placeholder="Nhập tên Module để tìm kiếm..."
                        allowClear
                        // onSearch={handleSearch}
                        style={{ width: 350, marginBottom: 16 }}
                    />
                    <ModuleTable data={searchModule} columns={columns} />
                </div>
            </Layout>
        </>
    );
};

export default ModulePage;
