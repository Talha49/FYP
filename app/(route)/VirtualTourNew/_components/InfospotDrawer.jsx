import React from "react";
import { RefreshCw, X } from "lucide-react"; // Close icon

const InfospotDrawer = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  isLoading,
  onRefresh,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-screen w-1/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Drawer Content */}
      <div className="flex flex-col h-full">
        <header className="relative p-4 bg-blue-500 text-white flex items-center justify-between shadow-md">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-blue-50 text-sm mt-1">{description}</p>
            <button
              className="flex items-center gap-2 bg-white rounded-md text-blue-500 px-2 py-0.5 mt-2"
              onClick={onRefresh}
            >
              <RefreshCw
                size={18}
                className={`${isLoading && "animate-spin"}`}
              />
              <p>{isLoading ? "Please wait..." : "Refresh"}</p>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-neutral-100 absolute top-4 right-4"
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
