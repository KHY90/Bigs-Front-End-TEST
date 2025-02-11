import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";

const Header: React.FC = observer(() => {
  const navigate = useNavigate();
  const { userName, userImage, clearAuth } = authStore;
  const defaultImage = "/image/avatar.png";

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      clearAuth();
      navigate("/signin");
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <div className="flex items-center space-x-8">
        <img
          src="/image/bigslogo.png"
          alt="Logo"
          className="h-8 cursor-pointer"
          onClick={() => navigate("/main")}
        />
        <nav className="flex space-x-6 text-gray-700">
          <button className="hover:underline">공지</button>
          <button className="hover:underline">자유</button>
          <button className="hover:underline">Q&A</button>
          <button className="hover:underline">기타</button>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* 다크모드 스위치 */}
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          <div
            className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
                isDarkMode ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </div>
        </label>

        <img
          src={userImage || defaultImage}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border cursor-pointer"
          onClick={() => navigate("/profile")}
        />
        <span className="font-semibold cursor-pointer" onClick={() => navigate("/profile")}>
          {userName || "User"}
        </span>

        <button onClick={handleLogout} className="text-gray-600 hover:underline">
          로그아웃
        </button>
      </div>
    </header>
  );
});

export default Header;
