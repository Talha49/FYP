import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const Dialog = ({ children, title, isOpen, onClose, className }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose} // Click outside to close
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 w-full overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b pb-3">
          <span className="text-xl font-semibold">{title}</span>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <IoMdClose size={24} />
          </button>
        </header>

        {/* Content */}
        <div className="mt-4">{children}</div>

        {/* Footer (optional) */}
        {/* <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Dialog;
