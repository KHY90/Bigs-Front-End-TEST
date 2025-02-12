import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import { BlogPost } from "../types/types"; 
import WriteButton from "../components/WriteButton";
import Pagination from "../components/Pagination";
import ScrapButton from "../components/ScrapButton";
import { handleEdit, handleDelete } from "../utils/postActions";

const POSTS_PER_PAGE = 6;

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
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
                className="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-50 transition flex justify-between items-center h-[70px]"
                onClick={() => navigate(`/detail/${post.id}`)}
              >
                {/* 🔹 게시글 정보 */}
                <div>
                  <h2 className="font-semibold text-md truncate">{post.title}</h2>
                  <p className="text-xs text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>

                {/* 🔹 버튼 그룹 */}
                <div className="flex space-x-2">
                  <ScrapButton postId={post.id} />

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🔹 디테일 페이지 이동 방지
                      handleEdit(post.id, navigate);
                    }}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🔹 디테일 페이지 이동 방지
                      handleDelete(post.id, navigate);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <WriteButton />
    </div>
  );
};

export default CategoryPage;
