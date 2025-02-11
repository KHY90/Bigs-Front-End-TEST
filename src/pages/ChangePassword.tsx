import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import { validatePassword, validatePasswordMatch } from "../utils/validation";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.");
      return;
    }

    if (!validatePasswordMatch(newPassword, confirmPassword)) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const confirmChange = window.confirm("비밀번호를 변경하시겠습니까?");
    if (!confirmChange) return;

    try {
      await fetchWithToken("/auth", {
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

  const handleCancel = () => {
    const confirmCancel = window.confirm("비밀번호 변경을 취소하시겠습니까?");
    if (confirmCancel) navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">비밀번호 변경</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

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

        <div className="flex space-x-4">
          <button
            onClick={handleChangePassword}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            변경하기
          </button>
          <button
            onClick={handleCancel}
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
