import axios from "axios";
import authStore from "../stores/authStore";
import { BlogPost } from "../types/types";

export const handleEdit = (postId: number, navigate: (path: string) => void) => {
  navigate(`/edit/${postId}`);
};

export const handleDelete = async (
  postId: number,
  setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>
) => {
  if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

  try {
    await axios.delete(`/api/boards/${postId}`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });

    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

    alert("게시글이 삭제되었습니다.");
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    alert("게시글 삭제 중 오류가 발생했습니다.");
  }
};
