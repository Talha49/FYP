import React from "react";
import { FaSortAmountDown } from "react-icons/fa";
import { CiExport } from "react-icons/ci";
import Link from "next/link";

const FilterSearchComponent = ({
  title,
  onClose,
  searchParam,
  setSearchParam,
  activeFilters,
  setActiveFilters,
  filterButtons,
  resultCount,
  customButtons = [],
  onClearFilters,
}) => {
  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setSearchParam(""); // Clear search when toggling filters
  };

const getSearchPlaceholder = () => {
  if (activeFilters.length === 0) return `Search ${title}`;
  if (activeFilters.length > 1) return "Search in selected filters";

  const activeFilter = activeFilters[0];
  
  // Check if activeFilter is a string before calling toLowerCase
  if (typeof activeFilter === 'string') {
    return `Search ${activeFilter.toLowerCase()}`;
  }

  // Fallback if it's not a string
  return 'Search';
};

  return (
    <div className="border-b-2 bg-white sticky top-0 p-4 z-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {onClose && (
          <button
            className="hover:bg-gray-200 p-2 rounded-md transition-colors"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          className="border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-blue-500 transition-all md:max-w-[70%]"
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
        />
        {/* <button className="bg-transparent border p-2 rounded-md hover:bg-gray-100 transition-colors">
          <FaSortAmountDown />
        </button>
        <button className="bg-transparent text-blue-700 border flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 transition-colors">
          <CiExport />
          Export
        </button> */}
        {customButtons.map((button, index) => (
          <button
            key={index}
            {...button.props}
            className="bg-transparent border p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {button.icon && button.icon}
            {button.text}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center">
        <div className="flex flex-wrap gap-1 text-xs">
          {filterButtons.map((filter) => (
            <button
              key={filter}
              className={`border ${
                activeFilters.includes(filter)
                  ? "bg-blue-500 text-white"
                  : "border-black/15 hover:bg-slate-200"
              } p-2 rounded-full transition-colors`}
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex justify-end ml-auto mt-1 gap-x-2 ">
          <button
            className="text-black p-2 text-xs bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
            onClick={onClearFilters}
          >
            Clear all
          </button>
          <Link
            href="/Upload"
            className="text-white p-2 text-xs  rounded-md button"
          >
            Upload
          </Link>
        </div>
      </div>
      {resultCount !== undefined && (
        <div className="text-gray-600 mt-2">{resultCount} results</div>
      )}
    </div>
  );
};

export default FilterSearchComponent;
