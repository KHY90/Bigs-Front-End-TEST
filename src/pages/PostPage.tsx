import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";
import postStore from "../stores/postStore";
import { fetchWithToken } from "../utils/fetchWithToken";

const PostPage: React.FC = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/signin");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!postStore.title.trim() || !postStore.category || !postStore.content.trim()) {
      alert("제목, 카테고리, 내용을 모두 입력해주세요.");
      return;
    }

    if (!window.confirm("게시글을 등록하시겠습니까?")) return;

    const formData = new FormData();
    const postData = { title: postStore.title, content: postStore.content, category: postStore.category };

    formData.append("request", new Blob([JSON.stringify(postData)], { type: "application/json" }));
    if (postStore.image) {
      formData.append("file", postStore.image);
    }

    try {
      await fetchWithToken("/api/boards", {
        method: "POST",
        data: formData,
      });

      alert("게시글이 등록되었습니다.");
      postStore.clearForm();
      navigate("/main");
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("게시글 작성을 취소하시겠습니까?")) {
      postStore.clearForm();
      navigate("/main");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <main className="bg-white shadow-lg p-6 rounded-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">새 글 작성</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">제목</label>
            <input
              type="text"
              value={postStore.title}
              onChange={(e) => postStore.setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-gray-700">카테고리</label>
            <select
              value={postStore.category}
              onChange={(e) => postStore.setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value="">카테고리 선택</option>
              <option value="NOTICE">공지</option>
              <option value="FREE">자유</option>
              <option value="Q&A">Q&A</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">내용</label>
            <textarea
              value={postStore.content}
              onChange={(e) => postStore.setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 h-32"
              placeholder="내용을 입력하세요"
            />
          </div>

          <div className="border border-dashed p-6 text-center rounded relative bg-gray-100">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && postStore.setImage(e.target.files[0])}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
              {postStore.preview ? (
                <img
                  src={postStore.preview}
                  alt="미리보기"
                  className="w-40 h-40 object-cover rounded shadow border-2 border-gray-300"
                  onError={(e) => (e.currentTarget.src = "/image/default-upload.png")} // 이미지 깨질 때 기본 이미지 대체
                />
              ) : (
                <>
                  <img
                    src="/image/upload-icon.png"
                    alt="Upload"
                    className="w-12 mx-auto mb-2 opacity-80"
                    onError={(e) => (e.currentTarget.src = "/image/default-upload.png")} // 아이콘 깨질 때 기본 이미지 대체
                  />
                  <p className="text-gray-600">이미지를 드래그하여 업로드하거나 파일 선택</p>
                </>
              )}
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              등록하기
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
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
