import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [userEmail] = useState(localStorage.getItem("userEmail") || "이메일 없음");
  const [userImage, setUserImage] = useState(localStorage.getItem("userImage") || "/image/avatar.png");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
      localStorage.setItem("userImage", imageUrl);
      alert("프로필 이미지가 변경되었습니다!");
    }
  };

  const handleUpdateProfile = () => {
    if (!newName.trim()) {
      alert("⚠️ 이름을 입력해주세요.");
      return;
    }

    if (window.confirm("이름을 변경하시겠습니까?")) {
      localStorage.setItem("userName", newName);
      setUserName(newName);
      setIsEditingName(false);
      alert("이름이 변경되었습니다.");
    }
  };

  const handleCancelEdit = () => {
    if (window.confirm("이름 변경을 취소하시겠습니까?")) {
      setIsEditingName(false);
      setNewName(userName);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">프로필</h1>

        <div className="flex items-center space-x-4 mb-6">
          <label htmlFor="fileInput" className="cursor-pointer">
            <img src={userImage} alt="Profile" className="w-20 h-20 object-cover rounded-full border" />
          </label>
          <input type="file" accept="image/*" id="fileInput" className="hidden" onChange={handleImageChange} />

          <div>
            <p className="text-gray-500">{userEmail}</p>
            {isEditingName ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border p-1 rounded w-full"
                  placeholder="새로운 이름"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 w-full"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-lg font-semibold">{userName}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setIsEditingName(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            ✏️ 이름 변경
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            🔒 비밀번호 변경
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
