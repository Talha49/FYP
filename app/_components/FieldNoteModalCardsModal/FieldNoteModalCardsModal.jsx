"use client";
import React, { useState, useEffect } from "react";
import { FaHandLizard, FaFileUpload, FaDownload } from "react-icons/fa";
import { ImBold } from "react-icons/im";
import { TbWorld, TbCapture } from "react-icons/tb";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { SiSquare } from "react-icons/si";
import { VscClose } from "react-icons/vsc";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { updateFieldNote } from "@/lib/Features/FieldNoteSlice";
import { fetchUsers } from "@/lib/Features/UserSlice";

function FieldNoteModalCardsModal({ onClose, note,token }){

  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [zoomLevel1, setZoomLevel1] = useState(1);
  const [dragging1, setDragging1] = useState(false);
  const [position1, setPosition1] = useState({ x: 0, y: 0 });
  const [startPosition1, setStartPosition1] = useState({ x: 0, y: 0 });
  const [zoomLevel2, setZoomLevel2] = useState(1);
  const [dragging2, setDragging2] = useState(false);
  const [position2, setPosition2] = useState({ x: 0, y: 0 });
  const [startPosition2, setStartPosition2] = useState({ x: 0, y: 0 });
  const [localNote, setLocalNote] = useState(note);

  const userStatus = useSelector((state) => state.UserSlice.status);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers(token));
    }
  }, [userStatus, dispatch]);

  const users = useSelector((state) => state.UserSlice.users);

  

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const updateField = (field, value) => {
    setLocalNote((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    dispatch(updateFieldNote(localNote));
    setIsEditing(false);
  };

  const handleFileDownload = async (file) => {
    try {
      // Check if the file URL is valid
      if (!file.url) {
        throw new Error("File URL is not available");
      }

      // Fetch the file from the URL
      const response = await fetch(localNote.attachments.url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name || "download"; // Use the file name if available, otherwise a default name

      // Trigger the download
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the file. Please try again later.");
    }
  };

  const zoomIn1 = () => {
    setZoomLevel1((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 2)); // Max zoom level of 2x
  };

  const zoomOut1 = () => {
    setZoomLevel1((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 1)); // Min zoom level of 1x (original size)
  };

  const zoomIn2 = () => {
    setZoomLevel2((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 2)); // Max zoom level of 2x
  };

  const zoomOut2 = () => {
    setZoomLevel2((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 1)); // Min zoom level of 1x (original size)
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newAttachments = newFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    updateField("attachments", [...localNote.attachments, ...newAttachments]);
  };

  const handleFileRemove = (index) => {
    const updatedAttachments = localNote.attachments.filter(
      (_, i) => i !== index
    );
    updateField("attachments", updatedAttachments);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleMouseDown1 = (e) => {
    setDragging1(true);
    setStartPosition1({
      x: e.clientX - position1.x,
      y: e.clientY - position1.y,
    });
  };

  const handleMouseMove1 = (e) => {
    if (dragging1) {
      setPosition1({
        x: e.clientX - startPosition1.x,
        y: e.clientY - startPosition1.y,
      });
    }
  };

  const handleMouseUp1 = () => {
    setDragging1(false);
  };

  const handleMouseDown2 = (e) => {
    setDragging2(true);
    setStartPosition2({
      x: e.clientX - position2.x,
      y: e.clientY - position2.y,
    });
  };

  const handleMouseMove2 = (e) => {
    if (dragging2) {
      setPosition2({
        x: e.clientX - startPosition2.x,
        y: e.clientY - startPosition2.y,
      });
    }
  };

  const handleMouseUp2 = () => {
    setDragging2(false);
  };

  const formatDate = (dateString) => {
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${parseInt(month)}-${parseInt(day)}`;
  };

  const images = ["/floor.jpg", "/floor2.jpg", "/floor.jpg"];
  const images2 = ["/floor.jpg", "/floor2.jpg", "/floor.jpg"];

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <div className="bg-white border-b-2 flex flex-col sm:flex-row sticky top-0 z-10 justify-between px-4 py-2 items-center w-full">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between w-full sm:w-auto">
          <h1 className="text-sm sm:text-base md:text-lg">{note.name}</h1>
          <p className="text-xs sm:text-sm md:text-base sm:ml-2">
            {note.room} | <span>{formatDate(note.createdAt)}</span>
          </p>
        </div>
        <div className="flex  items-center gap-x-2 gap-y-1 mt-2 sm:mt-0">
          <button className="hover:bg-gray-200 p-2 rounded-md">
            <FaHandLizard size={15} />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-md">
            <ImBold size={15} />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-md">
            <TbCapture size={15} />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-md">
            <SiSquare size={15} />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-md">
            <TbWorld size={15} />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-md">
            <IoEllipsisHorizontalOutline size={15} />
          </button>
          <div className="bg-slate-300 h-6 w-[1px]"></div>
          <button
            className="hover:bg-gray-200 p-2 rounded-md"
            onClick={onClose}
          >
            <VscClose size={20} />
          </button>
        </div>
      </div>

      <div className="w-full p-4">
        <div className="grid sm:grid-cols-5 gap-4 justify-center">
          {/* Left Section */}
          <div className="col-span-3 p-2 space-y-4">
            {/* Image Pagination Card */}
            <div className="w-full border rounded-lg p-4 bg-white shadow-md">
              <div
                className="relative overflow-hidden"
                onMouseMove={handleMouseMove1}
                onMouseDown={handleMouseDown1}
                onMouseUp={handleMouseUp1}
                onMouseLeave={handleMouseUp1}
                style={{ cursor: dragging1 ? "grabbing" : "grab" }}
              >
                <img
                  src={images[currentIndex]}
                  alt="Image"
                  className="w-full h-52 object-fill mb-4"
                  style={{
                    transform: `scale(${zoomLevel1}) translate(${position1.x}px, ${position1.y}px)`,
                    transformOrigin: "center",
                    transition: dragging1 ? "none" : "transform 0.1s",
                  }}
                />
                <div className="absolute top-2 left-2 flex gap-x-8">
                  <div>
                    <button className="p-2 bg-gray-300 rounded text-[10px]">
                      Change photo
                    </button>
                    <button className="p-2 bg-gray-300 rounded text-[10px] ml-2">
                      Markup
                    </button>
                  </div>
                  <div>
                    <label className="relative inline-block h-6 w-12 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-blue-500">
                      <input
                        className="peer sr-only"
                        id="AcceptConditions"
                        type="checkbox"
                      />
                      <span className="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
                    </label>
                  </div>
                </div>
                <div className="absolute top-6 right-2 flex flex-col items-center">
                  <button onClick={zoomIn1} className="p-2 bg-gray-300">
                    <CiZoomIn />
                  </button>
                  <button onClick={zoomOut1} className="p-2 bg-gray-300">
                    <CiZoomOut />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button onClick={handlePrevious} className="text-blue-600">
                  Previous
                </button>
                <div className="flex space-x-2">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={`block w-2 h-2 rounded-full ${
                        index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    ></span>
                  ))}
                </div>
                <button onClick={handleNext} className="text-blue-600">
                  Next
                </button>
              </div>
            </div>
            {/* Description Input */}
            <div>
              <label className="block text-gray-600">Description</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded outline-none"
                  placeholder="Add a Description..."
                  value={localNote.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              ) : (
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                  {localNote.description}
                </p>
              )}
            </div>
            {/* Comment Input */}
            <div>
              <label className="block text-gray-600">Comment</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Add a Comment..."
                  value={localNote.comments[0]?.text || ""}
                  onChange={(e) =>
                    updateField("comments", [
                      { ...localNote.comments[0], text: e.target.value },
                    ])
                  }
                />
              ) : (
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                  {localNote.comments[0]?.text || "No comment"}
                </p>
              )}
            </div>

            {/* Activity */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Activity</h2>
              {localNote.comments.length > 0 ? (
                localNote.comments.map((comment, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p className="text-gray-500">No comments yet...</p>
                  {isEditing && (
                    <button className="text-blue-500 hover:text-blue-600 mt-2">
                      Start the conversation!
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="col-span-2 p-2 space-y-4">
            {/* Image Card */}
            <div className="w-full border rounded-lg pt-2 bg-white shadow-md">
              <h1>{note.floor}</h1>
              <div
                className="relative overflow-hidden"
                onMouseMove={handleMouseMove2}
                onMouseDown={handleMouseDown2}
                onMouseUp={handleMouseUp2}
                onMouseLeave={handleMouseUp2}
                style={{ cursor: dragging2 ? "grabbing" : "grab" }}
              >
                <img
                  src={images2[0]}
                  alt="Image"
                  className="w-full h-52 object-fill mb-4"
                  style={{
                    transform: `scale(${zoomLevel2}) translate(${position2.x}px, ${position2.y}px)`,
                    transformOrigin: "center",
                    transition: dragging2 ? "none" : "transform 0.1s",
                  }}
                />
                <div className="absolute bottom-2 right-2 flex flex-col items-center">
                  <button onClick={zoomIn2} className="p-2 bg-gray-300 mb-2">
                    <CiZoomIn />
                  </button>
                  <button onClick={zoomOut2} className="p-2 bg-gray-300">
                    <CiZoomOut />
                  </button>
                </div>
              </div>
            </div>
            {/* Priority Section */}
            <div>
              <label className="block text-gray-600">Priorty</label>
              {isEditing ? (
                <select
                  className="w-full p-2 border border-gray-300 rounded outline-none"
                  value={localNote.priority}
                  onChange={(e) => updateField("priority", e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              ) : (
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                  {localNote.priority}
                </p>
              )}
            </div>
            {/* Assignee Section */}
            <div>
              <label className="block text-gray-600">Assignee</label>
              {isEditing ? (
                <select
                  className="w-full p-2 border border-gray-300 rounded outline-none"
                  value={localNote.assignee || ""}
                  onChange={(e) => updateField("assignee", e.target.value)}
                >
                  <option value="">Select Assignee</option>
                 
                  {users.map((user) => (
                    <option key={user._id} value={user.fullName}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                  {Array.isArray(localNote.assignee)
                    ? localNote.assignee.join(", ")
                    : localNote.assignee}
                </p>
              )}
            </div>
            {/* Email Alerts */}
            <div className="mb-6">
              <label className="block text-gray-600">Email alerts</label>
              <div className="flex items-center mt-1">
                {isEditing ? (
                  <select className="w-full p-2 border border-gray-300 rounded outline-none">
                    <option value="1 watcher">1 watcher</option>
                    <option value="2 watchers">2 watchers</option>
                    <option value="3 watchers">3 watchers</option>
                  </select>
                ) : (
                  <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                    {localNote.watchers} watcher
                    {localNote.watchers !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            {/* Tags */}
            <div className="mb-6">
              <label className="block text-gray-600">Tags</label>
              <div className="flex items-center mt-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={localNote.tags.join(", ")}
                    onChange={(e) =>
                      updateField(
                        "tags",
                        e.target.value.split(",").map((tag) => tag.trim())
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded outline-none"
                  />
                ) : (
                  <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                    {localNote.tags.join(", ")}
                  </p>
                )}
              </div>
            </div>
            {/* Calendar */}
            <div>
              <label className="block text-gray-600">Due date</label>
              {isEditing ? (
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={
                    new Date(localNote.dueDate).toISOString().split("T")[0]
                  }
                  onChange={(e) => updateField("dueDate", e.target.value)}
                />
              ) : (
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                  {new Date(localNote.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {/* Attachments */}
            <div>
              <label className="block text-gray-600">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-4 mt-1 overflow-auto h-40 custom-scrollbars">
                {localNote.attachments.length === 0 ? (
                  <div className="text-center ">
                    <AiOutlinePlus className="mx-auto text-2xl text-gray-600" />
                    <p className="mt-2 text-gray-600">
                      No attachments added yet.
                    </p>
                    {isEditing && (
                      <label className="mt-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer inline-block">
                        Browse files
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div>
                    {localNote.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center mt-2 p-2 border border-gray-300 rounded"
                      >
                        <span className="text-gray-700">{file.name}</span>
                        {!isEditing && (
                          <button
                            onClick={() => handleFileDownload(file)}
                            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                          >
                            <FaDownload />
                          </button>
                        )}
                        {isEditing && (
                          <button
                            onClick={() => handleFileRemove(index)}
                            className="ml-2 px-2 py-1 bg-red-600 text-white rounded"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <label className="mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer inline-block">
                        Add more files
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 flex justify-end gap-x-2">
        <button
          className={`px-4 py-2 ${
            isEditing ? "bg-blue-600" : "bg-blue-600"
          } text-white rounded`}
          onClick={isEditing ? handleSave : toggleEditMode}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        {isEditing && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={toggleEditMode}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default FieldNoteModalCardsModal;