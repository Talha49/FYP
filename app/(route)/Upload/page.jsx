"use client";
import React from "react";
import TaskCreationForm from "./UploadForm/UploadForm";
import { useSession } from "next-auth/react";

const Upload = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] ">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Please log in first</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the upload form. Please log in to continue.
          </p>
          <button
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={() => window.location.href = '/Auth'}  // Link to the login page
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TaskCreationForm />
    </div>
  );
};

export default Upload;
