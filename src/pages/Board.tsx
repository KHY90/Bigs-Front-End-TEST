import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import { BlogPost } from "../types/types";
import WriteButton from "../components/WriteButton";
import Banner from "../components/Banner";
import ScrapButton from "../components/ScrapButton";
import { handleEdit, handleDelete } from "../utils/postActions";

const categoryNames: Record<string, string> = {
  NOTICE: "공지",
  FREE: "자유",
  QNA: "Q&A",
  ETC: "기타",
};

const Board: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
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

  const categorizedPosts = posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    if (acc[post.category].length < 3) acc[post.category].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-5xl mx-auto mt-2 p-4 sm:p-6 lg:p-8">
        <Banner posts={posts} loading={loading} />

        <section className="bg-white p-4 sm:p-6 rounded shadow">
          <h2 className="text-lg sm:text-xl font-bold mb-4">카테고리 별 게시글</h2>

          {loading ? (
            <p className="text-gray-500 text-center">게시글을 불러오는 중...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(categoryNames).map(([key, name]) => (
                <div key={key} className="min-h-[180px] sm:min-h-[220px]">
                  <h3 className="text-md sm:text-lg font-bold mb-2">{name}</h3>
                  {categorizedPosts[key]?.length ? (
                    categorizedPosts[key].map((post) => (
                      <div
                        key={post.id}
                        className="bg-white p-3 border shadow rounded mb-3 cursor-pointer hover:bg-gray-100 transition flex flex-col sm:flex-row justify-between items-start sm:items-center"
                        onClick={() => navigate(`/detail/${post.id}`)}
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm sm:text-base">{post.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {post.author} · {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                          <p className="hidden sm:block text-xs text-gray-600">
                            {post.content ? post.content.substring(0, 50) + "..." : ""}
                          </p>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(post.id, setPosts);
                            }}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm sm:text-base">게시물이 없습니다.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <WriteButton />
      </main>
    </div>
  );
};

export default Board;
