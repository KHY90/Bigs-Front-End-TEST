import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlogPost, BannerPost } from "../types/types";
import { fetchWithToken } from "../utils/fetchWithToken";

interface BannerProps {
  loading: boolean;
}

const categoryNames: Record<string, string> = {
  NOTICE: "공지",
  FREE: "자유",
  QNA: "Q&A",
  ETC: "기타",
};

const Banner: React.FC<BannerProps> = ({ loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categoryPosts, setCategoryPosts] = useState<BannerPost[]>([]);
  const navigate = useNavigate();

  // 게시물 배너 불러오기 요청
  useEffect(() => {
    const fetchBannerPosts = async () => {
      try {
        const response = await fetchWithToken(`/api/boards`);
        const fetchedPosts: BlogPost[] = response.content || [];

        const categorizedPosts: BannerPost[] = Object.keys(categoryNames).map((category) => {
          const post = fetchedPosts.find((post) => post.category === category);
          return post
            ? { id: post.id.toString(), title: post.title, category: post.category, imageUrl: post.imageUrl }
            : { id: `${category}-no-post`, title: "아직 등록된 게시물이 없습니다.", category, imageUrl: "/image/banner.png" };
        });

        setCategoryPosts(categorizedPosts);
      } catch (error) {
        console.error("배너 데이터 불러오기 실패:", error);
      }
    };

    fetchBannerPosts();
  }, []);
  // 슬라이드(5초)
  useEffect(() => {
    if (categoryPosts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % categoryPosts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [categoryPosts]);

  if (loading) {
    return <p className="text-gray-500 text-center p-6">배너를 불러오는 중...</p>;
  }

  return (
    <div className="relative bg-white shadow-lg rounded mb-3 flex items-center justify-center overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72">
      {categoryPosts.length > 0 && (
        <>
          <div
            key={categoryPosts[currentIndex].id}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 flex flex-col justify-center items-center"
            style={{
              backgroundImage: `url(${categoryPosts[currentIndex].imageUrl || "/image/banner.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(90%)",
            }}
            onClick={() =>
              categoryPosts[currentIndex].id.includes("-no-post") || navigate(`/detail/${categoryPosts[currentIndex].id}`)
            }
          >
            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded text-sm sm:text-base">
              {categoryNames[categoryPosts[currentIndex].category] || "카테고리 없음"}
            </div>

            <div className="relative text-black text-xl sm:text-2xl md:text-3xl font-bold mt-4 text-center px-6">
              {categoryPosts[currentIndex].title}
            </div>
          </div>

          <button
            onClick={() =>
              setCurrentIndex((prevIndex) => (prevIndex === 0 ? categoryPosts.length - 1 : prevIndex - 1))
            }
            className="absolute left-2 sm:left-4 bg-white bg-opacity-70 p-2 rounded-full shadow-sm hover:bg-gray-200 transition z-10"
          >
            <img src="/icons/left-arrow.svg" alt="Previous" className="w-4 h-4 sm:w-6 sm:h-6 opacity-70" />
          </button>

          <button
            onClick={() =>
              setCurrentIndex((prevIndex) => (prevIndex + 1) % categoryPosts.length)
            }
            className="absolute right-2 sm:right-4 bg-white bg-opacity-70 p-2 rounded-full shadow-sm hover:bg-gray-200 transition z-10"
          >
            <img src="/icons/right-arrow.svg" alt="Next" className="w-4 h-4 sm:w-6 sm:h-6 opacity-70" />
          </button>
        </>
      )}
    </div>
  );
};

export default Banner;
