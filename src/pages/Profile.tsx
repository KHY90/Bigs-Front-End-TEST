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
  const [userImage, setUserImage] = useState(localStorage.getItem("userImage") || "/image/avatar.png");
  const [scrapPosts, setScrapPosts] = useState<ScrapPost[]>([]);

  // 🔹 스크랩한 게시글 목록 불러오기
  useEffect(() => {
    const fetchScrapPosts = async () => {
      try {
        const data = await fetchWithToken("/api/users/scraps"); // 🔹 스크랩한 게시글 API 호출
        console.log("스크랩한 게시글 목록:", data);
        setScrapPosts(data || []);
      } catch (error) {
        console.error("스크랩 목록 불러오기 실패:", error);
      }
    };

    fetchScrapPosts();
  }, []);

  // 🔹 프로필 이미지 변경 핸들러
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
            <p className="text-lg font-semibold">{userName}</p>
            <p className="text-gray-500">회원 정보</p>
          </div>
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
