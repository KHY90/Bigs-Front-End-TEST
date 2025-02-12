import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import { BlogPost } from "../types/types";
import SortDropdown from "./SortDropdown";
import Pagination from "./Pagination";
import { handleEdit, handleDelete } from "../utils/postActions";
import ScrapButton from "./ScrapButton";
import SearchBar from "./SearchBar";

const POSTS_PER_PAGE = 5;

const categoryNames: Record<string, string> = {
  NOTICE: "공지",
  FREE: "자유",
  QNA: "Q&A",
  ETC: "기타",
};

const ScrapList: React.FC = () => {
  const [scrappedPosts, setScrappedPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScrappedPosts = async () => {
      const scrappedIds = JSON.parse(sessionStorage.getItem("scrappedPosts") || "[]");

      if (scrappedIds.length === 0) {
        setScrappedPosts([]);
        return;
      }

      try {
        const response = await fetchWithToken("/api/boards");
        const allPosts: BlogPost[] = response.content || [];
        const filteredPosts = allPosts.filter((post) => scrappedIds.includes(post.id));
        setScrappedPosts(filteredPosts);
      } catch (error) {
        console.error("스크랩한 글 불러오기 실패:", error);
      }
    };

    fetchScrappedPosts();
  }, []);

  const removeScrap = (postId: number) => {
    setScrappedPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

    const scrappedIds = JSON.parse(sessionStorage.getItem("scrappedPosts") || "[]").filter(
      (id: number) => id !== postId
    );
    sessionStorage.setItem("scrappedPosts", JSON.stringify(scrappedIds));
  };

  const filteredPosts = scrappedPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) =>
    sortOrder === "latest"
      ? b.createdAt.localeCompare(a.createdAt)
      : a.createdAt.localeCompare(b.createdAt)
  );

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE));
  const displayedPosts = sortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📌 스크랩한 글</h1>

      {scrappedPosts.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row justify-end items-center">
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <p className="text-gray-500">스크랩한 글이 없습니다.</p>
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
                <ScrapButton postId={post.id} onScrapChange={() => removeScrap(post.id)} />

                <button
                  onClick={() => handleEdit(post.id, navigate)}
                  className="text-yellow-500 hover:text-yellow-600 text-sm"
                >
                  ✏️
                </button>

                <button
                  onClick={async () => {
                    await handleDelete(post.id, setScrappedPosts);
                    removeScrap(post.id);
                  }}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <SearchBar onSearch={setSearchTerm} />
      </div>
      
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default ScrapList;
