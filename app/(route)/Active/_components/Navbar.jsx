import React from "react";
import { FaRegBuilding } from "react-icons/fa";
import { TbCapture } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RxDividerVertical } from "react-icons/rx";

function Navbar ({ activeTab, onTabChange }) {
  return (
    <nav className="flex justify-between items-center mb-4 shadow-sm border bg-white  cursor-pointer text-xs">
      <ul className="flex flex-wrap">
        <li
          className={`py-2 px-4  rounded-md ${
            activeTab === "Projects"
              ? "font-semibold text-blue-500"
              : "text-gray-600 hover:bg-blue-50"
          }`}
        >
          <p
            className="flex items-center gap-1"
            onClick={() => onTabChange("Projects")}
          >
            <RxDividerVertical size={25} />
            <FaRegBuilding size={19} />
            Projects
          </p>
        </li>
        <li
          className={`py-2 px-4 rounded-md ${
            activeTab === "Captures"
              ? "font-semibold text-blue-500"
              : "text-gray-600 hover:bg-blue-50"
          }`}
        >
          <p
            className="flex items-center gap-1"
            onClick={() => onTabChange("Captures")}
          >
            <RxDividerVertical size={25} />
            <TbCapture size={19} />
            Captures
          </p>
        </li>
        <li
          className={`py-2 px-4 rounded-md ${
            activeTab === "FieldNotes"
              ? "font-semibold text-blue-500"
              : "text-gray-600 hover:bg-blue-50"
          }`}
        >
          <p
            className="flex items-center gap-1"
            onClick={() => onTabChange("FieldNotes")}
          >
            <RxDividerVertical size={25} />
            <IoDocumentTextOutline size={19} />
            Field Notes
          </p>
        </li>
        <li
          className={`py-2 px-4 rounded-md ${
            activeTab === "Activty"
              ? "font-semibold text-blue-500"
              : "text-gray-600 hover:bg-blue-50"
          }`}
        >
          <p
            className="flex items-center gap-1"
            onClick={() => onTabChange("Activty")}
          >
            <RxDividerVertical size={25} />
            <FiUsers size={19} />
            Activity
          </p>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
