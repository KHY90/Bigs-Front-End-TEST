import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateEmail, validatePassword, validatePasswordMatch } from "../utils/validation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SignUpForm {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignUpForm>({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<SignUpForm>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.confirm("회원가입을 완료하시겠습니까?")) return;

    const tempErrors: Partial<SignUpForm> = {};

    if (!validateEmail(form.username)) tempErrors.username = "유효한 이메일 형식이 아닙니다.";
    if (!form.name.trim()) tempErrors.name = "이름을 입력해주세요.";
    if (!validatePassword(form.password)) tempErrors.password = "비밀번호 형식이 맞지 않습니다.";
    if (!validatePasswordMatch(form.password, form.confirmPassword)) tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, form);
      alert("회원가입이 완료되었습니다.");
      navigate("/signin");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("회원가입을 취소하시겠습니까?")) {
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <img
        src="/image/bigslogo.png"
        alt="Logo"
        className="h-12 mb-2"
        onError={(e) => (e.currentTarget.src = "/image/default-logo.png")}
      />

      <h2 className="text-2xl font-bold mb-1">회원가입</h2>
      <p className="text-gray-500 mb-6">새로운 계정을 만들어보세요</p>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700">아이디</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">📧</span>
            <input
              type="email"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">이름</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">👤</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded"
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">비밀번호</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">🔒</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">8자 이상, 영문, 숫자, 특수문자를 포함해주세요.</p>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">비밀번호 확인</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">🔒</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded"
              placeholder="비밀번호를 한번 더 입력하세요"
              required
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        <div className="flex justify-between">
          <button type="submit" className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            가입하기
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 bg-gray-300 p-2 rounded hover:bg-red-500 hover:text-white transition"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
