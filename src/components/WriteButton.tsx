import React from "react";
import { useNavigate } from "react-router-dom";

const WriteButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      className="fixed bottom-10 right-10 bg-black text-white px-5 py-3 rounded-full shadow-lg flex items-center hover:bg-gray-800"
      onClick={() => navigate("/write")}
    >
      ✏️ 글쓰기
    </button>
  );
};

export default WriteButton;
