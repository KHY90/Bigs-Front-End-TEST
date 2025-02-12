import React from "react"; 
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-5xl sm:text-6xl font-bold text-red-500">404</h1>
      <p className="text-lg sm:text-xl text-gray-700 mt-3 sm:mt-4 text-center">
        페이지를 찾을 수 없습니다.
      </p>
      <button
        onClick={() => navigate("/main")}
        className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        🏠 메인으로 가기
      </button>
    </div>
  );
};

export default ErrorPage;
