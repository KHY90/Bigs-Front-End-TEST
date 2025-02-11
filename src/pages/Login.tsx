import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";

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
      const response = await axios.post("/auth/signin", form);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-bold text-center mb-6">로그인</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">아이디</label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="아이디를 입력하세요"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-1">비밀번호</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="flex justify-end mt-4 text-sm text-gray-600">
          <button type="button" onClick={() => navigate("/signup")} className="hover:underline">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
});

export default Login;
