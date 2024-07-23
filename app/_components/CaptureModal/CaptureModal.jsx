// components/CaptureModal.js
"use client"
import React,{ useState } from 'react';
import { FaSortAmountDown } from "react-icons/fa";

const CaptureModal = ({title}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('');
  const [captureType, setCaptureType] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (cardId) => {
    setSelectedCard(selectedCard === cardId ? null : cardId);
  };
;

  const cardData = [
    {
      id: 1,
      date: "Jan 16, 2019",
      floor: "Floor 2",
      video: "360° video",
      title: "Unnamed capture",
      image: "/floor.jpg"
    },
    {
        id: 2,
        date: "Jan 16, 2019",
        floor: "Floor 2",
        video: "360° video",
        title: "Unnamed capture",
        image: "/floor.jpg"
      },
    // Add more card objects as needed
  ];
  
  

  return (
    <div>
 <div className="w-full max-w-[500px] p-4">
 <h1 className="text-xl font-bold mx-2 mb-4">{title}</h1>

      <div className=" mb-4 flex items-center gap-x-4">
        <input
          type="text"
          placeholder="Search by capture name or floor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <FaSortAmountDown size={20}/>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedSheet}
          onChange={(e) => setSelectedSheet(e.target.value)}
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by sheet</option>
          {/* Add options here */}
        </select>
        <select
          value={captureType}
          onChange={(e) => setCaptureType(e.target.value)}
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by capture type</option>
          {/* Add options here */}
        </select>
      </div>
    </div>


 <div>
 
 <div className="w-full">
      {cardData.map((card) => (
        <div
          key={card.id}
          className={`border p-4 m-2 ${selectedCard === card.id ? 'border-blue-500' : 'border-gray-300'}`}
          onClick={() => handleCardClick(card.id)}
        >
          <div className="flex relative">
            {selectedCard === card.id && (
              <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs p-2 rounded-t-md">
                CURRENT
              </div>
            )}
            <img src={card.image} alt="Card Image" className="w-1/3" />
            <div className="w-2/3 pl-4">
              <div className="text-gray-500">{card.date}</div>
              <div className="text-gray-500">{card.floor}</div>
              <div className="text-gray-500">{card.video}</div>
              <div className="text-gray-700">{card.title}</div>
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
