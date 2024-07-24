import React from "react";

const Dialog = ({
  isOpen,
  onClose,
  children,
  widthClass = "w-[300px]",
  isLeft = true,
  withBlur = false,
  padding,
  customButton,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-auto ty-40 flex pl-12 pt-16  ${padding} ${
        isOpen ? "animate-fade-in" : "animate-fade-out"
      }`}
    >
      {withBlur && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[1px] ${
            isOpen ? "animate-fade-in" : "animate-fade-out"
          }`}
          onClick={onClose}
        ></div>
      )}
      <div
        className={`relative bg-white text-black ${isLeft ? "mr-auto" : "m-auto"} flex-col flex border ${widthClass} h-full overflow-y-auto ${
          isOpen ? "animate-slide-in" : "animate-slide-out"
        }`}
      >
        {/* Custom Button */}
        {customButton}
        {/* Content */}
        <div className="text-left">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;