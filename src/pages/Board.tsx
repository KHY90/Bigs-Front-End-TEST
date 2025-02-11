import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchWithToken } from "../utils/fetchWithToken";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  author: string;
  content: string;
  imageUrl?: string;
}

const categoryNames: Record<string, string> = {
  NOTICE: "공지",
  FREE: "자유",
  "Q&A": "Q&A",
  OTHER: "기타",
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const getFullImageUrl = (imageUrl?: string) => {
  return imageUrl
    ? imageUrl.startsWith("http") 
      ? imageUrl 
      : `${BASE_URL}${imageUrl}`
    : "/image/default-image.png";
};

const Board: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const navigate = useNavigate();

  // 🔹 게시글 목록 불러오기
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWithToken(`/api/boards?page=0&size=10`);
      console.log("게시글 API 응답:", data);
      setPosts(data.content || []);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 🔹 최신 게시글 3개 가져오기
  const latestPosts = posts.slice(0, 3);

  // 🔹 5초마다 최신 게시물 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % latestPosts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [latestPosts]);

  // 🔹 배너 화살표 이동 핸들러
  const handlePrevBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex === 0 ? latestPosts.length - 1 : prevIndex - 1));
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % latestPosts.length);
  };

  // 🔹 카테고리별 게시글 정리 (최대 3개까지만 최신순)
  const categorizedPosts = posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    if (acc[post.category].length < 3) acc[post.category].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>);

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="max-w-5xl mx-auto mt-6">
        {/* 🔹 최신 게시물 (배너) */}
        <section className="relative bg-white shadow-lg rounded mb-8 h-56 flex items-center justify-center overflow-hidden">
          {latestPosts.length > 0 && (
            <>
              {/* 🔹 배경 이미지가 있는 경우 */}
              <div
                key={latestPosts[currentBannerIndex].id}
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500"
                style={{
                  backgroundImage: `url(${getFullImageUrl(latestPosts[currentBannerIndex].imageUrl)})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  filter: "brightness(80%)",
                }}
                onClick={() => navigate(`/detail/${latestPosts[currentBannerIndex].id}`)}
              />

              {/* 🔹 화살표 버튼 (검정 테두리 + 흰색 아이콘) */}
              <button
                onClick={handlePrevBanner}
                className="absolute left-2 bg-white border-2 border-black p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
              >
                <img src="/icons/left-arrow.svg" alt="Previous" className="w-6 h-6 filter invert" />
              </button>

              {/* 🔹 텍스트 (검정 테두리 + 흰색) */}
              <div className="relative bg-black bg-opacity-60 px-6 py-2 rounded text-white text-2xl font-bold border-2 border-white z-10">
                {latestPosts[currentBannerIndex].title}
              </div>

              {/* 🔹 화살표 버튼 */}
              <button
                onClick={handleNextBanner}
                className="absolute right-2 bg-white border-2 border-black p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
              >
                <img src="/icons/right-arrow.svg" alt="Next" className="w-6 h-6 filter invert" />
              </button>
            </>
          )}
        </section>

        {/* 🔹 카테고리별 게시물 */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">블로그 글</h2>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(categoryNames).map(([key, name]) => (
              <div key={key} className="min-h-[280px]">
                <h3 className="text-lg font-bold mb-2">{name}</h3>
                {categorizedPosts[key]?.length ? (
                  categorizedPosts[key].map((post) => (
                    <div
                      key={post.id}
                      className="bg-white p-4 border shadow rounded mb-3 cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => navigate(`/detail/${post.id}`)}
                    >
                      <h4 className="font-semibold">{post.title}</h4>
                      <p className="text-sm text-gray-500">
                        {post.author} · {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {post.content ? post.content.substring(0, 50) + "..." : ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">게시물이 없습니다.</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 🔹 글쓰기 버튼 */}
        <button
          className="fixed bottom-10 right-10 bg-black text-white px-5 py-3 rounded-full shadow-lg flex items-center hover:bg-gray-800"
          onClick={() => navigate("/write")}
        >
          ✏️ 글쓰기
        </button>
      </main>
    </div>
  );
};

export default Board;
