import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface DecodedToken {
  name: string;
  exp: number;
}

const Login: React.FC = observer(() => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, form);
      const { accessToken, refreshToken } = response.data;
      if (!accessToken || !refreshToken) throw new Error("토큰이 반환되지 않았습니다.");

      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      authStore.login(decodedToken.name, form.username, accessToken, refreshToken);

      navigate("/main");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6">
      <img
        src="/image/bigslogo.png"
        alt="Logo"
        className="h-10 sm:h-12 mb-3 sm:mb-4"
        onError={(e) => (e.currentTarget.src = "/image/bigslogo.png")}
      />

      <h2 className="text-xl sm:text-2xl font-bold mb-1 text-center">빅스에 오신 것을 환영합니다</h2>
      <p className="text-gray-500 mb-4 sm:mb-6 text-center">계정에 로그인하세요</p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs sm:max-w-sm bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="mb-3 sm:mb-4">
          <label className="block text-gray-700 text-sm sm:text-base">아이디</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm sm:text-base">👤</span>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="pl-9 sm:pl-10 w-full p-2 sm:p-3 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-gray-700 text-sm sm:text-base">비밀번호</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm sm:text-base">🔒</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="pl-9 sm:pl-10 w-full p-2 sm:p-3 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 sm:py-3 rounded hover:bg-blue-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="flex justify-end mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
          <button type="button" onClick={() => navigate("/signup")} className="hover:underline">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
});

export default Login;
