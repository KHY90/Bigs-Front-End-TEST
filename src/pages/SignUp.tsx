import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface SignUpForm {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [form, setForm] = useState<SignUpForm>({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  // 입력 에러 메시지 상태 (각 항목에 대한 에러)
  const [errors, setErrors] = useState<Partial<SignUpForm>>({});

  // 입력값 변화 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 이메일 형식 검증 (정규표현식)
  const validateEmail = (email: string) => {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };

  // 비밀번호 검증 (8자 이상, 영문, 숫자, 특수문자(!%*#?&) 포함)
  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!%*#?&])[A-Za-z\d!%*#?&]{8,}$/;
    return re.test(password);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;
    let tempErrors: Partial<SignUpForm> = {};

    // 이메일 검증
    if (!validateEmail(form.username)) {
      tempErrors.username = '유효한 이메일 형식이 아닙니다.';
      valid = false;
    }

    // 이름 검증 (공백 체크)
    if (!form.name.trim()) {
      tempErrors.name = '이름을 입력해주세요.';
      valid = false;
    }

    // 비밀번호 검증
    if (!validatePassword(form.password)) {
      tempErrors.password = '비밀번호는 8자 이상, 숫자, 영문자, 특수문자(!%*#?&)를 포함해야 합니다.';
      valid = false;
    }

    // 비밀번호와 비밀번호 확인 일치 여부
    if (form.password !== form.confirmPassword) {
      tempErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      valid = false;
    }

    setErrors(tempErrors);

    if (!valid) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/signup`,
        {
          username: form.username,
          name: form.name,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }
      );
      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다.');
      // 로그인 후 홈 화면으로 리다이렉션 추가하기
    } catch (error: unknown) {
      // axios.isAxiosError를 사용하여 error가 AxiosError인지 체크
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const errorData = error.response.data;
        // errorData가 객체이고 message 프로퍼티가 있는지 확인
        if (
          typeof errorData === 'object' &&
          errorData !== null &&
          'message' in errorData &&
          typeof (errorData as any).message === 'string' &&
          (errorData as any).message.includes("이미 가입된 이메일주소입니다.")
        ) {
          alert('이미 가입된 이메일주소입니다.');
          return;
        }
      }
      console.error('회원가입 에러:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">이메일</label>
          <input
            type="email"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            placeholder="example@example.com"
            required
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* 이름 입력 */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            placeholder="이름을 입력하세요"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            placeholder="비밀번호를 입력하세요"
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* 회원가입 버튼 */}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUp;
