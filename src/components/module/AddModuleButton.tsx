import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
    onModuleCreated: () => void;
}

const AddModuleBotton = ({ onModuleCreated }: Props) => {
    return (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={onModuleCreated}>
                New Module
            </Button>
        </div>
    )
}

export default AddModuleBotton;