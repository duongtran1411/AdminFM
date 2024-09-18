import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
    onUserCreated: () => void;
}

const AddUserButton = ({ onUserCreated }: Props) => {
    return (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={onUserCreated}>
                New User
            </Button>
        </div>
    )
}

export default AddUserButton;