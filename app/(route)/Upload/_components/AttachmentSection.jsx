// AttachmentSection.jsx
import React from 'react';
import { BsUpload, BsTrash } from "react-icons/bs";

export const AttachmentSection = ({ attachments, setAttachments }) => {
  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleAttachmentRemove = (index) => {
    setAttachments((prev) => {
      const newAttachments = [...prev];
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Attachments</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50">
        <input
          type="file"
          multiple
          onChange={handleAttachmentUpload}
          className="hidden"
          id="attachments"
        />
        <label htmlFor="attachments" className="cursor-pointer flex flex-col items-center">
          <BsUpload className="text-4xl text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Upload Attachments</span>
        </label>
      </div>
      {attachments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Uploaded Attachments:</h3>
          <ul className="list-disc pl-5">
            {attachments.map((file, index) => (
              <li key={index} className="text-sm text-gray-600 flex justify-between items-center">
                {file.name}
                <button onClick={() => handleAttachmentRemove(index)} className="ml-2 text-red-500">
                  <BsTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};