'use client'
import React, { useState } from 'react';
import Register from './_components/Register';
import Login from './_components/Login';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('register'); // Default tab is 'login'

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full p-6 rounded-lg">
      <div className="flex justify-center">
        <button
          onClick={() => handleTabClick('login')}
          className={`w-[150px] px-4 py-2 font-semibold rounded-tl-xl ${
            activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => handleTabClick('register')}
          className={`w-[150px] px-4 py-2 font-semibold rounded-tr-xl ${
            activeTab === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Register
        </button>
      </div>
      <div className="p-4 border rounded-lg bg-gray-50">
        {activeTab === 'login' && <Login />}
        {activeTab === 'register' && <Register />}
      </div>
    </div>
  );
};

export default Auth;
