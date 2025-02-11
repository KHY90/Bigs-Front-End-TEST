import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";

interface Post {
  id: number;
  title: string;
  createdAt: string;
}

const POSTS_PER_PAGE = 6;

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetchWithToken(`/api/boards?page=0&size=10`);
        if (Array.isArray(data.content)) {
          setPosts(data.content.filter((post: { category?: string }) => post.category === category));
        } else {
          console.error("잘못된 응답 형식:", data);
          setPosts([]);
        }
      } catch (error) {
        console.error("게시글 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

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

  // 페이지 네이션
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const displayedPosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="min-h-[90vh] bg-white p-6 shadow-lg flex flex-col">
      <h1 className="text-2xl font-bold mb-6">{categories[category || ""] || "게시판"}</h1>

      <div className="flex-grow">
        {loading ? (
          <p>게시글을 불러오는 중...</p>
        ) : displayedPosts.length === 0 ? (
          <p className="text-gray-500">게시글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-50 transition flex flex-col justify-between h-[70px]"
                onClick={() => navigate(`/detail/${post.id}`)}
              >
                <h2 className="font-semibold text-md truncate">{post.title}</h2>
                <p className="text-xs text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto flex justify-center items-center space-x-2 pt-6">
        <button
          className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400" : "text-black"}`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ 이전
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-black text-white" : "text-black"}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className={`px-3 py-1 border rounded ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          다음 ▶
        </button>
      </div>

      <button
        className="fixed bottom-10 right-10 bg-black text-white px-5 py-3 rounded-full shadow-lg flex items-center hover:bg-gray-800"
        onClick={() => navigate("/write")}
      >
        ✏️ 글쓰기
      </button>
    </div>
  );
};

export default CategoryPage;
