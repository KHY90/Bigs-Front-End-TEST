import React from "react";

interface SortDropdownProps {
  sortOrder: "latest" | "oldest";
  setSortOrder: (order: "latest" | "oldest") => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="relative">
      <select
        className="border px-3 py-2 rounded text-sm sm:text-base bg-white shadow cursor-pointer"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as "latest" | "oldest")}
      >
        <option value="latest">최신순</option>
        <option value="oldest">오래된순</option>
      </select>
    </div>
  );
};

export default SortDropdown;
