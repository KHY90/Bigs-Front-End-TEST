import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchWithToken } from "../utils/fetchWithToken";

interface BlogDetail {
  id: number;
  title: string;
  content: string;
  boardCategory: string;
  imageUrl?: string;
  createdAt: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await fetchWithToken(`/api/boards/${id}`);
        console.log("게시글 상세 정보:", data);
        setPost(data);
      } catch (error) {
        console.error("게시글 상세 불러오기 실패:", error);
      }
    };

    fetchPostDetail();
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">게시글을 불러오는 중...</p>
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
      await fetchWithToken(`/api/boards/${id}`, { method: "DELETE" });
      alert("게시글이 삭제되었습니다.");
      navigate("/main");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow rounded">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-4">{post.boardCategory} · {new Date(post.createdAt).toLocaleDateString()}</p>

        {post.imageUrl && (
          <div className="mb-4">
            <img src={imageSrc} alt="게시글 이미지" className="w-full h-auto max-h-96 object-cover rounded-lg shadow" />
          </div>
        )}

        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

        {/* 버튼 그룹 */}
        <div className="flex justify-between mt-6">
          <button onClick={() => navigate("/main")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            🔙 뒤로 가기
          </button>
          <div className="space-x-2">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              ✏️ 수정
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              🗑 삭제
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailPage;
