import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWithToken(`/api/boards?page=0&size=50`);
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

  const latestPostsByCategory = Object.keys(categoryNames).map((categoryKey) => {
    return posts.find((post) => post.category === categoryKey) || null;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % latestPostsByCategory.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [latestPostsByCategory]);

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex === 0 ? latestPostsByCategory.length - 1 : prevIndex - 1));
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % latestPostsByCategory.length);
  };

  const categorizedPosts = posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    if (acc[post.category].length < 3) acc[post.category].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-5xl mx-auto mt-4">
        <section className="relative bg-white shadow-lg rounded mb-6 h-48 flex items-center justify-center overflow-hidden">
          {latestPostsByCategory.length > 0 && (
            <>
              <div
                key={currentBannerIndex}
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 flex flex-col justify-center items-center"
                style={{
                  backgroundImage: `url(${getFullImageUrl(latestPostsByCategory[currentBannerIndex]?.imageUrl)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "brightness(70%)",
                }}
                onClick={() => latestPostsByCategory[currentBannerIndex] && navigate(`/detail/${latestPostsByCategory[currentBannerIndex]!.id}`)}
              >
                <div className="relative text-white font-bold text-xl bg-black bg-opacity-50 px-4 py-2 rounded">
                  {categoryNames[Object.keys(categoryNames)[currentBannerIndex]]}
                </div>
                {latestPostsByCategory[currentBannerIndex] ? (
                  <div className="relative text-white text-lg font-semibold mt-2">
                    {latestPostsByCategory[currentBannerIndex]!.title}
                  </div>
                ) : (
                  <div className="relative text-gray-300 text-sm font-light mt-2">
                    아직 등록된 게시물이 없습니다.
                  </div>
                )}
              </div>

              {/* 🔹 슬라이드 화살표 버튼 */}
              <button
                onClick={handlePrevBanner}
                className="absolute left-2 bg-white border-2 border-black p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
              >
                <img src="/icons/left-arrow.svg" alt="Previous" className="w-6 h-6 filter invert" />
              </button>
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
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(categoryNames).map(([key, name]) => (
              <div key={key} className="min-h-[220px]">
                <h3 className="text-lg font-bold mb-2">{name}</h3>
                {categorizedPosts[key]?.length ? (
                  categorizedPosts[key].map((post) => (
                    <div
                      key={post.id}
                      className="bg-white p-3 border shadow rounded mb-3 cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => navigate(`/detail/${post.id}`)}
                    >
                      <h4 className="font-semibold">{post.title}</h4>
                      <p className="text-sm text-gray-500">
                        {post.author} · {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600">
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
