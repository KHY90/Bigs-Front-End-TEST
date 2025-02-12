import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const ProfileInfo: React.FC = observer(() => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(authStore.userName);

  const handleUpdateProfile = () => {
    if (!newName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    authStore.setUserInfo(newName, authStore.userEmail, authStore.userImage);
    setIsEditingName(false);
    alert("이름이 변경되었습니다.");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("정말 회원 탈퇴하시겠습니까? 탈퇴 후 계정 복구는 불가능합니다.")) {
      authStore.clearAuth();
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/signin");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>

      <img
        src={authStore.userImage}
        alt="Profile"
        className="w-24 h-24 object-cover rounded-full border mx-auto"
      />

      <p className="text-gray-500 mt-2">{authStore.userEmail}</p>

      {isEditingName ? (
        <div className="space-y-2 mt-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          />
          <div className="flex justify-center space-x-2">
            <button onClick={handleUpdateProfile} className="bg-blue-500 text-white px-4 py-2 rounded">
              저장
            </button>
            <button onClick={() => setIsEditingName(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="text-lg font-semibold mt-4">{authStore.userName}</p>
      )}

      {!isEditingName && (
        <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => setIsEditingName(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            ✏️ 이름 변경
          </button>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🚨 회원 탈퇴
          </button>
        </div>
      )}
    </div>
  );
});

export default ProfileInfo;
