import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IoMdClose } from "react-icons/io";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const VideoUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Clean up the previous preview URL when selectedFile changes
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      // Clean up function
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [selectedFile]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "video/mp4": [],
        "video/quicktime": [],
        "video/x-matroska": [],
        "video/webm": [],
      },
      multiple: false,
      maxFiles: 1,
    });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    // Create a storage reference
    const timestamp = Date.now();
    const storageRef = ref(
      storage,
      `360-videos/${selectedFile.name}-${timestamp}`
    );

    // Create upload task
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    // Monitor upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      async () => {
        // Upload completed successfully
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Video uploaded successfully. URL:", downloadURL);
        setUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(downloadURL);
        }
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border mb-6">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-xl font-semibold">Upload 360° Video</h2>
        <button
          className={`relative w-24 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
            uploading ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={!selectedFile || uploading}
          onClick={handleUpload}
        >
          {uploading ? (
            <>
              <div
                className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
              <span className="relative z-10">
                {Math.round(uploadProgress)}%
              </span>
            </>
          ) : (
            "Upload"
          )}
        </button>
      </div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${fileRejections.length > 0 ? "border-red-500 bg-red-50" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <>
            <p className="text-blue-500">Drop the video here...</p>
            <p className="text-sm text-gray-400 mt-2">
              Supported formats: MP4, MOV, MKV, WebM
            </p>
          </>
        ) : (
          <div>
            <p className="text-gray-500">
              Drag and drop a video here, or click to select
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Supported formats: MP4, MOV, MKV, WebM
            </p>
          </div>
        )}
      </div>

      {fileRejections.length > 0 && (
        <p className="text-red-500 text-sm mb-4">
          Please select a valid video file
        </p>
      )}

      {selectedFile && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Selected Video:</h3>
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex justify-between items-center">
              <p className="text-sm">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedFile}
                onClick={() => setSelectedFile(null)}
              >
                <IoMdClose />
              </button>
            </div>
            <video
              className="mt-2 max-w-full h-auto rounded"
              controls
              key={previewUrl}
            >
              <source src={previewUrl} type={selectedFile.type} />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {uploading && (
        <div className="w-full h-2 bg-gray-200 rounded mt-2">
          <div
            className="h-full bg-blue-500 rounded"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
