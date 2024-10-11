"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaHandLizard, FaDownload } from "react-icons/fa";
import { ImBold } from "react-icons/im";
import { TbWorld, TbCapture } from "react-icons/tb";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { SiSquare } from "react-icons/si";
import { VscClose } from "react-icons/vsc";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/lib/Features/UserSlice";
import {
  GroundFloorImageSection,
  LastFloorImageSection,
} from "../HOC/FieldNotesComps/FieldNotesComp";
import { addAttachments, updateTask } from "@/lib/Features/TaskSlice";

function FieldNoteModalCardsModal({ onClose, note, token }) {
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
  const [groundFloorImages, setGroundFloorImages] = useState(localNote.groundFloorImages);
  const [lastFloorImage, setLastFloorImage] = useState(localNote.lastFloorImages[0]);

  const userStatus = useSelector((state) => state.UserSlice.status);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers(token));
    }
  }, [userStatus, dispatch, token]);

  const users = useSelector((state) => state.UserSlice.users);

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const updateField = (field, value) => {
    setLocalNote((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updateData = {
      userId: localNote.userId,
      username: localNote.username,
      description: localNote.description,
      priority: localNote.priority,
      room: localNote.room,
      floor: localNote.floor,
      status: localNote.status,
      tags: localNote.tags,
      assignee: localNote.assignee,
      dueDate: localNote.dueDate,
      emailAlerts: localNote.emailAlerts,
      watchers: localNote.watchers,
      groundFloorImages: localNote.groundFloorImages,
      lastFloorImages: localNote.lastFloorImages,
      attachments: localNote.attachments,
    };

    dispatch(updateTask({ taskId: localNote._id, updateData }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        // Optionally, you can show a success message here
      })
      .catch((error) => {
        console.error("Failed to update task:", error);
        // Optionally, you can show an error message here
      });
  };

 

  

  const handleFileRemove = (index) => {
    const updatedAttachments = localNote.attachments.filter(
      (_, i) => i !== index
    );
    updateField("attachments", updatedAttachments);
  };

  const zoomIn1 = () => {
    setZoomLevel1((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 8));
  };

  const zoomOut1 = () => {
    setZoomLevel1((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 1));
  };

  const zoomIn2 = () => {
    setZoomLevel2((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 8));
  };

  const zoomOut2 = () => {
    setZoomLevel2((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 1));
  };

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    dispatch(addAttachments({ taskId: localNote._id, files: newFiles }))
      .unwrap()
      .then((result) => {
        setLocalNote(prevNote => ({
          ...prevNote,
          attachments: [...prevNote.attachments, ...result.data.attachments]
        }));
      })
      .catch((error) => {
        console.error('Error adding attachments:', error);
        // Handle error (e.g., show an error message to the user)
      });
  };

  const handleAddAttachment = () => {
    fileInputRef.current.click();
  };

 

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % localNote.groundFloorImages.length
    );
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + localNote.groundFloorImages.length) %
        localNote.groundFloorImages.length
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
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

 const handleFileDownload = async (url) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; 
      link.download = url.split('/').pop(); 
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };


 
  const getFileIcon = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'csv':
        return '📈';
      case 'txt':
        return '📃';
      default:
        return '📄';
    }
  };




  return (
    <div>
      <div className="bg-white border-b-2 flex flex-col sm:flex-row sticky top-0 z-10 justify-between px-4 py-2 items-center w-full">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between w-full sm:w-auto">
          <h1 className="text-sm sm:text-base md:text-lg">
            {localNote.username}
          </h1>
          <p className="text-xs sm:text-sm md:text-base sm:ml-2">
            | Room: {localNote.room} |{" "}
            <span> Created At: {formatDate(localNote.createdAt)}</span>
          </p>
        </div>
        <div className="flex items-center gap-x-2 gap-y-1 mt-2 sm:mt-0">
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

            <GroundFloorImageSection
              //images={localNote.groundFloorImages}
              currentIndex={currentIndex}
              zoomLevel={zoomLevel1}
              position={position1}
              onZoomIn={zoomIn1}
              onZoomOut={zoomOut1}
              onMouseMove={handleMouseMove1}
              onMouseDown={handleMouseDown1}
              onMouseUp={handleMouseUp1}
              onMouseLeave={handleMouseUp1}
              dragging={dragging1}
              onPrevious={handlePrevious}
              onNext={handleNext}
              images={localNote.groundFloorImages}
              updateImage={(newUrl, index) => {
                const newImages = [...localNote.groundFloorImages];
                newImages[index] = { ...newImages[index], url: newUrl };
                setLocalNote(prev => ({ ...prev, groundFloorImages: newImages }));
              }}
              taskId={localNote._id}


            />

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


           
          </div>

          {/* Right Section */}
          <div className="col-span-2 p-2 space-y-4">
            {/* Image Card */}

            <LastFloorImageSection
              //image={localNote.lastFloorImages[0]}
              zoomLevel={zoomLevel2}
              position={position2}
              onZoomIn={zoomIn2}
              onZoomOut={zoomOut2}
              onMouseMove={handleMouseMove2}
              onMouseDown={handleMouseDown2}
              onMouseUp={handleMouseUp2}
              onMouseLeave={handleMouseUp2}
              dragging={dragging2}
              image={localNote.lastFloorImages[0]}
  updateImage={(newUrl) => {
    const newImages = [{ ...localNote.lastFloorImages[0], url: newUrl }];
    setLocalNote(prev => ({ ...prev, lastFloorImages: newImages }));
  }}
  taskId={localNote._id}
            />

            {/* Priority Section */}
            <div>
              <label className="block text-gray-600">Priority</label>
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
                  {localNote.assignee}
                </p>
              )}
            </div>
             {/* Status Section */}
             <div>
              <label className="block text-gray-600">Status</label>
              {isEditing ? (
                <select
                className="w-full p-2 border border-gray-300 rounded outline-none"
                value={localNote.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              ) : (
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                  {localNote.status}
                </p>
              )}
            </div>
            {/* Email Alerts */}
            <div className="mb-6">
              <label className="block text-gray-600">Email alerts</label>
              <div className="flex items-center mt-1">
                {isEditing ? (
                  <select
                    className="w-full p-2 border border-gray-300 rounded outline-none"
                    value={localNote.watchers.length}
                    onChange={(e) =>
                      updateField(
                        "watchers",
                        new Array(parseInt(e.target.value)).fill("")
                      )
                    }
                  >
                    <option value="0">0 watchers</option>
                    <option value="1">1 watcher</option>
                    <option value="2">2 watchers</option>
                    <option value="3">3 watchers</option>
                  </select>
                ) : (
                  <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                    {localNote.watchers.length} watcher
                    {localNote.watchers.length !== 1 ? "s" : ""}
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
              <button
                onClick={handleAddAttachment}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Attachment
              </button>
            </div>
          ) : (
            <div>
              {localNote.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mt-2 p-2 border border-gray-300 rounded"
                >
                  <span className="text-gray-700">
                    {getFileIcon(file.url)} {`Attachment ${index + 1}`}
                  </span>
                  <button
                    onClick={() => handleFileDownload(file.url)}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    <FaDownload />
                  </button>
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
              <button
                onClick={handleAddAttachment}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add More Attachments
              </button>
            </div>
          )}
              </div>
              <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />
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
}

export default FieldNoteModalCardsModal;







//                    onClick={() => handleFileDownload(file.url, `attachment_${index + 1}`)}
// const handleFileDownload = async (url, fileName) => {
//   try {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     const downloadUrl = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = downloadUrl;
//     link.download = fileName || 'download';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   } catch (error) {
//     console.error('Download failed:', error);
//     // Handle error (e.g., show an error message to the user)
//   }
// };