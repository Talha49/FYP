"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";

function ProfileComp() {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex justify-center py-10  min-h-screen">
      <div className="p-6  w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-2">Your profile</h1>
        <p className="text-gray-600 mb-6">Joined December, 2022</p>
        <div className="flex gap-10 md:flex-row flex-col">
          {/* Left Section */}
          <div className="md:w-1/2 w-full">
            <div>
              <p className="font-semibold mb-1">Profile Photo</p>
              <div className="mb-4 flex items-center space-x-4">
                <div className="w-36 h-36 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-4xl font-semibold overflow-hidden">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={100}
                      height={100}
                    />
                  ) : (
                    "Dp"
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  {profileImage ? (
                    <button
                      className="text-gray-500 mt-1 hover:underline"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleUploadClick}
                      className="text-blue-500 mt-2 hover:underline"
                    >
                      Upload photo
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full">
                <h2 className="text-lg font-semibold mb-2">
                  Personal information
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Full name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Company name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Company type
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="Other">Other</option>
                    {/* Add other options as needed */}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Job Title</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="Manager">Manager</option>
                    {/* Add other options as needed */}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Country/Region
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="Turkey">Turkey</option>
                    {/* Add other options as needed */}
                  </select>
                </div>
                <button className="bg-gray-300 text-white py-2 px-4 w-full rounded-3xl">
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 w-full">
            <h2 className="text-lg font-semibold mb-2">Email Notifications</h2>
            <p className="text-gray-600 mb-4">
              Manage how often you receive emails from your projects.
            </p>
            <ul>
              <li className="mb-2">
                <NotificationItem
                  title="OpenSpace news"
                  description="When OpenSpace announces relevant updates"
                />
              </li>
              <li className="mb-2">
                <NotificationItem
                  title="Capture uploaded"
                  description="When a capture has been moved to the cloud"
                />
              </li>
              <li className="mb-2">
                <NotificationItem
                  title="Capture preview"
                  description="When a capture is still processing"
                />
              </li>
              <li className="mb-2">
                <NotificationItem
                  title="Capture published"
                  description="When a capture is ready for viewing"
                />
              </li>
              <li className="mb-2">
                <NotificationItem
                  title="Capture reminder"
                  description="When a capture hasn't been taken in two weeks"
                />
              </li>
              <li className="mb-2">
                <NotificationItem
                  title="3D capture uploaded"
                  description="When a 3D capture is uploaded"
                />
              </li>
              <li className="mb-2">
                <NotificationItem
                  title="BIM model ready"
                  description="When a BIM model is ready for viewing"
                />
              </li>
              <li className="mb-2">
                <NotificationItem
                  title="Watched Field Notes"
                  description="When a Field Note is updated"
                />
              </li>
              <li className="mb-2">
                <NotificationItem
                  title="Shared folder updates"
                  description="When a capture is added to a shared folder"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationItem = ({ title, description }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-300">
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-gray-600">{description}</p>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
      <input class="sr-only peer" value="" type="checkbox" />
      <div class="peer rounded-full outline-none duration-100 after:duration-500 w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500  after:content-['No'] after:absolute after:outline-none after:rounded-full after:h-5 after:w-5 after:bg-white after:top-0.5 after:left-0.5 after:flex after:justify-center after:items-center  after:text-xs after:font-bold peer-checked:bg-blue-500 peer-checked:after:translate-x-6 peer-checked:after:content-['Yes'] peer-checked:after:border-white"></div>
    </label>
  </div>
);

export default ProfileComp;
