import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const Dialog = ({
  children,
  title,
  isOpen,
  onClose,
  className,
  isVTshowDialog = false,
  header = true,
}) => {
  const [show, setShow] = useState(false);

  // Handle Escape key press to close
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeDialog();
      }
    };
    if (isOpen) {
      setShow(true);
      document.addEventListener("keydown", handleEscape);
    } else {
      setShow(false);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const closeDialog = () => {
    setShow(false);
    setTimeout(onClose, 300); // Wait for animation to complete before closing
  };

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      onClick={closeDialog} // Click outside to close
    >
      <div
        className={`relative bg-white rounded-xl shadow-xl w-full flex flex-col transition-transform duration-300 overflow-x-hidden ${
          show
            ? "translate-y-0 opacity-100"
            : `${
                isVTshowDialog ? "translate-y-96" : "-translate-y-20"
              } opacity-0`
        } ${className}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        {header && (
          <header className="flex items-center justify-between border-b p-4 sticky top-0 bg-white rounded-t-xl z-10">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={closeDialog}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <IoMdClose size={24} />
            </button>
          </header>
        )}

        {/* Scrollable Content */}
        <div className={`${header ? "p-4" : "p-0"} overflow-y-auto flex-1`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
