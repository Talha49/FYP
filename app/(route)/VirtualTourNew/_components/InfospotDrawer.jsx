import React from "react";
import { X } from "lucide-react"; // Close icon

const InfospotDrawer = ({ isOpen, onClose, title, description, children }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-screen w-1/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Drawer Content */}
      <div className="flex flex-col h-full">
        <header className="p-4 bg-blue-50 text-blue-500 flex items-center justify-between shadow-md">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-blue-500 text-sm mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-500 hover:text-blue-600"
          >
            <X size={24} />
          </button>
        </header>

        <main className="p-4 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default InfospotDrawer;
