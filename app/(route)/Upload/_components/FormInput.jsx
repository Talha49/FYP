// FormInput.jsx
import React from 'react';

export const FormInput = ({ label, id, name, type = 'text', value, onChange, disabled = false, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  </div>
);
