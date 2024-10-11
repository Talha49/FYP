// ImageComponent.js
import React from 'react';
import Image from 'next/image';
import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase/firebaseConfig';
import { useDispatch } from 'react-redux';
import { updateTask } from '@/lib/Features/TaskSlice';

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
  showChangePhoto = true,
  showZoomControls = true,
  showToggle = false,
  width,
  height,
  updateImage,
  imageType, // 'groundFloor' or 'lastFloor'
  taskId
}) => {
  const dispatch = useDispatch();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Upload to Firebase
        const storageRef = ref(storage, `images/${imageType}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the image in the component state and parent component
        updateImage(downloadURL);

        // Prepare the update data
        const updateData = {
          [imageType === 'groundFloor' ? 'groundFloorImages' : 'lastFloorImages']: [{ url: downloadURL }],
        };

        // Dispatch the updateTask action
        dispatch(updateTask({ taskId, updateData }));

      } catch (error) {
        console.error('Error updating image:', error);
        // Optionally, you can show an error message here
      }
    }
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
      {showChangePhoto && (
        <div className="absolute top-2 left-2">
          <label className="p-2 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors cursor-pointer">
            Change photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
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
      {showToggle && (
        <div className="absolute bottom-2 right-2">
          <label className="relative inline-block h-6 w-12 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-blue-500">
            <input className="peer sr-only" type="checkbox" />
            <span className="absolute inset-y-0 start-0 m-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:start-6"></span>
          </label>
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
  updateImage,
  taskId
}) => {
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
        showChangePhoto={true}
        showZoomControls={true}
        showToggle={true}
        width={600}
        height={400}
        updateImage={(newUrl) => updateImage(newUrl, currentIndex)}
        imageType="groundFloor"
        taskId={taskId}
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
  updateImage,
  taskId
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
        showChangePhoto={true}
        showZoomControls={true}
        showToggle={false}
        width={500}
        height={350}
        updateImage={updateImage}
        imageType="lastFloor"
        taskId={taskId}
      />
    </div>
  );
};

export { ImageComponent, GroundFloorImageSection, LastFloorImageSection };