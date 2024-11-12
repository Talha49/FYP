// ImageComponent.js
import React from 'react';
import Image from 'next/image';
import { CiZoomIn, CiZoomOut } from "react-icons/ci";


const ImageComponent = ({ 
  imageSrc, 
  altText, 
  zoomLevel, 
  position, 
  onZoomIn, 
  onZoomOut, 
  onMouseMove, 
  onMouseDown, 
  onMouseUp, 
  onMouseLeave, 
  dragging,
  showZoomControls = true,
  width,
  height,
  imageType,
  taskId,
  editmode = false, // Add editmode prop with default value
}) => {

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!editmode || !file) return; // Early return if not in edit mode or no file selected

   
  };

  return (
    <div className="relative overflow-hidden rounded-lg shadow-md bg-white">
      <div
        className="relative w-full h-full"
        style={{ 
          cursor: dragging ? "grabbing" : "grab",
          aspectRatio: width / height
        }}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <Image
          src={imageSrc}
          alt={altText}
          layout="fill"
          objectFit="cover"
          style={{
            transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: "center",
            transition: dragging ? "none" : "transform 0.1s",
          }}
        />
      </div>
    
      {showZoomControls && (
        <div className="absolute top-2 right-2 flex flex-col gap-y-2">
          <button onClick={onZoomIn} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
            <CiZoomIn size={20} />
          </button>
          <button onClick={onZoomOut} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
            <CiZoomOut size={20} />
          </button>
        </div>
      )}
      
    </div>
  );
};

// GroundFloorImageSection.js
const GroundFloorImageSection = ({
  images,
  currentIndex,
  zoomLevel,
  position,
  onZoomIn,
  onZoomOut,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  dragging,
  onPrevious,
  onNext,
  taskId,
  editmode,
}) => {
  

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!editmode || !file) return;

   
  };

  return (
    <div className="mb-2">
      <h2 className="text-md font-medium my-2 bg-gray-200 p-2 rounded-md">Site Inspection Photos</h2>
      <ImageComponent
        imageSrc={images[currentIndex].url}
        altText="Ground Floor Image"
        zoomLevel={zoomLevel}
        position={position}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        dragging={dragging}
        showZoomControls={true}
        width={600}
        height={400}
        imageType="groundFloor"
        taskId={taskId}
        editmode={editmode}
      />
      <div className="flex justify-between items-center mt-4">
        <button onClick={onPrevious} className="text-blue-600 hover:underline">
          Previous
        </button>
        <div className="flex space-x-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`block w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
        <button onClick={onNext} className="text-blue-600 hover:underline">
          Next
        </button>
      </div>
    </div>
  );
};
// LastFloorImageSection.js
const LastFloorImageSection = ({ 
  image, 
  zoomLevel, 
  position, 
  onZoomIn, 
  onZoomOut, 
  onMouseMove, 
  onMouseDown, 
  onMouseUp, 
  onMouseLeave, 
  dragging,
  taskId,
  editmode, // Add editmode prop
}) => {
  return (
    <div className="mb-2">
      <h2 className="text-md font-medium my-2 bg-gray-200 p-2 rounded-md">Floor Plans</h2>
      <ImageComponent
        imageSrc={image.url}
        altText="Last Floor Image"
        zoomLevel={zoomLevel}
        position={position}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        dragging={dragging}
        showZoomControls={true}
        width={500}
        height={350}
        imageType="lastFloor"
        taskId={taskId}
        editmode={editmode} // Pass editmode prop
      />
    </div>
  );
};

export { ImageComponent, GroundFloorImageSection, LastFloorImageSection };