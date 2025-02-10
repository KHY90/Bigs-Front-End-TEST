import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchWithToken } from "../utils/fetchWithToken";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

interface Categories {
  [key: string]: string;
}

const Board: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Categories>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWithToken(`/api/boards?page=${currentPage}&size=10`);
      console.log("게시글 API 응답:", data);
      setPosts(data.content || []);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await fetchWithToken(`/api/boards/categories`);
      console.log("카테고리 API 응답:", data);
      setCategories(data);
    } catch (error) {
      console.error("카테고리 불러오기 실패:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">블로그 글</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate("/write")}>
            ✏️ 글쓰기
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">게시글을 불러오는 중...</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
                onClick={() => navigate(`/detail/${post.id}`)}
              >
                <h2 className="text-lg font-bold">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  {categories[post.category] || "알 수 없음"} · {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">게시글이 없습니다.</p>
          )}
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {[0, 1, 2].map((num) => (
            <button key={num} onClick={() => setCurrentPage(num)} className={`px-4 py-2 border rounded ${currentPage === num ? "bg-blue-500 text-white" : "bg-white"}`}>
              {num + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Board;
