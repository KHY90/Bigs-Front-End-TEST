import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import authStore from "../stores/authStore";
import { observer } from "mobx-react-lite";
import CommentSection from "../components/CommentSection";
import { BlogDetail } from "../types/types";

const categoryNames: Record<string, string> = {
  NOTICE: "공지",
  FREE: "자유",
  QNA: "Q&A",
  ETC: "기타",
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const DetailPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogDetail | null>(null);
  const navigate = useNavigate();

  const fetchPostDetail = useCallback(async () => {
    try {
      const response = await axios.get(`/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
      setPost(response.data);
    } catch (error) {
      console.error("게시글 상세 불러오기 실패:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500 text-center">게시글을 불러오는 중...</p>
      </div>
    );
  }

  const imageSrc = post.imageUrl
    ? post.imageUrl.startsWith("http")
      ? post.imageUrl
      : `${BASE_URL}${post.imageUrl}`
    : "/image/default-image.png";

  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
      alert("게시글이 삭제되었습니다.");
      navigate("/main");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <main className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/main")}
              className="text-gray-600 hover:text-black text-lg"
            >
              &lt;
            </button>
            <span className="text-gray-600 text-sm sm:text-base">
              {categoryNames[post.category] || "카테고리 없음"}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
            >
              ✏️ 수정
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
            >
              🗑 삭제
            </button>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">{post.title}</h1>

        <p className="text-gray-500 text-sm sm:text-base text-right mb-4">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        {post.imageUrl && (
          <div className="mb-6">
            <img
              src={imageSrc}
              alt="게시글 이미지"
              className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 object-cover rounded-lg shadow"
            />
          </div>
        )}

        <div className="bg-gray-25 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <CommentSection postId={post.id} />
      </main>
    </div>
  );
});

export default DetailPage;
