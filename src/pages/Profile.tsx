import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchWithToken } from "../utils/fetchWithToken";

interface ScrapPost {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "이메일 없음");
  const [userImage, setUserImage] = useState(localStorage.getItem("userImage") || "/image/avatar.png");
  const [scrapPosts, setScrapPosts] = useState<ScrapPost[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);

  // 🔹 스크랩한 게시글 불러오기
  useEffect(() => {
    const fetchScrapPosts = async () => {
      try {
        const data = await fetchWithToken("/api/users/scraps");
        console.log("스크랩한 게시글 목록:", data);
        setScrapPosts(data || []);
      } catch (error) {
        console.error("스크랩 목록 불러오기 실패:", error);
      }
    };

    fetchScrapPosts();
  }, []);

  // 🔹 프로필 이미지 변경
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetchWithToken("/api/users/profile-image", {
          method: "POST",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("프로필 이미지가 변경되었습니다!");
        setUserImage(response.imageUrl);
        localStorage.setItem("userImage", response.imageUrl);
      } catch (error) {
        console.error("프로필 이미지 변경 실패:", error);
        alert("프로필 이미지 변경 중 오류가 발생했습니다.");
      }
    }
  };

  // 🔹 이름 변경 요청
  const handleNameChange = async () => {
    if (!newName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      await fetchWithToken("/api/users/update-name", {
        method: "PATCH",
        data: { name: newName },
        headers: { "Content-Type": "application/json" },
      });

      alert("이름이 변경되었습니다.");
      setUserName(newName);
      localStorage.setItem("userName", newName);
      setIsEditingName(false);
    } catch (error) {
      console.error("이름 변경 실패:", error);
      alert("이름 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">프로필</h1>

        {/* 🔹 프로필 정보 */}
        <div className="flex items-center space-x-4 mb-6">
          <label htmlFor="fileInput" className="cursor-pointer">
            <img src={userImage} alt="Profile" className="w-20 h-20 object-cover rounded-full border" />
          </label>
          <input type="file" accept="image/*" id="fileInput" className="hidden" onChange={handleImageChange} />

          <div>
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border p-1 rounded"
                />
                <button onClick={handleNameChange} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  저장
                </button>
                <button onClick={() => setIsEditingName(false)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
                  취소
                </button>
              </div>
            ) : (
              <p className="text-lg font-semibold">{userName}</p>
            )}
            <p className="text-gray-500">{userEmail}</p>
          </div>
        </div>

        {/* 🔹 이름 변경 & 비밀번호 변경 버튼 */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setIsEditingName(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            ✏️ 이름 변경
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            🔒 비밀번호 변경
          </button>
        </div>

        {/* 🔹 스크랩한 게시글 목록 */}
        <h2 className="text-xl font-bold mb-4">스크랩한 게시글</h2>
        {scrapPosts.length > 0 ? (
          <ul className="space-y-3">
            {scrapPosts.map((post) => (
              <li
                key={post.id}
                onClick={() => navigate(`/detail/${post.id}`)}
                className="cursor-pointer p-3 border rounded hover:bg-gray-100 transition"
              >
                <p className="font-semibold">{post.title}</p>
                <p className="text-gray-500 text-sm">
                  {post.category} · {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">스크랩한 게시글이 없습니다.</p>
        )}
      </main>
    </div>
  );
};

export default Profile;
