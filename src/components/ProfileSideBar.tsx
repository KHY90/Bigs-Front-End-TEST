import React, { useState } from "react";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false); // 클릭하면 사이드바 닫기
  };

  return (
    <div className="relative">
      <button
        className="block sm:hidden bg-gray-800 text-white px-4 py-2 rounded mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰ 메뉴
      </button>

      <nav
        className={`absolute sm:relative bg-white shadow-md rounded-lg p-4 w-48 sm:w-60 sm:block ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">내 정보</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleTabClick("profile")}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === "profile" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              👤 프로필
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick("scrap")}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === "scrap" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              📌 스크랩
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick("myposts")}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === "myposts" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              📝 작성한 글
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
