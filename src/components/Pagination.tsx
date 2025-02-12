import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-auto flex justify-center items-center space-x-2 pt-6">
      <button
        className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400" : "text-black"}`}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        ◀ 이전
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-black text-white" : "text-black"}`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        className={`px-3 py-1 border rounded ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        다음 ▶
      </button>
    </div>
  );
};

export default Pagination;
