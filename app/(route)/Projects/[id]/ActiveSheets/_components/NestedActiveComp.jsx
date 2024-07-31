import Link from "next/link";
import React, { useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SlLayers } from "react-icons/sl";
import { IoGridOutline } from "react-icons/io5";
import { CiZoomOut, CiZoomIn } from "react-icons/ci";
import CalendarComponent from "./CalendarComponent"; 

const NestedActiveComp = () => {
  const nestedSheets = [
    { id: "1", title: "Floor 1", image: "/floor2.jpg", date: '2024-07-20' },
    { id: "2", title: "Floor 2", image: "/floor2.jpg", date: '2024-07-20' },
    { id: "3", title: "Floor 3", image: "/floor2.jpg", date: '2024-08-01' },
    { id: "4", title: "Floor 4", image: "/floor2.jpg", date: '2024-09-15' },
    { id: "5", title: "Floor 5", image: "/floor2.jpg", date: '2024-02-10' },
    
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTransformed, setIsTransformed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFullCalendar, setShowFullCalendar] = useState(true);
  const imageRef = useRef(null);

  const openDialog = (image) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoomLevel((prev) => prev + 0.2);
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 1));
  };

  const transformLayout = () => {
    setIsTransformed((prev) => !prev);
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    imageRef.current.style.cursor = "grabbing";
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    imageRef.current.style.cursor = "grab";
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const toggleCalendarView = () => {
    setShowFullCalendar((prev) => !prev);
  };

  const filteredSheets = selectedDate
    ? nestedSheets.filter((sheet) => sheet.date === selectedDate)
    : nestedSheets;

  return (
    <div>
      <div className="flex justify-end mb-4">
        
      </div>
      <div className={`grid ${isTransformed ? 'grid-cols-1 place-items-center' : 'lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2'} gap-2`}>
        {filteredSheets.map((sheets) => (
          <div
            key={sheets.id}
            className="relative w-full bg-white h-full rounded-lg mt-4 shadow-lg overflow-hidden cursor-pointer"
          >
            <div className="py-2">
              <div className="font-bold text-xl mb-2 text-center">
                {sheets.title}
              </div>
            </div>
            <div className={`px-4 pb-1 ${isTransformed ? 'flex justify-center items-center h-full' : ''}`}>
              <img
                src={sheets.image}
                alt="Floor Plan"
                className={`object-contain ${isTransformed ? 'w-full rotate-3d' : ''}`}
                onClick={() => openDialog(sheets.image)}
              />
            </div>
          </div>
        ))}
        {filteredSheets.length === 0 && (
          <div className="w-full text-center text-gray-500 mt-4">No cards available for this date.</div>
        )}
        <Transition show={isDialogOpen}>
          <Dialog
            onClose={closeDialog}
            className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-white bg-opacity-5"
            as="div"
          >
            <Transition.Child
              enter="transition-opacity ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-white bg-opacity-50"></div>
            </Transition.Child>
            <Transition.Child
              enter="transition-transform ease-out duration-300"
              enterFrom="scale-95"
              enterTo="scale-100"
              leave="transition-transform ease-in duration-200"
              leaveFrom="scale-100"
              leaveTo="scale-95"
            >
              <div className="relative bg-white rounded-lg overflow-hidden max-w-full max-h-full">
                <div
                  className="relative"
                  style={{ cursor: 'grab', width: '100%', height: '100%' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Zoomed Floor Plan"
                    className="object-contain max-w-[350px] md:max-w-[600px] lg:max-w-[800px]"
                    style={{ transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)` }}
                  />
                </div>
                <div className="absolute md:top-4 md:right-4 top-1 right-1 flex ">
                  <button onClick={zoomIn} className=" text-black md:text-[2.5rem] text-md   px-2 py-1 rounded">
                    <CiZoomIn />
                  </button>
                  <button onClick={zoomOut} className="text-black md:text-[2.5rem] text-md px-2 py-1 rounded">
                    <CiZoomOut />
                  </button>
                  <button onClick={closeDialog} className="text-black md:text-[1.5rem] text-sm px-2 py-1 rounded">
                    X
                  </button>
                </div>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition>
        <button
          onClick={transformLayout}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-10"
        >
          {isTransformed ? <IoGridOutline /> : <SlLayers />}
        </button>
        <button
          onClick={toggleCalendarView}
          className="fixed bottom-14 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-10"        >
          {showFullCalendar ? "Hide" : "Calendar"}
        </button>
      </div>
      <div className="mt-8">
        <CalendarComponent
          showFullCalendar={showFullCalendar}
          nestedSheets={nestedSheets}
          handleDateClick={handleDateClick}
        />
      </div>
    </div>
  );
};

export default NestedActiveComp;
