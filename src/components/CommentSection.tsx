import React, { useEffect, useState } from "react";

interface Comment {
  id: number;
  postId: number;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const storedComments = sessionStorage.getItem(`comments_${postId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [postId]);

  const saveCommentsToStorage = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    sessionStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      postId,
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    saveCommentsToStorage([...comments, comment]);
    setNewComment("");
  };

  const handleEditComment = (id: number, content: string) => {
    setEditingCommentId(id);
    setEditContent(content);
  };

  const handleUpdateComment = () => {
    if (!editContent.trim()) return;
    const updatedComments = comments.map((comment) =>
      comment.id === editingCommentId ? { ...comment, content: editContent } : comment
    );

    saveCommentsToStorage(updatedComments);
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleDeleteComment = (id: number) => {
    if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) return;
    saveCommentsToStorage(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-3">댓글</h3>

      <div className="flex flex-col space-y-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-3 rounded shadow text-sm flex justify-between">
              <div>
                {editingCommentId === comment.id ? (
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  <p className="text-gray-700">{comment.content}</p>
                )}
                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                {editingCommentId === comment.id ? (
                  <button
                    onClick={handleUpdateComment}
                    className="text-green-500 text-xs hover:text-green-600"
                  >
                    ✔
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditComment(comment.id, comment.content)}
                    className="text-yellow-500 text-xs hover:text-yellow-600"
                  >
                    ✏
                  </button>
                )}
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 text-xs hover:text-red-600"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">댓글이 없습니다.</p>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded text-sm"
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
          onClick={handleAddComment}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
