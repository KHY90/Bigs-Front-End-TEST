import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchWithToken } from "../utils/fetchWithToken";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // 🔹 비밀번호 변경 요청
  const handleChangePassword = async () => {
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await fetchWithToken("/api/users/change-password", {
        method: "PATCH",
        data: { currentPassword, newPassword },
        headers: { "Content-Type": "application/json" },
      });

      alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
      navigate("/signin");
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      setError("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">비밀번호 변경</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* 🔹 현재 비밀번호 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700">현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="현재 비밀번호 입력"
          />
        </div>

        {/* 🔹 새 비밀번호 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="새 비밀번호 입력"
          />
        </div>

        {/* 🔹 새 비밀번호 확인 */}
        <div className="mb-4">
          <label className="block text-gray-700">새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="새 비밀번호 확인"
          />
        </div>

        {/* 🔹 버튼 그룹 */}
        <div className="flex space-x-4">
          <button
            onClick={handleChangePassword}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            변경하기
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            취소
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
