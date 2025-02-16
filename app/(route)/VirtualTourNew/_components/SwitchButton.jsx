"use client";
import React, { useState } from "react";

const SwitchButton = ({ checked = false, onChange }) => {
  const [isOn, setIsOn] = useState(checked);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    if (onChange) onChange(!isOn);
  };

  return (
    <button
      className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
        isOn ? "bg-blue-500" : "bg-gray-400"
      }`}
      onClick={toggleSwitch}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </button>
  );
};

export default SwitchButton;
