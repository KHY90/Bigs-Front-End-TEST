import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "../types/types";

interface BannerProps {
  posts: BlogPost[];
  loading: boolean;
}

const categoryNames: Record<string, string> = {
  NOTICE: "공지",
  FREE: "자유",
  "Q&A": "Q&A",
  OTHER: "기타",
};

const Banner: React.FC<BannerProps> = ({ posts, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (posts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [posts]);

  if (loading) {
    return <p className="text-gray-500 text-center p-6">배너를 불러오는 중...</p>;
  }

  if (posts.length === 0) {
    return <p className="text-gray-500 text-center p-6">표시할 게시물이 없습니다.</p>;
  }

  return (
    <div className="relative bg-white shadow-lg rounded mb-6 min-h-[250px] h-64 flex items-center justify-center overflow-hidden">
      {posts.length > 0 && (
        <>
          <div
            key={posts[currentIndex].id}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 flex flex-col justify-center items-center"
            style={{
              backgroundImage: `url(${posts[currentIndex].imageUrl || "/image/banner.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(100%)",
            }}
            onClick={() => navigate(`/detail/${posts[currentIndex].id}`)}
          >
            <div className="absolute top-4 left-4 text-black font-bold text-lg">
              {categoryNames[posts[currentIndex].category]}
            </div>

            <div className="relative text-black text-2xl font-bold mt-4 text-center px-6">
              {posts[currentIndex].title}
            </div>
          </div>

          <button
            onClick={() =>
              setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1))
            }
            className="absolute left-4 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition z-10"
          >
            <img src="/icons/left-arrow.svg" alt="Previous" className="w-6 h-6 opacity-60" />
          </button>

          <button
            onClick={() =>
              setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length)
            }
            className="absolute right-4 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition z-10"
          >
            <img src="/icons/right-arrow.svg" alt="Next" className="w-6 h-6 opacity-60" />
          </button>
        </>
      )}
    </div>
  );
};

export default Banner;
