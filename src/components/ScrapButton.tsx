import React, { useState, useEffect } from "react";

interface ScrapButtonProps {
  postId: number;
  onScrapChange?: () => void;
}

const ScrapButton: React.FC<ScrapButtonProps> = ({ postId, onScrapChange }) => {
  const [isScrapped, setIsScrapped] = useState<boolean>(false);

  useEffect(() => {
    const scrappedPosts = JSON.parse(sessionStorage.getItem("scrappedPosts") || "[]");
    setIsScrapped(scrappedPosts.includes(postId));
  }, [postId]);

  const toggleScrap = (e: React.MouseEvent) => {
    e.stopPropagation();

    const scrappedPosts = JSON.parse(sessionStorage.getItem("scrappedPosts") || "[]");

    if (scrappedPosts.includes(postId)) {
      const updatedPosts = scrappedPosts.filter((id: number) => id !== postId);
      sessionStorage.setItem("scrappedPosts", JSON.stringify(updatedPosts));
      setIsScrapped(false);
    } else {
      scrappedPosts.push(postId);
      sessionStorage.setItem("scrappedPosts", JSON.stringify(scrappedPosts));
      setIsScrapped(true);
    }

    if (onScrapChange) onScrapChange();
  };

  return (
    <button onClick={toggleScrap} className="text-gray-600 hover:text-red-500">
      {isScrapped ? "❤️" : "🤍"}
    </button>
  );
};

export default ScrapButton;
