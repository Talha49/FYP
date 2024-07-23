import React from "react";

const Dialog = ({ isOpen, onClose, children, widthClass = "w-[300px]" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto ty-40 flex pl-12 pt-16">
      <div
        className={`relative  bg-white text-black mr-auto flex-col flex border ${widthClass} h-full overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          className=" z-10 top-3 sticky right-3 text-black bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* Content */}
        <div className="py-4 text-left">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
