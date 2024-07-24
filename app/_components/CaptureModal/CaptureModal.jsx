// components/CaptureModal.js
"use client";
import React, { useState } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { LuFolderInput } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

const CaptureModal = ({ title }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetFilter, setSheetFilter] = useState("");
  const [captureTypeFilter, setCaptureTypeFilter] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(null);

  const handleCardClick = (id) => {
    setSelectedCardId(selectedCardId === id ? null : id);
  };
  const cardsData = [
    {
      id: 1,
      date: "Jan 16, 2019",
      floor: "Floor 2",
      captureType: "360° video",
      captureName: "Unnamed capture",
      imageUrl: "/floor2.jpg", // Replace with the correct image path
    },
    {
      id: 2,
      date: "Jan 16, 2019",
      floor: "Floor 2",
      captureType: "360° video",
      captureName: "Unnamed capture",
      imageUrl: "/floor2.jpg", // Replace with the correct image path
    },
    {
      id: 3,
      date: "Jan 16, 2019",
      floor: "Floor 2",
      captureType: "360° video",
      captureName: "Unnamed capture",
      imageUrl: "/floor2.jpg", // Replace with the correct image path
    },
    {
      id: 4,
      date: "Jan 16, 2019",
      floor: "Floor 2",
      captureType: "360° video",
      captureName: "Unnamed capture",
      imageUrl: "/floor2.jpg", // Replace with the correct image path
    },
    // Add more card objects as needed
  ];

  return (
    <div className="px-2 mx-auto">
      <div className="border-b p-2 sticky top-0 bg-white z-10 ">
        <h1 className="text-xl font-bold mx-2 mb-4">{title}</h1>
        <div className="mb-4 flex space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by capture name or floor"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-gray-200 p-2 rounded">
           <FaSortAmountDown/>
          </button>
        </div>
        <div className="flex space-x-2">
          <select
            value={sheetFilter}
            onChange={(e) => setSheetFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Filter by sheet</option>
            {/* Add more options as needed */}
          </select>
          <select
            value={captureTypeFilter}
            onChange={(e) => setCaptureTypeFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Filter by capture type</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>

      <div>
        <div className="mt-4">
          {cardsData.map((card) => (
            <div
              key={card.id}
              className={`border ${
                selectedCardId === card.id
                  ? "border-blue-500"
                  : "border-gray-200"
              } p-4 mb-4 cursor-pointer flex`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="relative  w-1/2">
                <img
                  src={card.imageUrl}
                  alt="Card"
                  className="w-full h-full object-cover"
                />
                {selectedCardId === card.id && (
                  <span className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="w-1/2 pl-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">{card.date}</p>
                  <div className="flex gap-1">
                    <button className=" ">
                      <LuFolderInput size={20} />
                    </button>
                    <button className="">
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{card.floor}</p>
                <div className="mt-2 flex items-center">
                  <span className="bg-green-200 text-green-800 p-1 rounded text-xs">
                    {card.captureType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="mt-2 text-xs text-gray-700">
                    {card.captureName}
                  </p>
                  <button>
                    <GoPencil />
                  </button>
                  
                </div>
                <div>
                {selectedCardId !== card.id && (
                  <span className=" bg-blue-500 text-white px-2 py-1 text-xs">
                    View Capture
                  </span>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaptureModal;
