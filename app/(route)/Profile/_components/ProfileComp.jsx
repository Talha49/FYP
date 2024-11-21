"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import NextImage from "next/image";
import { storage } from "../../../../lib/firebase/firebaseConfig"; // Path to your firebase.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AvatarEditor from "react-avatar-editor";


function ProfileComp() {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState(
    session?.user?.userData?.image || null
  );
  const [formData, setFormData] = useState({
    fullName: session?.user?.userData?.fullName || "",
    email: session?.user?.userData?.email || "",
    address: session?.user?.userData?.address || "",
    city: session?.user?.userData?.city || "",
    contact: session?.user?.userData?.contact || "",
  });
  const [notificationPreferences, setNotificationPreferences] = useState({
    newsUpdates: false,
    captureUploaded: false,
    capturePreview: false,
    capturePublished: false,
    captureReminder: false,
    threeDCaptureUploaded: false,
    bimModelReady: false,
    fieldNotesUpdated: false,
    sharedFolderUpdates: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch latest session data on page load
  useEffect(() => {
    const fetchSession = async () => {
      const updatedSession = await getSession();
      if (updatedSession) {
        setProfileImage(updatedSession.user.userData.image || null);
        setFormData({
          fullName: updatedSession.user.userData.fullName || "",
          email: updatedSession.user.userData.email || "",
          address: updatedSession.user.userData.address || "",
          city: updatedSession.user.userData.city || "",
          contact: updatedSession.user.userData.contact || "",
        });
      }
    };

    fetchSession();
  }, []);


  const handleImageUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); // Set the selected file for cropping
    }
  };

  const handleCrop = async () => {
    setIsSaving(true); // Set saving state to true before starting the process
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob(async (blob) => {
        try {
          const userId = session?.user?.userData?.id; // Unique identifier for user
          const fileRef = ref(storage, `profileImages/${userId}_${Date.now()}.png`);
          await uploadBytes(fileRef, blob); // Upload cropped image
          const downloadURL = await getDownloadURL(fileRef);

          setProfileImage(downloadURL); // Update profile image
          setFile(null); // Close cropping modal

          // Save the cropped image URL in your database
          await fetch("/api/updateProfile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: downloadURL }),
          });
        } catch (error) {
          console.error("Error uploading cropped image:", error);
        }
        finally {
          setIsSaving(false); // Reset saving state
        }
      }, "image/png");
    }
  };

  const handleCancelCrop = () => {
    setFile(null); // Close the cropping modal
  };

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [editor, setEditor] = useState(null); // For capturing the AvatarEditor reference


  const handleImageClick = () => {
    if (profileImage) {
      setIsPreviewOpen(true);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };


  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setIsSaving(true); // Start loading state
    try {
      const response = await fetch("/api/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: profileImage, // Save the compressed image
          notificationPreferences,
        }),
      });

      if (response.ok) {
        window.location.reload();
        setSuccessMessage("Your profile has been updated successfully.");
        setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
        setIsEditing(false); // Switch back to edit mode
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false); // End loading state
    }
  };



  const handleCancel = () => {
    // Reset changes and exit editing mode
    if (session) {
      setProfileImage(session?.user?.userData?.image || null);
      setFormData({
        fullName: session?.user?.userData?.fullName || "",
        email: session?.user?.userData?.email || "",
        address: session?.user?.userData?.address || "",
        city: session?.user?.userData?.city || "",
        contact: session?.user?.userData?.contact || "",
      });
    }
    setIsEditing(false);
  };

  if (!session)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        {/* Spinner Loader */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>

        {/* Loading Text */}
        <p className="text-xl font-medium text-gray-700 mt-6">
          Updating your profile, please wait...
        </p>
      </div>

    );
  const { userData } = session.user;

  return (

    <div className="flex justify-center py-10 min-h-screen">
      <div className="p-6 w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600 mb-6">
          Joined {new Date(userData.createdAt).toLocaleDateString()}
        </p>
        {/*message section*/}
        {successMessage && (
          <div className="mt-2 text-green-600 text-sm font-semibold">
            {successMessage}
          </div>
        )}
        {/* Cropping Modal */}
        {file && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Crop Your Image</h2>
              <AvatarEditor
                ref={(ref) => setEditor(ref)}
                image={file}
                width={250}
                height={250}
                border={50}
                borderRadius={125} // Circle crop
                color={[255, 255, 255, 0.6]} // Transparent background
                scale={1.2} // Zoom level
                rotate={0}
              />
              <div className="flex justify-end mt-4">
                {isSaving ? (
                  <button
                    disabled
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2 opacity-50 cursor-not-allowed"
                  >
                    Saving...
                  </button>
                ) : (
                  <button
                    onClick={handleCrop}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={handleCancelCrop}
                  className="bg-gray-300 text-gray-600 py-2 px-4 rounded-lg"
                  disabled={isSaving} // Disable the cancel button during saving
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-10 md:flex-row flex-col">
          {/* Left Section */}

          <div className="md:w-1/2 w-full">
            <div>
              <p className="font-semibold mb-1">Profile Photo</p>
              <div className="mb-4 flex items-center space-x-4">
                <div className="relative w-36 h-36 rounded-full overflow-hidden border border-gray-300">
                  {profileImage ? (
                    <NextImage
                      src={profileImage}
                      alt="Profile"
                      layout="fill"
                      onClick={handleImageClick}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-500">
                      <span className="text-sm">No Image Set</span>
                    </div>
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
                  {isEditing && (
                      <div className="flex space-x-2">
                      {/* Upload Button */}
                      <button
                        onClick={handleUploadClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 px-3 rounded-md shadow-sm transition duration-200"
                      >
                        Upload
                      </button>
                
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                
                      {/* Delete Button */}
                      {profileImage && (
                        <button
                          onClick={handleRemoveImage}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1.5 px-3 rounded-md shadow-sm transition duration-200"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full">
                <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full p-2 border ${isEditing ? "border-blue-300" : "border-gray-300"
                      } rounded-md`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly // Prevent editing
                    className={`w-full p-2 border ${isEditing ? "border-black cursor-not-allowed" : "border-gray-300 "
                      } rounded-md `}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full p-2 border ${isEditing ? "border-blue-300" : "border-gray-300"
                      } rounded-md`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full p-2 border ${isEditing ? "border-blue-300" : "border-gray-300"
                      } rounded-md`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full p-2 border ${isEditing ? "border-blue-300" : "border-gray-300"
                      } rounded-md`}
                  />
                </div>
                {isEditing ? (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving} // Disable the button during saving
                      className={`py-2 px-4 w-full rounded-3xl ${isSaving ? "bg-gray-500 text-gray-300" : "bg-blue-500 text-white"
                        }`}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>

                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-600 py-2 px-4 w-full rounded-3xl"
                      disabled={isSaving} // Disable cancel button during saving
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white py-2 px-4 w-full rounded-3xl"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>



          {/*Image perview section*/}

          {isPreviewOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="relative bg-white rounded-lg shadow-lg flex overflow-hidden w-3/4 max-w-3xl h-96">
                {/* Image Section */}
                <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                  <NextImage
                    src={profileImage}
                    alt="Profile Preview"
                    width={300}
                    height={300}
                    className="object-contain rounded-l-lg"
                  />
                </div>

                {/* User Info Section */}
                <div className="w-1/2 p-6 flex flex-col justify-center space-y-4">
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                    onClick={closePreview}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">
                    {session?.user?.userData?.fullName || "User Name"}
                  </h2>
                  <p className="text-md text-gray-600">
                    {session?.user?.userData?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>
          )}

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
