import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const ProfileInfo: React.FC = observer(() => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(authStore.userName);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      authStore.setUserInfo(authStore.userName, authStore.userEmail, imageUrl);
      alert("프로필 이미지가 변경되었습니다!");
    }
  };

  const handleUpdateProfile = () => {
    if (!newName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (window.confirm("이름을 변경하시겠습니까?")) {
      authStore.setUserInfo(newName, authStore.userEmail, authStore.userImage);
      setIsEditingName(false);
      alert("이름이 변경되었습니다.");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>

      <label htmlFor="fileInput" className="cursor-pointer">
        <img
          src={authStore.userImage}
          alt="Profile"
          className="w-24 h-24 object-cover rounded-full border mx-auto"
        />
      </label>
      <input type="file" accept="image/*" id="fileInput" className="hidden" onChange={handleImageChange} />

      <p className="text-gray-500 mt-2">{authStore.userEmail}</p>

      {isEditingName ? (
        <div className="space-y-2 mt-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          />
          <button onClick={handleUpdateProfile} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            저장
          </button>
        </div>
      ) : (
        <p className="text-lg font-semibold mt-4">{authStore.userName}</p>
      )}

      <div className="mt-6">
        <button
          onClick={() => setIsEditingName(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          ✏️ 이름 변경
        </button>
        <button
          onClick={() => navigate("/change-password")}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
        >
          🔒 비밀번호 변경
        </button>
      </div>
    </div>
  );
});

export default ProfileInfo;
