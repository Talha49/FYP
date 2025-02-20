"use client";
import React, { useState } from "react";

const SwitchButton = ({ checked = false, onChange }) => {

  return (
    <button
      className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        checked ? "bg-blue-500" : "bg-gray-400"
      }`}
      onClick={onChange}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </button>
  );
};

export default SwitchButton;
