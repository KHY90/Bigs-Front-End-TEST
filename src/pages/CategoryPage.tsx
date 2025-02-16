import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import { BlogPost } from "../types/types";
import WriteButton from "../components/WriteButton";
import Pagination from "../components/Pagination";
import ScrapButton from "../components/ScrapButton";
import { handleEdit, handleDelete } from "../utils/postActions";
import SortDropdown from "../components/SortDropdown";
import SearchBar from "../components/SearchBar";

const POSTS_PER_PAGE = 6;

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWithToken(`/api/boards?page=0&size=50`);
      if (Array.isArray(data.content)) {
        const formattedCategory = category?.toUpperCase();
        const filtered = data.content.filter((post: { category: string | undefined; }) => post.category === formattedCategory);
        setPosts(filtered);
        setFilteredPosts(filtered);
      } else {
        console.error("잘못된 응답 형식:", data);
        setPosts([]);
        setFilteredPosts([]);
      }
    } catch (error) {
      console.error("게시글 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await fetchWithToken(`/api/boards/categories`);
      setCategories(data);
    } catch (error) {
      console.error("카테고리 가져오기 실패:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDeletePost = async (postId: number) => {
    await handleDelete(postId, setPosts);
    setFilteredPosts((prevFiltered) => prevFiltered.filter((post) => post.id !== postId));
  };

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()))
      );
    }
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const displayedPosts = filteredPosts
    .sort((a, b) => (sortOrder === "latest" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)))
    .slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="min-h-[90vh] bg-white p-4 sm:p-6 shadow-lg flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">{categories[category || ""] || "게시판"}</h1>
        <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>

      <div className="flex-grow">
        {loading ? (
          <p className="text-gray-500 text-center">게시글을 불러오는 중...</p>
        ) : displayedPosts.length === 0 ? (
          <p className="text-gray-500 text-center">게시글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center"
                onClick={() => navigate(`/detail/${post.id}`)}
              >
                <div className="flex-1">
                  <h2 className="font-semibold text-sm sm:text-md truncate">{post.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex space-x-2 mt-2 sm:mt-0 sm:ml-4 self-end sm:self-center">
                  <ScrapButton postId={post.id} />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(post.id, navigate);
                    }}
                    className="text-yellow-500 hover:text-yellow-600 text-sm"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleDeletePost(post.id);
                    }}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <WriteButton />
    </div>
  );
};

export default CategoryPage;
