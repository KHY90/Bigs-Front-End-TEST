import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "../types/types";
import { fetchWithToken } from "../utils/fetchWithToken";

const categoryNames: Record<string, string> = {
  NOTICE: "공지",
  FREE: "자유",
  "Q&A": "Q&A",
  OTHER: "기타",
};

const Banner: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestPostIds = async () => {
      try {
        const data = await fetchWithToken(`/api/boards?page=0&size=50`);
        if (data.content) {
          const categoryLatestPosts = Object.keys(categoryNames)
            .map((category) => data.content.find((post: BlogPost) => post.category === category))
            .filter(Boolean);

          const detailedPosts = await Promise.all(
            categoryLatestPosts.map(async (post) => {
              try {
                const detail = await fetchWithToken(`/api/boards/${post.id}`);
                return { ...post, imageUrl: detail.imageUrl ? detail.imageUrl : "/image/default.png" };
              } catch {
                return { ...post, imageUrl: "/image/default.png" };
              }
            })
          );

          setLatestPosts(detailedPosts);
        }
      } catch (error) {
        console.error("배너 게시글 불러오기 실패:", error);
      }
    };

    fetchLatestPostIds();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % latestPosts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [latestPosts]);

  if (latestPosts.length === 0) {
    return <p className="text-gray-500 text-center p-6">표시할 게시물이 없습니다.</p>;
  }

  return (
    <div className="relative bg-white shadow-lg rounded mb-6 h-48 flex items-center justify-center overflow-hidden">
      {latestPosts.length > 0 && (
        <>
          <div
            key={latestPosts[currentIndex].id}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 flex flex-col justify-center items-center"
            style={{
              backgroundImage: `url(${latestPosts[currentIndex].imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "brightness(70%)",
            }}
            onClick={() => navigate(`/detail/${latestPosts[currentIndex].id}`)}
          >
            <div className="relative text-white font-bold text-xl bg-black bg-opacity-50 px-4 py-2 rounded">
              {categoryNames[latestPosts[currentIndex].category]}
            </div>
            <div className="relative text-white text-lg font-semibold mt-2">
              {latestPosts[currentIndex].title}
            </div>
          </div>

          <button
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? latestPosts.length - 1 : prevIndex - 1
              )
            }
            className="absolute left-4 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition z-10"
          >
            <img src="/icons/left-arrow.svg" alt="Previous" className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setCurrentIndex((prevIndex) => (prevIndex + 1) % latestPosts.length)
            }
            className="absolute right-4 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition z-10"
          >
            <img src="/icons/right-arrow.svg" alt="Next" className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default Banner;
