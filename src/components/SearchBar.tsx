import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
      <input
        type="text"
        placeholder="제목 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-3 py-2 rounded w-full sm:w-auto text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <button
        onClick={() => onSearch(query)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm sm:text-base"
      >
        검색
      </button>
    </div>
  );
};

export default SearchBar;
