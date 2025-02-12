import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-auto flex justify-center items-center space-x-1 sm:space-x-2 pt-6 text-xs sm:text-sm md:text-base">
      <button
        className={`px-2 sm:px-3 py-1 border rounded ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-black hover:bg-gray-200"
        }`}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        ◀ 이전
      </button>

      <div className="flex space-x-1 sm:space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`px-2 sm:px-3 py-1 border rounded ${
              currentPage === index + 1
                ? "bg-black text-white"
                : "text-black hover:bg-gray-200"
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        className={`px-2 sm:px-3 py-1 border rounded ${
          currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-black hover:bg-gray-200"
        }`}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        다음 ▶
      </button>
    </div>
  );
};

export default Pagination;
