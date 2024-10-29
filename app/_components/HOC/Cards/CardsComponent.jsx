import React from "react";
import { FaGlobe, FaExpand } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Image from "next/image";
import ShimmerLoader from "../../FieldNotesModal/shimmer";

const CardsComponent = ({
  cards,
  onCardClick,
  renderCustomContent,
  emptyStateMessage = "No results found",
  emptyStateImage = "/svg.jpg",
  isLoading = false,
  previousCount = 0,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  if (isLoading) {
    // Use either the previous count of cards or the current count
    const expectedCount = previousCount || cards?.length || 0;
    return <ShimmerLoader expectedCount={expectedCount} />;
  }
  if (cards?.length === 0) {
    return (
      <div className="flex justify-center mt-4">
        <div className="text-center flex flex-col justify-center max-w-md mx-auto">
          <p className="text-md">{emptyStateMessage}</p>
          <Image
            src={emptyStateImage}
            width={300}
            height={300}
            alt="No results"
            className="mx-auto md:w-[73%]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards?.map((card) => (
        <div
          key={card._id}
          className="bg-white shadow-md rounded-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{card.username}</h3>
              <p className="text-sm text-gray-600">
                <b> Room:</b> {card.room} &nbsp;&nbsp; <b>Ceated At:</b>{" "}
                {formatDate(card.createdAt)}
              </p>
            </div>
            <div className="flex space-x-2">
              {/* <FaGlobe className="text-gray-600" /> */}
              <FaExpand
                className="text-gray-600"
                onClick={() => onCardClick(card)}
              />
              <MdOutlineDelete
                className="text-gray-600"
                onClick={() => {
                  console.log("CLiekd");
                }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            <b>Floor:</b> {card.floor}
          </p>
          <div className="my-2 bg-gray-200 p-2 rounded-md">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                card.priority === "High"
                  ? "bg-red-200 text-red-800"
                  : card.priority === "Medium"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {card.priority}
            </span>
          </div>
          {card.groundFloorImages && card.groundFloorImages.length > 0 && (
            <div className="my-2 relative w-full h-48">
              <Image
                src={card.groundFloorImages[0].url}
                alt="Ground Floor Image"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          )}
          <div className="my-2 flex flex-wrap gap-1">
            {card.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2 my-2 bg-gray-200 p-2 rounded-md">
            {card.description}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <b>Assignee:</b> {card.assignee}
          </p>
          <p className="text-sm text-gray-600">
            <b>Status:</b> {card.status}
          </p>
          <p className="text-sm text-gray-600">
            <b>Due:</b> {formatDate(card.dueDate)}
          </p>

          {renderCustomContent && renderCustomContent(card)}
        </div>
      ))}
    </div>
  );
};

export default CardsComponent;
