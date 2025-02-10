import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateEmail, validatePassword, validatePasswordMatch } from "../utils/validation";

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
      await axios.post("/auth/signup", form);
      alert("회원가입이 완료되었습니다.");
      navigate("/signin");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        {/** 이메일 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700">이메일</label>
          <input
            type="email"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            placeholder="example@example.com"
            required
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        {/** 이름 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700">이름</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/** 비밀번호 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700">비밀번호</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/** 비밀번호 확인 */}
        <div className="mb-6">
          <label className="block text-gray-700">비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        {/** 버튼 */}
        <div className="flex justify-between">
          <button type="submit" className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            회원가입
          </button>
          <button type="button" onClick={() => navigate("/signin")} className="w-1/2 bg-gray-300 p-2 rounded hover:bg-gray-400">
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
