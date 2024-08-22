import React, { useState, useRef } from "react";

const Dialog = ({
  isOpen,
  onClose,
  children,
  widthClass ,
  isLeft = true,
  withBlur = false,
  padding,
  customButton,
  minWidth=400, 
}) => {
  const dialogRef = useRef(null);

  const [minwidth, setMinwidth] = useState(minWidth)

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const dialog = dialogRef.current;
    if (dialog) {
      const newWidth = e.clientX - dialog.getBoundingClientRect().left;
      if (newWidth >= minWidth) {
        dialog.style.width = `${newWidth}px`;
      } else {
        dialog.style.width = `${minWidth}px`;
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-auto ty-40 flex pl-12 pt-16 ${padding} ${
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
        ref={dialogRef}
        className={`relative bg-white text-black ${
          isLeft ? "mr-auto" : "m-auto"
        } flex-col flex border ${widthClass} h-full overflow-y-auto custom-scrollbars ${
          isOpen ? "animate-slide-in" : "animate-slide-out"
        }`}
      >
        {/* Custom Button */}
        {customButton}
        {/* Content */}
        <div className="text-left">{children}</div>
        <div
          className="absolute top-0 right-0 h-full w-2 cursor-ew-resize"
          onMouseDown={handleMouseDown}
        ></div>
      </div>
    </div>
  );
};

export default Dialog;