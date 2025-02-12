import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import { BlogPost } from "../types/types";
import SortDropdown from "./SortDropdown";
import Pagination from "./Pagination";
import ScrapButton from "./ScrapButton";
import SearchBar from "./SearchBar";
import { handleEdit, handleDelete } from "../utils/postActions";

const POSTS_PER_PAGE = 5;

const categoryNames: Record<string, string> = {
  NOTICE: "공지",
  FREE: "자유",
  QNA: "Q&A",
  ETC: "기타",
};

const MyPostsList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await fetchWithToken("/api/boards?page=0&size=50");
        setPosts(response.content || []);
        setFilteredPosts(response.content || []);
      } catch (error) {
        console.error("내가 작성한 글 불러오기 실패:", error);
      }
    };

    fetchMyPosts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (query.trim() === "") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()))
      );
    }
    setCurrentPage(1);
  };

  const sortedPosts = [...filteredPosts].sort((a, b) =>
    sortOrder === "latest"
      ? b.createdAt.localeCompare(a.createdAt)
      : a.createdAt.localeCompare(b.createdAt)
  );

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE));
  const displayedPosts = sortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleDeletePost = async (postId: number) => {
    await handleDelete(postId, setPosts);
    setFilteredPosts((prevFiltered) => prevFiltered.filter((post) => post.id !== postId));
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">📝 내가 작성한 글</h1>

      {posts.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row justify-end items-center">
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <p className="text-gray-500 text-center">작성한 글이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {displayedPosts.map((post) => (
            <li
              key={post.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div className="cursor-pointer flex-1" onClick={() => navigate(`/detail/${post.id}`)}>
                <p className="text-xs text-blue-500 font-semibold mb-1">
                  {categoryNames[post.category] || "카테고리 없음"}
                </p>
                <h2 className="font-semibold">{post.title}</h2>
                <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex space-x-2">
                <ScrapButton postId={post.id} />

                <button
                  onClick={() => handleEdit(post.id, navigate)}
                  className="text-yellow-500 hover:text-yellow-600 text-sm"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <SearchBar onSearch={handleSearch} />
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default MyPostsList;
