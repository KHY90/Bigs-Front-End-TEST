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
  "QNA": "Q&A",
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
      <main className="max-w-5xl mx-auto mt-4">
        <Banner posts={posts} loading={loading} />

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">카테고리 별 게시글</h2>

          {loading ? (
            <p className="text-gray-500 text-center">게시글을 불러오는 중...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(categoryNames).map(([key, name]) => (
                <div key={key} className="min-h-[220px]">
                  <h3 className="text-lg font-bold mb-2">{name}</h3>
                  {categorizedPosts[key]?.length ? (
                    categorizedPosts[key].map((post) => (
                      <div
                        key={post.id}
                        className="bg-white p-3 border shadow rounded mb-3 cursor-pointer hover:bg-gray-100 transition flex justify-between items-center"
                        onClick={() => navigate(`/detail/${post.id}`)}
                      >
                        <div>
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-gray-500">
                            {post.author}  {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {post.content ? post.content.substring(0, 50) + "..." : ""}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <ScrapButton postId={post.id} />

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(post.id, navigate);
                            }}
                            className="text-yellow-500 hover:text-yellow-600"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation(); 
                              handleDelete(post.id, navigate);
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">게시물이 없습니다.</p>
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
