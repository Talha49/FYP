"use client";
import VideoUpload from "../_components/VideoUpload";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/firebaseConfig";
import Dialog from "../_components/Dialog";
import { fetchVirtualTours } from "@/lib/Features/VtourSlice";
import { CgSpinnerTwo } from "react-icons/cg";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [newVtourData, setNewVtourData] = useState({
    name: "",
    description: "",
    videoUrl: "",
    frames: [],
    inspectionId: id,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [creatingVT, setCreatingVT] = useState(false);
  const dispatch = useDispatch();
  const { virtualTours, loading, error } = useSelector((state) => state.VTour);

  useEffect(() => {
    if (id) {
      dispatch(fetchVirtualTours(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    setNewVtourData((prev) => {
      return {
        ...prev,
        videoUrl: videoUrl || prev.videoUrl,
      };
    });
  }, [videoUrl]);

  const validateForm = () => {
    let errors = {};
    if (step === 1 && !newVtourData.name.trim())
      errors.name = "Name is required.";
    if (step === 1 && !newVtourData.description.trim())
      errors.description = "Description is required.";
    if (step === 2 && !newVtourData.videoUrl.trim())
      errors.videoUrl = "Please upload 360 video first.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (validateForm()) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewVtourData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error when user types
  };

  const categories = ["All", "Today", "This Week", "This Month", "This Year"];

  // Filter tours based on search query and selected category
  let filteredTours = virtualTours.filter(
    (tour) =>
      (selectedCategory === "All" || tour.category === selectedCategory) &&
      tour.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createVirtualTour = async () => {
    try {
      setCreatingVT(true);
      const response = await fetch("/api/v-tour/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVtourData),
      });
      if (!response.ok) {
        throw new Error("Failed to create virtual tour");
      }
      const data = await response.json();
      setVirtualTours((prevTours) => [...prevTours, data.virtualTour]);
      return data.virtualTour;
    } catch (error) {
      console.error("Error creating virtual tour:", error);
      throw error;
    } finally {
      setCreatingVT(false);
    }
  };

  const processVideoFrames = async () => {
    setIsProcessing(true);
    try {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = videoUrl;

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const fps = 0.5; // capture 1 frame per 2 seconds
      const duration = video.duration;
      const totalFrames = Math.floor(duration * fps);
      const frameData = [];

      await video.play();

      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = i / fps;

        await new Promise((resolve) => {
          video.onseeked = resolve;
        });

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.95)
          );

          // Upload frame to Firebase Storage
          const timestamp = Date.now();
          const fileName = `frame_${timestamp}_${i}.jpg`;
          const storageRef = ref(storage, `tours/${id}/frames/${fileName}`);
          await uploadBytes(storageRef, blob);

          // Get the actual Firebase Storage URL
          const frameUrl = await getDownloadURL(storageRef);

          // Compute center point (Example Calculation)
          const center = computeFrameCenter(i, totalFrames);

          frameData.push({
            url: frameUrl, // Now dynamically retrieved from Firebase
            center: center,
          });

          setProcessingProgress(Math.round(((i + 1) * 100) / totalFrames));
        } catch (error) {
          console.error("Error processing frame:", error);
          throw error;
        }
      }

      setNewVtourData((prev) => ({
        ...prev,
        frames: frameData,
      }));
      setIsProcessing(false);
      const virtualTour = await createVirtualTour();
      if (virtualTour?._id) {
        alert("Virtual Tour created successfully!");
        filteredTours = filteredTours.push(virtualTour);
        setNewVtourData({
          name: "",
          description: "",
          videoUrl: "",
          frames: [],
          inspectionId: id,
        });
        setIsDialogOpen(false);
        setFormErrors({});
        setStep(1);
        setVideoUrl(null);
      } else {
        alert("Failed to create virtual tour. Please try again later.");
      }
    } catch (error) {
      console.error("Error processing video:", error);
      throw error;
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setCreatingVT(false);
    }
  };

  // Function to compute the center point for each frame
  const computeFrameCenter = (index, totalFrames) => {
    // Example: Simple spherical distribution (customize as needed)
    const theta = (index / totalFrames) * Math.PI * 2; // Rotation around Y-axis
    return {
      x: Math.cos(theta),
      y: 0,
      z: Math.sin(theta),
    };
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold mb-6 text-center text-gray-800">
        Virtual Tours
      </h1>
      <Link href={"/VirtualTourNew"} className="flex items-center gap-1 my-4 text-sm border border-blue-500 bg-blue-50 text-blue-500 w-fit p-1 rounded">
      <ArrowLeft size={17} className="text-blue-500" /> <span>Back</span>
      </Link>
      {/* Search & Filter Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search tours..."
          className="w-full sm:w-2/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="p-3 sm:w-1/3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-500 sm:w-1/5 w-full text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-all"
        >
          Add Tour
        </button>
      </div>
      {loading && (
        <div className="text-lg w-full flex items-center justify-center h-32 gap-2">
          <CgSpinnerTwo className="text-xl animate-spin" />
          Fetching Virtual Tours...
        </div>
      )}

      {error && (
        <div className="text-red-500 text-lg">
          {error?.message || "Something went wrong"}
        </div>
      )}

      {!loading && !error && (!virtualTours || filteredTours.length === 0) && (
        <p className="text-center text-gray-500 text-lg">No tours found.</p>
      )}

      {/* Virtual Tour Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          filteredTours.length > 0 &&
          filteredTours.map((tour) => (
            <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl">
              {/* Image container with overlay effect */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={tour?.frames[0]?.url}
                  alt={tour?.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Content section */}
              <div className="relative p-6 space-y-4">
                {/* Title with animated underline */}
                <h2 className="text-2xl font-bold text-gray-800">
                  <span className="relative inline-block">
                    {tour?.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                  </span>
                </h2>

                {/* Description with line clamp */}
                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {tour?.description}
                </p>

                {/* Button with hover effect */}
                <div className="pt-2">
                  <button className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 active:bg-blue-700 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:shadow-inner active:translate-y-0">
                    Explore Now
                  </button>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rotate-45 bg-blue-500/10" />
              </div>
            </div>
          ))}
      </div>
      <Dialog
        title="Add Tour"
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setFormErrors({});
          setStep(1);
          setVideoUrl(null);
          setNewVtourData({
            name: "",
            description: "",
            videoUrl: "",
            frames: [],
            inspectionId: id,
          });
        }}
        className={"max-w-3xl max-h-96"}
      >
        <header className="grid grid-cols-3 gap-2 my-3 bg-neutral-100 font-semibold rounded-t-xl border">
          <span
            className={`${
              step === 1 ? "border-blue-500" : "border-b-transparent"
            } border-b-4 p-3 text-center`}
            onClick={() => {
              if (step === 1) {
                nextStep();
              } else {
                prevStep();
              }
            }}
          >
            Basic Info
          </span>
          <span
            className={`${
              step === 2 ? "border-blue-500" : "border-b-transparent"
            } border-b-4 p-3 text-center`}
          >
            Upload 360 Video
          </span>
          <span
            className={`${
              step === 3 ? "border-blue-500" : "border-b-transparent"
            } border-b-4 p-3 text-center `}
          >
            Convert To Virtual Tour
          </span>
        </header>
        {/* Step 1 */}
        {step === 1 && (
          <form className="space-y-4">
            {/* Title Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-gray-700 font-medium">
                Title
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Write title"
                value={newVtourData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  formErrors.name
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm">{formErrors.name}</p>
              )}
            </div>

            {/* Description Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-gray-700 font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Write description"
                value={newVtourData.description}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg shadow-sm resize-none h-28 focus:outline-none focus:ring-2 ${
                  formErrors.description
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              ></textarea>
              {formErrors.description && (
                <p className="text-red-500 text-sm">{formErrors.description}</p>
              )}
            </div>

            {/* Error Message from Redux */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        )}
        {/* 2nd Step */}
        {step === 2 && (
          <>
            <VideoUpload onUploadSuccess={setVideoUrl} />
            {formErrors.videoUrl && (
              <p className="text-red-500 text-sm">{formErrors.videoUrl}</p>
            )}
          </>
        )}
        {/* 3rd Step */}
        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-center text-lg">
              Ready to convert to Virtual Tour!
            </h1>
            {isProcessing && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Doing pre-processing: {processingProgress}%
                </p>
              </div>
            )}
            {creatingVT && (
              <p className="text-center text-sm text-gray-600">
                Please wait for a while
              </p>
            )}
          </div>
        )}
        <footer className="flex items-center justify-between py-2 mt-2">
          <button
            onClick={() => prevStep()}
            className="px-4 py-2 bg-blue-100 text-blue-600 disabled:bg-neutral-300 disabled:text-neutral-800 disabled:cursor-not-allowed font-semibold rounded-lg hover:bg-blue-200 transition"
            disabled={step === 1}
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (step < 3) {
                nextStep();
              } else {
                processVideoFrames();
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            {step === 3
              ? isProcessing
                ? "Processing..."
                : "Convert to Virtual Tour"
              : "Next"}
          </button>
        </footer>
      </Dialog>
    </div>
  );
};

export default Page;
