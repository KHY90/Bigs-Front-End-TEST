import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";
import { fetchWithToken } from "../utils/fetchWithToken";

const PostPage: React.FC = observer(() => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/signin");
    }
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !category || !content.trim()) {
      alert("제목, 카테고리, 내용을 모두 입력해주세요.");
      return;
    }
  
    if (!window.confirm("게시글을 등록하시겠습니까?")) return;
  
    const formData = new FormData();
    const postData = { title, content, category };
  
    formData.append("request", new Blob([JSON.stringify(postData)], { type: "application/json" }));
  
    if (image) {
      formData.append("file", image);
    }
  
    try {
      await fetchWithToken("/api/boards", {
        method: "POST",
        data: formData,
      });
  
      alert("게시글이 등록되었습니다.");
      navigate(`/category/${category}`);
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };
  

  const handleCancel = () => {
    if (window.confirm("게시글 작성을 취소하시겠습니까?")) {
      navigate("/main");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 sm:p-6">
      <main className="bg-white shadow-lg p-4 sm:p-6 rounded-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">새 글 작성</h1>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-700 text-sm sm:text-base">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded mt-1"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm sm:text-base">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md p-2 sm:p-3 border border-gray-300 rounded mt-1 text-sm sm:text-base"
            >
              <option value="">카테고리 선택</option>
              <option value="NOTICE">공지</option>
              <option value="FREE">자유</option>
              <option value="QNA">Q&A</option>
              <option value="ETC">기타</option>
            </select>

          </div>

          <div>
            <label className="block text-gray-700 text-sm sm:text-base">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded mt-1 h-32 sm:h-40"
              placeholder="내용을 입력하세요"
            />
          </div>

          <div className="border border-dashed p-4 sm:p-6 text-center rounded relative bg-gray-100">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="미리보기"
                  className="w-28 h-28 sm:w-40 sm:h-40 object-cover rounded shadow border-2 border-gray-300"
                />
              ) : (
                <>
                  <img src="/image/default.png" alt="Upload" className="w-10 sm:w-12 mx-auto mb-2 opacity-80" />
                  <p className="text-gray-600 text-sm sm:text-base">이미지를 업로드하거나 선택하세요.</p>
                </>
              )}
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 sm:px-5 sm:py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
            >
              등록하기
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 sm:px-5 sm:py-2 rounded hover:bg-red-500 hover:text-white transition text-sm sm:text-base"
            >
              취소
            </button>
          </div>
        </div>
      </main>
    </div>
  );
});

export default PostPage;