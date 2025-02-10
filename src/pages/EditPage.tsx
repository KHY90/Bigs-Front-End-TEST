import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchWithToken } from "../utils/fetchWithToken";

const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 게시글 ID 가져오기
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await fetchWithToken(`/api/boards/${id}`);
        console.log("게시글 수정 정보:", data);
        setTitle(data.title);
        setCategory(data.boardCategory);
        setContent(data.content);
        if (data.imageUrl) {
          setPreview(
            data.imageUrl.startsWith("http")
              ? data.imageUrl
              : `${import.meta.env.VITE_API_BASE_URL}${data.imageUrl}`
          );
        }
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPostDetail();
  }, [id]);

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
  
    if (!window.confirm("게시글을 수정하시겠습니까?")) return;
  
    const formData = new FormData();
    const postData = { title, content, category };
  
    formData.append("request", new Blob([JSON.stringify(postData)], { type: "application/json" }));
  
    if (image) {
      formData.append("file", image);
    }
  
    try {
      await fetchWithToken(`/api/boards/${id}`, {
        method: "PATCH",
        data: formData,
        withCredentials: true,
      });
  
      alert("게시글이 수정되었습니다.");
      navigate(`/detail/${id}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  };
  

  const handleCancel = () => {
    if (window.confirm("정말 취소하시겠습니까?\n수정 내용이 저장되지 않습니다.")) {
      navigate(`/detail/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto mt-6">
        <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>

        <div className="space-y-4">
          {/* 제목 입력 */}
          <div>
            <label className="block text-gray-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          {/* 카테고리 선택 */}
          <div>
            <label className="block text-gray-700">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value="">카테고리 선택</option>
              <option value="NOTICE">공지</option>
              <option value="FREE">자유</option>
              <option value="Q&A">Q&A</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          {/* 내용 입력 */}
          <div>
            <label className="block text-gray-700">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 h-32"
            />
          </div>

          {/* 🔹 이미지 업로드 UI 추가 */}
          <div className="border border-dashed p-6 text-center rounded relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="미리보기"
                  className="w-40 h-40 object-cover rounded shadow border-2 border-gray-300"
                />
              ) : (
                <>
                  <img src="/image/upload-icon.png" alt="Upload" className="w-12 mx-auto mb-2" />
                  <p className="text-gray-500">이미지를 드래그하여 업로드하거나 파일 선택</p>
                </>
              )}
            </label>
          </div>

          {/* 🔹 수정 & 취소 버튼 */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              수정하기
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
};

export default EditPage;
