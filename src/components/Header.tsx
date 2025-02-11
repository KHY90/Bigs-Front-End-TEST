import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";
import { fetchWithToken } from "../utils/fetchWithToken";

const Header: React.FC = observer(() => {
  const navigate = useNavigate();
  const { userName, userImage, clearAuth } = authStore;
  const defaultImage = "/image/avatar.png";

  const [categories, setCategories] = useState<{ [key: string]: string }>({});

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
            <button key={key} className="hover:underline" onClick={() => navigate(`/category/${key}`)}>
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
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
