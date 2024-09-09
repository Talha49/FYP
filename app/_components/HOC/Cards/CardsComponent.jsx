import React from 'react';
import { FaGlobe, FaExpand } from "react-icons/fa";
import Image from "next/image";

const CardsComponent = ({ 
  cards, 
  onCardClick, 
  renderCustomContent,
  emptyStateMessage = "No results found",
  emptyStateImage = '/svg.jpg'
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  if (cards?.length === 0) {
    return (
      <div className="flex justify-center mt-4">
        <div className="text-center flex flex-col justify-center max-w-md mx-auto">
          <p className="text-md">{emptyStateMessage}</p>
          <Image src={emptyStateImage} width={300} height={300} alt="No results" className="mx-auto md:w-[73%]" />
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
          onClick={() => onCardClick(card)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{card.name}</h3>
              <p className="text-sm text-gray-600">
                {card.room} &nbsp;&nbsp; {formatDate(card.createdAt)}
              </p>
            </div>
            <div className="flex space-x-2">
              <FaGlobe className="text-gray-600" />
              <FaExpand className="text-gray-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{card.floor}</p>
          <div className="my-2 bg-gray-200 p-2 rounded-md">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              card.priority === "High" ? "bg-red-200 text-red-800" :
              card.priority === "Medium" ? "bg-yellow-200 text-yellow-800" :
              "bg-green-200 text-green-800"
            }`}>
              {card.priority}
            </span>
          </div>
          {card.imageUrls && card.imageUrls.length > 0 && (
            <div className="my-2">
              <img
                src='/floor.jpg'
                alt="Card Image"
                className="rounded-md w-full h-48 object-cover"
              />
            </div>
          )}
          <div className="my-2 flex flex-wrap gap-1">
            {card.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">{card.description}</p>
          <p className="text-sm text-gray-600 mt-2">Assignee: {card.assignee}</p>
          <p className="text-sm text-gray-600">Status: {card.status}</p>
          {renderCustomContent && renderCustomContent(card)}
        </div>
      ))}
    </div>
  );
};

export default CardsComponent;