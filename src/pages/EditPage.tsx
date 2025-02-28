import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";
import postStore from "../stores/postStore";
import { fetchWithToken } from "../utils/fetchWithToken";

const EditPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchPostDetail = useCallback(async () => {
    try {
      const data = await fetchWithToken(`/api/boards/${id}`);
      postStore.setTitle(data.title);
      postStore.setCategory(data.boardCategory);
      postStore.setContent(data.content);

      if (data.imageUrl) {
        postStore.preview = data.imageUrl.startsWith("http")
          ? data.imageUrl
          : `${import.meta.env.VITE_API_BASE_URL}${data.imageUrl}`;
      }
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/signin");
      return;
    }
    fetchPostDetail();
  }, [fetchPostDetail, navigate]);

  const handleSubmit = async () => {
    if (!postStore.title.trim() || !postStore.category || !postStore.content.trim()) {
      alert("제목, 카테고리, 내용을 모두 입력해주세요.");
      return;
    }

    if (!window.confirm("게시글을 수정하시겠습니까?")) return;

    const formData = new FormData();
    const postData = { title: postStore.title, content: postStore.content, category: postStore.category };

    formData.append("request", new Blob([JSON.stringify(postData)], { type: "application/json" }));

    if (postStore.image) {
      formData.append("file", postStore.image);
    }

    try {
      await fetchWithToken(`/api/boards/${id}`, {
        method: "PATCH",
        data: formData,
      });

      alert("게시글이 수정되었습니다.");
      postStore.clearForm();
      navigate(`/detail/${id}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("정말 취소하시겠습니까?\n수정 내용이 저장되지 않습니다.")) {
      postStore.clearForm();
      navigate(`/detail/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 sm:p-6">
      <main className="bg-white shadow-lg p-4 sm:p-6 rounded-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">게시글 수정</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">제목</label>
            <input
              type="text"
              value={postStore.title}
              onChange={(e) => postStore.setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700">카테고리</label>
            <select
              value={postStore.category}
              onChange={(e) => postStore.setCategory(e.target.value)}
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
            <label className="block text-gray-700">내용</label>
            <textarea
              value={postStore.content}
              onChange={(e) => postStore.setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 h-24 sm:h-32 text-sm sm:text-base"
            />
          </div>

          <div className="border border-dashed p-4 sm:p-6 text-center rounded relative bg-gray-100">
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
                  className="w-32 sm:w-40 h-32 sm:h-40 object-cover rounded shadow border-2 border-gray-300"
                  onError={(e) => (e.currentTarget.src = "/image/default.png")}
                />
              ) : (
                <>
                  <img
                    src="/image/default.png"
                    alt="Upload"
                    className="w-10 sm:w-12 mx-auto mb-2 opacity-80"
                    onError={(e) => (e.currentTarget.src = "/image/default.png")}
                  />
                  <p className="text-gray-600 text-xs sm:text-sm">
                    이미지를 드래그하여 업로드하거나 파일 선택해 주세요.
                  </p>
                </>
              )}
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base transition w-full sm:w-auto"
            >
              수정하기
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 px-3 sm:px-4 py-2 rounded hover:bg-red-500 hover:text-white text-sm sm:text-base transition w-full sm:w-auto"
            >
              취소
            </button>
          </div>
        </div>
      </main>
    </div>
  );
});

export default EditPage;
