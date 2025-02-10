import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <img src="/image/bigslogo.png" alt="Logo" className="h-8 cursor-pointer" onClick={() => navigate("/main")} />
      <nav className="space-x-6 text-gray-700">
        <button className="hover:underline">공지</button>
        <button className="hover:underline">자유</button>
        <button className="hover:underline">Q&A</button>
        <button className="hover:underline">기타</button>
      </nav>
      <div className="flex items-center space-x-4">
        <img src="/image/avatar.png" alt="Profile" className="w-8 h-8 rounded-full object-cover border" />
        <span className="font-semibold">{userName || "User"}</span>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/signin");
          }}
          className="text-gray-600 hover:underline"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;
