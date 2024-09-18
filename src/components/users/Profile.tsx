import { Modal, Image } from "antd";
import { useEffect, useState } from "react";
import * as jwt_decode from "jwt-decode";
import { userService } from "../../services/user-service/user.service";

interface ProfileData {
  id: number;
  username: string;
  password: string;
  email: string;
}

interface ProfileProps {
  isModalVisible: boolean;
  hideModal: () => void;
}

const Profile = ({ isModalVisible, hideModal }: ProfileProps) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: any = jwt_decode.jwtDecode(token);
        const userId = decoded.sub;
        const userProfile = await userService.getUserById(userId);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchProfile();
    }
  }, [isModalVisible]);

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Your Profile</div>}
      visible={isModalVisible}
      onCancel={hideModal}
      centered
      footer={null}
    >
      <>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "100px", height: "100px" }}>
            <Image
              style={{ borderRadius: "50%", marginRight: "20px" }}
              src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
            />
          </div>
          <div className="ml-5">
            <p>
              <strong>Username: </strong> {profile?.username}
            </p>
            <p>
              <strong>Email: </strong>
              {profile?.email}
            </p>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default Profile;
