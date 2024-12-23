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
import {
  addAttachments,
  deleteAttachment,
  getTasks,
  updateTask,
} from "@/lib/Features/TaskSlice";
import { useToast } from "../CustomToast/Toast";
import { useSession } from "next-auth/react";

function FieldNoteModalCardsModal({ onClose, note, token }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  // State Management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [localNote, setLocalNote] = useState(note);
  const [originalNote, setOriginalNote] = useState({ ...note });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachments, setAttachments] = useState(note.attachments || []);

  // Image Control States
  const [zoomLevel1, setZoomLevel1] = useState(1);
  const [dragging1, setDragging1] = useState(false);
  const [position1, setPosition1] = useState({ x: 0, y: 0 });
  const [startPosition1, setStartPosition1] = useState({ x: 0, y: 0 });
  const [zoomLevel2, setZoomLevel2] = useState(1);
  const [dragging2, setDragging2] = useState(false);
  const [position2, setPosition2] = useState({ x: 0, y: 0 });
  const [startPosition2, setStartPosition2] = useState({ x: 0, y: 0 });

  const userStatus = useSelector((state) => state.UserSlice.status);
  const users = useSelector((state) => state.UserSlice.users);
  const { data: session } = useSession();
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    if (session) {
      setAuthenticatedUser(session?.user?.userData);
    }
  }, [session]);

  useEffect(() => {
    if (authenticatedUser?.id) {
      dispatch(getTasks(authenticatedUser.id));
    }
  }, [dispatch, authenticatedUser?.id, localNote.attachments]);

  // Fetch users if needed
  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers(token));
    }
  }, [userStatus, dispatch, token]);

  // Update local note when prop changes
  useEffect(() => {
    setLocalNote(note);
    setOriginalNote({ ...note });
  }, [note]);

  // Utility Functions
  const updateField = (field, value) => {
    setLocalNote((prev) => ({ ...prev, [field]: value }));
  };

  const hasFieldChanged = (field) => {
    return (
      JSON.stringify(originalNote[field]) !== JSON.stringify(localNote[field])
    );
  };

  const getChangedFields = () => {
    const changes = [];
    const fieldsToCheck = {
      status: "Status",
      priority: "Priority",
      assignee: "Assignee",
      dueDate: "Due date",
      description: "Description",
      tags: "Tags",
      watchers: "Watchers",
    };

    for (const [field, label] of Object.entries(fieldsToCheck)) {
      if (hasFieldChanged(field)) {
        changes.push({
          field,
          label,
          oldValue: originalNote[field],
          newValue: localNote[field],
        });
      }
    }

    return changes;
  };

  
  const handleSave = async () => {
    // Validate required fields
    if (!localNote.description || !localNote.room || !localNote.floor) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    // Check if anything has changed
    const changedFields = getChangedFields();
    if (changedFields.length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    console.log("LC" ,localNote);
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

    try {
      await dispatch(
        updateTask({ taskId: localNote._id, updateData })
      ).unwrap();

      // Show single success message if multiple fields changed
      if (changedFields.length > 1) {
        showToast("Task updated successfully", "success");
      } else {
        // Show specific message for single field change
        const { field, label, newValue } = changedFields[0];
        switch (field) {
          case "status":
            showToast(`Status updated to ${newValue}`, "success");
            break;
          case "priority":
            showToast(`Priority changed to ${newValue}`, "info");
            break;
          case "assignee":
            showToast(`Task assigned to ${newValue}`, "info");
            break;
          case "dueDate":
            showToast(
              `Due date updated to ${new Date(newValue).toLocaleDateString()}`,
              "info"
            );
            break;
          default:
            showToast(`${label} has been updated`, "info");
        }
      }

      setIsEditing(false);
      setOriginalNote({ ...localNote });
    } catch (error) {
      console.error("Failed to update task:", error);
      showToast(
        error.message || "Failed to update RFI. Please try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setLocalNote({ ...originalNote });
    }
    setIsEditing(!isEditing);
  };

  // File Handling Functions
  const handleFileChange = async (e) => {
    if (!isEditing) return;

    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    setIsUploadingFiles(true);
    setUploadProgress(0);

    try {
      // Optimistically update UI
      const optimisticAttachments = newFiles.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        temporary: true,
      }));

      setLocalNote((prevNote) => ({
        ...prevNote,
        attachments: [...prevNote.attachments, ...optimisticAttachments],
      }));

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await dispatch(
        addAttachments({ taskId: localNote._id, files: newFiles })
      ).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update with actual server response
      setLocalNote((prevNote) => ({
        ...prevNote,
        attachments: [
          ...prevNote.attachments.filter((a) => !a.temporary),
          ...result.data.attachments,
        ],
      }));

      showToast("Files uploaded successfully", "success");
    } catch (error) {
      console.error("Error adding attachments:", error);
      // Revert optimistic update
      setLocalNote((prevNote) => ({
        ...prevNote,
        attachments: prevNote.attachments.filter((a) => !a.temporary),
      }));
      showToast("Failed to upload files", "error");
    } finally {
      setIsUploadingFiles(false);
      setUploadProgress(0);
    }
  };

//   const handleFileRemove = async (index) => {
//     if (!isEditing) return;

//     try {
//         const attachmentToDelete = localNote.attachments[index];
//         console.log("Attachment to delete:", attachmentToDelete); // Debug: Check attachment details
//         console.log("Attachment ID:", attachmentToDelete?._id); // Debug: Ensure attachment has an ID
//         console.log("TaskID:", localNote._id); // Debug: Check Task ID

//         if (!attachmentToDelete || !attachmentToDelete._id) {
//             throw new Error("Attachment ID not found.");
//         }

//         // Optimistically update UI
//         const updatedAttachments = localNote.attachments.filter((_, i) => i !== index);
//         setLocalNote((prev) => ({
//             ...prev,
//             attachments: updatedAttachments,
//         }));
//         console.log("Updated attachments after delete:", updatedAttachments); // Debug: Check updated UI state

//         // Direct API call to delete from backend
//         const response = await fetch(`/api/New/DeleteAttachment/${localNote._id}/${attachmentToDelete._id}`, {
//             method: 'DELETE',
//         });

//         const result = await response.json();
//         if (response.ok) {
//             console.log("Response from deleteAttachment API:", result); // Debug: Check API response
//             showToast("Attachment deleted successfully", "success");
//         } else {
//             throw new Error(result.error || "Failed to delete attachment");
//         }
//     } catch (error) {
//         console.error("Error in handleFileRemove:", error.message || error); // Debug: Log any error encountered
//         // Revert optimistic update on error
//         setLocalNote((prev) => ({
//             ...prev,
//             attachments: originalNote.attachments,
//         }));
//         showToast(error.message || "Failed to delete attachment", "error");
//     }
// };

const handleFileRemove = async (index) => {
  if (!isEditing) return;

  try {
      const attachmentToDelete = localNote.attachments[index];
      
      // Optimistically update UI
      const updatedAttachments = localNote.attachments.filter((_, i) => i !== index);
      setLocalNote(prev => ({
          ...prev,
          attachments: updatedAttachments
      }));

      // Call Redux action to delete from backend
      await dispatch(deleteAttachment({
          taskId: localNote._id,
          attachmentId: attachmentToDelete._id
      })).unwrap();

      showToast("Attachment deleted successfully", "success");
  } catch (error) {
      // Revert optimistic update on error
      setLocalNote(prev => ({
          ...prev,
          attachments: originalNote.attachments
      }));
      showToast(error.message || "Failed to delete attachment", "error");
  }
};

  const handleFileDownload = async (url) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = url.split("/").pop();
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
      showToast("Failed to download file", "error");
    }
  };

  // Image Control Functions
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

  // Zoom Functions
  const zoomIn1 = () => setZoomLevel1((prev) => Math.min(prev + 0.1, 8));
  const zoomOut1 = () => setZoomLevel1((prev) => Math.max(prev - 0.1, 1));
  const zoomIn2 = () => setZoomLevel2((prev) => Math.min(prev + 0.1, 8));
  const zoomOut2 = () => setZoomLevel2((prev) => Math.max(prev - 0.1, 1));

  // Mouse Control Functions
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

  const handleMouseUp1 = () => setDragging1(false);

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

  const handleMouseUp2 = () => setDragging2(false);

  // Utility Functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  const getFileIcon = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "csv":
        return "📈";
      case "txt":
        return "📃";
      default:
        return "📄";
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white border-b-2 flex flex-col sm:flex-row sticky top-0 z-10 justify-between px-4 py-2 items-center w-full">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between w-full sm:w-auto">
          <h1 className="text-sm sm:text-base md:text-lg">
            {localNote.username}
          </h1>
          <p className="text-xs sm:text-sm md:text-base sm:ml-2">
            | Room: {localNote.room} |{" "}
            <span>Created At: {formatDate(localNote.createdAt)}</span>
          </p>
        </div>
        {/* <div className="flex items-center gap-x-2 gap-y-1 mt-2 sm:mt-0">
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
        </div> */}
                  <button
            className="hover:bg-gray-200 p-2 rounded-md"
            onClick={onClose}
          >
            <VscClose size={20} />
          </button>
      </div>

      {/* Main Content */}
      <div className="w-full p-4">
        <div className="grid sm:grid-cols-5 gap-4 justify-center">
          {/* Left Section */}
          <div className="col-span-3 p-2 space-y-4">
            <GroundFloorImageSection
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
             
              taskId={localNote._id}
              editmode={isEditing}
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
            <LastFloorImageSection
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
              taskId={localNote._id}
              editmode={isEditing}
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
                  {localNote.assignee || "Not assigned"}
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

            {/* Email Alerts & Watchers */}
            <div>
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
            <div>
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
                    placeholder="Add tags separated by commas"
                  />
                ) : (
                  <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                    {localNote.tags.join(", ") || "No tags"}
                  </p>
                )}
              </div>
            </div>

            {/* Due Date */}
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
                  <div className="text-center">
                    <AiOutlinePlus className="mx-auto text-2xl text-gray-600" />
                    <p className="mt-2 text-gray-600">
                      No attachments added yet.
                    </p>
                    {isEditing && !isUploadingFiles && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add Attachment
                      </button>
                    )}
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
                          {file.temporary && (
                            <span className="ml-2 text-blue-500">
                              (Uploading...)
                            </span>
                          )}
                        </span>
                        {!file.temporary && (
                          <>
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
                          </>
                        )}
                      </div>
                    ))}
                    {isEditing && !isUploadingFiles && (
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                        }}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add More Attachments
                      </button>
                    )}
                    {isUploadingFiles && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-center mt-2 text-sm text-gray-600">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
              />
            </div>

            {/* Modified Footer Actions */}
            <div className="p-4 flex justify-end gap-x-2 border-t">
              <button
                className={`px-4 py-2 rounded transition-colors ${
                  isEditing
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white relative ${
                  isSaving ? "opacity-75 cursor-not-allowed" : ""
                }`}
                onClick={isEditing ? handleSave : toggleEditMode}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </div>
                ) : isEditing ? (
                  "Save "
                ) : (
                  "Edit"
                )}
              </button>
              {isEditing && !isSaving && (
                <button
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                  onClick={toggleEditMode}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldNoteModalCardsModal;
