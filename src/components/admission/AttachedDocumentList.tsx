import { List, Button } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';

const AttachedDocumentList = () => {
  const documents = [
    "Học bạ bản chính",
    "Bản photo học bạ",
    "Giấy chứng nhận hoàn thành chương trình Tiểu học",
    "Bản photo Sổ hộ khẩu",
    "Bản sao giấy khai sinh (hoặc trích lục bản sao giấy khai sinh)",
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-5 h-full flex flex-col">
      <div className="flex items-center mb-5">
        <h2 className="text-2xl font-bold mr-2">Thành phần hồ sơ</h2>
        <QuestionCircleOutlined className="text-red-500" />
      </div>
      <div className="flex-grow">
        <List
          dataSource={documents}
          renderItem={(item) => (
            <List.Item className="py-2 border-b border-gray-200 last:border-b-0">
              <span className="text-green-600 mr-2">•</span>
              {item}
            </List.Item>
          )}
        />
      </div>
      <div className="mt-5">
        <Button type="primary" className="bg-green-600 hover:bg-green-700">
          Sửa
        </Button>
      </div>
    </div>
  );
};

export default AttachedDocumentList;
