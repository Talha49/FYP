// components/ImageUploadSection.jsx
import React from 'react';
import { BsUpload, BsTrash } from "react-icons/bs";

const ImageUploadSection = ({ title, images, setImages, inputId, singleImage = false }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (singleImage) {
      setImages(files[0] ? [{ file: files[0], preview: URL.createObjectURL(files[0]) }] : []);
    } else {
      setImages((prev) => [...prev, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    }
  };

  const handleImageRemove = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => {
        const newImages = [...prev];
        URL.revokeObjectURL(newImages[index].preview);
        newImages[index] = { file, preview: URL.createObjectURL(file) };
        return newImages;
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50">
        <input
          type="file"
          multiple={!singleImage}
          onChange={handleImageUpload}
          className="hidden"
          id={inputId}
        />
        <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center">
          <BsUpload className="text-4xl text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Upload Image{singleImage ? '' : 's'}</span>
        </label>
      </div>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img.preview} alt={`${title} ${index}`} className="w-32 h-32 object-cover rounded-lg" />
              <div className="absolute top-0 right-0 flex space-x-1">
                <label className="cursor-pointer bg-blue-500 text-white p-1 rounded-full">
                  <BsUpload size={16} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </label>
                <button
                  onClick={() => handleImageRemove(index)}
                  className="bg-red-500 text-white p-1 rounded-full"
                >
                  <BsTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;