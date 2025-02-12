import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";
import { fetchWithToken } from "../utils/fetchWithToken";

const Header: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userEmail, userImage, clearAuth } = authStore;
  const defaultImage = "/image/avatar.png";

  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchWithToken(`/api/boards/categories`);
        setCategories(data);
      } catch (error) {
        console.error("카테고리 가져오기 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              className={`hover:underline hover:text-blue-600 ${
                location.pathname.includes(`/category/${key}`) ? "text-blue-600 underline" : ""
              }`}
              onClick={() => navigate(`/category/${key}`)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="relative">
        <img
          src={userImage || defaultImage}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border cursor-pointer"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        />

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50"
          >
            <div className="p-4 border-b">
              <p className="font-semibold">{userName || "User"}</p>
              <p className="text-sm text-gray-500">{userEmail || "이메일 없음"}</p>
            </div>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/profile");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              ⚙️ 설정
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            >
              🚪 로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;
