"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import ImageUploadSection from "../_components/ImageUploadSection";
import { FormInput } from "../_components/FormInput";
import { FormSelect } from "../_components/FormSelect";
import { AttachmentSection } from "../_components/AttachmentSection";
import { createTask } from "@/lib/Features/TaskSlice";
import { useToast } from "@/app/_components/CustomToast/Toast";
import { usePathname, useRouter } from "next/navigation";

const TaskCreationForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.TaskSlice);
  const [authuserdata, setAuthuserData] = useState(null);
  const [formData, setFormData] = useState({
 
    description: "",
    priority: "",
    room: "",
    floor: "",
    status: "",
    tags: [],
    assignees: [], // Default value
    dueDate: "",
    emailAlerts: [],
    watchers: [],
  });

  const [groundFloorImages, setGroundFloorImages] = useState([]);
  const [lastFloorImage, setLastFloorImage] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const { showToast } = useToast();
  const { data: session } = useSession();
  const [menuPermissionsForPage, setMenuPermissions] = useState(null);
  const pathName = usePathname();

  console.log("Menu Permissions: ", menuPermissionsForPage)

  useEffect(() => {
    setAuthuserData(session?.user?.userData);
  }, [session]);

  useEffect(() => {
    if (authuserdata) {
      const menuPerm =
        authuserdata?.role?.permissions?.menuPermissions?.basicMenu?.find(
          (menu) => menu.path === pathName
        );
      setMenuPermissions(menuPerm?.permission || null);
    }
  }, [authuserdata, pathName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e, field) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const resetForm = () => {
    setFormData({
      description: "",
      priority: "",
      room: "",
      floor: "",
      status: "",
      tags: [],
      assignees: [], // Reset default value
      dueDate: "",
      emailAlerts: [],
      watchers: [],
    });
    setGroundFloorImages([]);
    setLastFloorImage([]);
    setAttachments([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!menuPermissionsForPage?.includes("create")) {
      showToast("You don't have permission to create task", "error");
      return;
    }
  
    if (!groundFloorImages.length || !lastFloorImage.length) {
      showToast("Please upload all required images", "warning");
      return;
    }
  
    // Convert files to base64
    const convertToBase64 = async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ base64: reader.result, name: file.name });
        reader.onerror = (error) => reject(error);
      });
    };
  
    // Convert images & attachments
    const groundFloorImageBase64 = await Promise.all(
      groundFloorImages.map((img) => convertToBase64(img.file))
    );
    const lastFloorImageBase64 = await Promise.all(
      lastFloorImage.map((img) => convertToBase64(img.file))
    );
    const attachmentsBase64 = await Promise.all(
      attachments.map((file) => convertToBase64(file))
    );
  
    // Construct JSON payload
    const taskData = {
      ...formData,
      assignedBy: authuserdata?._id || "",
      userId: authuserdata?._id || "",
      creatorId: authuserdata?._id || "",  // <-- Ensure creatorId is included
      username: authuserdata?.fullName || "",
      groundFloorImages: groundFloorImageBase64,
      lastFloorImages: lastFloorImageBase64,
      attachments: attachmentsBase64,
      dueDate: new Date(formData.dueDate).toISOString(),
    };
    
  
    try {
      await dispatch(createTask(taskData)).unwrap();
      showToast(
        "Task created successfully! Your request has been processed.",
        "success"
      );
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast(error.message || "Failed to create task. Please try again.", "error");
    }
  };
  

  const priorityOptions = [
    { value: "No data", label: "No data" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const statusOptions = [
    { value: "No data", label: "No data" },
    { value: "In Progress", label: "In Progress" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-8 bg-white shadow-2xl rounded-xl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">RFI Creation Form</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ImageUploadSection
          title="Site Inspection Photos"
          images={groundFloorImages}
          setImages={setGroundFloorImages}
          inputId="groundFloorImages"
        />
        <ImageUploadSection
          title="Floor Plans"
          images={lastFloorImage}
          setImages={setLastFloorImage}
          inputId="lastFloorImage"
          singleImage={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <FormInput
            label="User ID"
            id="userId"
            name="userId"
            value={authuserdata?._id || ""}
            disabled
          />
           <FormInput
            label="Creator ID"
            id="creatorId"
            name="creatorId"
            value={authuserdata?._id || ""}
            disabled
          />
          <FormInput
            label="Description"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            as="textarea"
            rows="3"
            disabled={!menuPermissionsForPage?.includes("create")}
          />
          <FormInput
            label="Room"
            id="room"
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            disabled={!menuPermissionsForPage?.includes("create")}
          />
          <FormInput
            label="Floor"
            id="floor"
            name="floor"
            value={formData.floor}
            onChange={handleInputChange}
            disabled={!menuPermissionsForPage?.includes("create")}
          />
        </div>

        <div className="space-y-4">
          <FormInput
            label="Full Name"
            id="username"
            name="username"
            value={authuserdata?.fullName || ""}
            disabled
          />

          <FormSelect
            label="Priority"
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            options={priorityOptions}
          />
          <FormSelect
            label="Status"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={statusOptions}
          />
          <FormInput
            label="Assignee"
            id="assignee"
            name="assignee"
            value={formData.assignees}
            readOnly
            style={{
              backgroundColor: "#f9f9f9",
              color: "#555",
              cursor: "not-allowed",
            }}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput
          label="Tags (comma-separated)"
          id="tags"
          name="tags"
          value={formData.tags.join(", ")}
          onChange={(e) => handleArrayInputChange(e, "tags")}
          disabled={!menuPermissionsForPage?.includes("create")}
        />
        <FormInput
          label="Due Date"
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleInputChange}
          disabled={!menuPermissionsForPage?.includes("create")}
        />
      </div>

      <AttachmentSection
        attachments={attachments}
        setAttachments={setAttachments}
      />

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors relative disabled:bg-opacity-70 disabled:cursor-not-allowed"
          disabled={
            loading || !(groundFloorImages.length && lastFloorImage.length)
          }
        >
          {loading ? (
            <>
              <span className="opacity-0">Submit Form</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              </span>
            </>
          ) : (
            "Submit Form"
          )}
        </button>
      </div>

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </form>
  );
};

export default TaskCreationForm;
