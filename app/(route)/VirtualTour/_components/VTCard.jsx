import React from "react";
import { CalendarDays, CircleCheckBig, Telescope } from "lucide-react";
import { formatTimestamp } from "../utils";

const VTCard = ({ tour, buttonOnClick, isSelectionDialog }) => {
  return (
    <div className="group relative bg-white rounded-xl border hover:scale-105 border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Image container with centered overlay effect */}
      <div className="relative h-40 overflow-hidden">
        {/* Overlay with centered info icon */}
        <div className="absolute z-10 inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <CalendarDays
              size={22}
              className="text-white transform scale-0 group-hover:scale-100 transition-transform duration-300 cursor-pointer"
            />
            <p className="text-white">{formatTimestamp(tour?.createdAt)}</p>
          </div>
        </div>

        <img
          src={tour?.frames[0]?.url}
          alt={tour?.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Content section */}
      <div className="relative p-4 space-y-2">
        {/* Title with animated underline */}
        <h2 className="text-2xl font-bold text-gray-800">
          <span className="relative inline-block">
            {tour?.name}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
          </span>
        </h2>

        {/* Description with line clamp */}
        <p className="text-gray-600 leading-relaxed line-clamp-3">
          {tour?.description}
        </p>

        {/* Button with hover effect */}
        <div className="pt-2" onClick={buttonOnClick}>
          <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 active:bg-blue-700 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:shadow-inner active:translate-y-0">
            {isSelectionDialog ? (
              <span className="flex items-center gap-2">
                <CircleCheckBig /> Select
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Telescope /> Explore Now
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VTCard;
