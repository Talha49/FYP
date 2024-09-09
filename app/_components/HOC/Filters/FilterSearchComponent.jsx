import React from 'react';
import { FaSortAmountDown } from "react-icons/fa";
import { CiExport } from "react-icons/ci";

const FilterSearchComponent = ({ 
  title,
  onClose,
  searchParam,
  setSearchParam,
  activeFilters,
  setActiveFilters,
  filterButtons,
  resultCount,
  customButtons = []
}) => {
  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setSearchParam(""); // Clear search when toggling filters
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchParam("");
  };

  const getSearchPlaceholder = () => {
    if (activeFilters.length === 0) return `Search ${title}`;
    if (activeFilters.length > 1) return "Search in selected filters";
    
    const activeFilter = activeFilters[0];
    return `Search ${activeFilter.toLowerCase()}`;
  };

  return (
    <div className="border-b-2 bg-white sticky top-0 p-4 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        {onClose && (
          <button className="hover:bg-gray-200 p-2 rounded-md" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          className="border border-gray-300 rounded-md p-2 w-full outline-none md:max-w-[70%]"
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
        />
        <button className="bg-transparent border p-2 rounded-md">
          <FaSortAmountDown />
        </button>
        <button className="bg-transparent text-blue-700 border flex items-center gap-2 p-2 rounded-md">
          <CiExport />
          Export
        </button>
        {customButtons.map((button, index) => (
          <button key={index} {...button.props}>
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
              } p-2 rounded-full`}
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex justify-end ml-auto mt-1">
          <button
            className="text-black p-2 text-xs bg-slate-200 rounded-md"
            onClick={clearFilters}
          >
            Clear all
          </button>
        </div>
      </div>
      {resultCount !== undefined && (
        <div className="text-gray-600 mt-2">{resultCount} results</div>
      )}
    </div>
  );
};

export default FilterSearchComponent;