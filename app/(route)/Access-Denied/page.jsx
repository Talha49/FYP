"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaLock } from 'react-icons/fa';

const AccessDeniedPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center max-w-md">
        <FaLock className="text-red-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          You do not have the necessary permissions to access this page. Please
          contact your administrator if you believe this is a mistake.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
