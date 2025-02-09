"use client";
import { useEffect, useState, useRef } from "react";
import * as PANOLENS from "panolens";
import { BarLoader, ClockLoader } from "react-spinners";
import axios from "axios";
import { MdOutlineDelete, MdModeEdit } from "react-icons/md";

function VirtualTourComponent() {
  const [loading, setLoading] = useState(false);
  const [framePoints, setFramePoints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [infospotFields, setInfospotFields] = useState({
    title: "",
    description: "",
  });
  const [infospots, setInfospots] = useState([]);
  const [currentPanoramaIndex, setCurrentPanoramaIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedInfospot, setSelectedInfospot] = useState({});
  const containerRef = useRef(null);
  const currentClickPositionRef = useRef(null);
  const currentPanoramaRef = useRef(null);
  let viewer;

  const getJsonData = async () => {
    try {
      const res = await axios.get("/frames/frame_points.json");
      setFramePoints(res.data);
    } catch (error) {
      alert("Failed to load JSON");
    }
  };

  useEffect(() => {
    // getJsonData();
  }, []);

  const createNavHotspot = (frame, targetPanorama, x, y, z, label) => {
    const hotspot = new PANOLENS.Infospot(300, PANOLENS.DataImage.Arrow);
    hotspot.position.set(x, y, 0);
    hotspot.addHoverText(label);
    hotspot.addEventListener("click", function () {
      viewer.setPanorama(targetPanorama);
    });
    return hotspot;
  };

  let lastClickTime = 0;
  const doubleClickThreshold = 300;

  const onPanoramaDoubleClick = (event, index) => {
    const intersect = viewer.raycaster.intersectObject(event.target)[0];
    const localPosition = intersect.point;
    const worldPosition = event.target.localToWorld(localPosition.clone());
    currentClickPositionRef.current = worldPosition;
    currentPanoramaRef.current = event.target;
    setCurrentPanoramaIndex(index);
    setShowModal(true);
  };

  const loadInfospots = async () => {
    const video_id = JSON.parse(localStorage.getItem("response")).newVideo._id;
    try {
      const res = await axios.get(
        `http://localhost:8000/infospots/${video_id}`
      );
      setInfospots(res.data);
    } catch (error) {
      console.log(error);
      alert("Error fetching infospots.");
    }
  };

  const initViewer = () => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    viewer = new PANOLENS.Viewer({
      container: containerRef.current,
    });

    if (framePoints.length > 0) {
      const panoramas = framePoints.map((frame) => {
        return new PANOLENS.ImagePanorama(
          frame.panorama_path
            .replace("../public", "")
            .replace(/\\/g, "/")
        );
      });

      panoramas.forEach((panorama, index) => {
        viewer.add(panorama);
        panorama.addEventListener("click", (event) => {
          const currentTime = Date.now();
          if (currentTime - lastClickTime < doubleClickThreshold) {
            onPanoramaDoubleClick(event, index);
          }
          lastClickTime = currentTime;
        });

        infospots.forEach((infospot) => {
          if (infospot.panorama_id === index) {
            const spot = new PANOLENS.Infospot(300, PANOLENS.DataImage.Info);
            spot.position.set(
              infospot.position_x,
              infospot.position_y,
              infospot.position_z
            );
            spot.addHoverElement(
              createInfospotElement(infospot.title, infospot.description),
              50
            );
            panorama.add(spot);
          }
        });
      });

      framePoints.forEach((frame, index) => {
        if (index < framePoints.length - 1) {
          const navHotspot = createNavHotspot(
            frame,
            panoramas[index + 1],
            frame.x,
            frame.y - 500,
            frame.z,
            `Move forward`
          );
          panoramas[index].add(navHotspot);
        }
        if (index > 0) {
          const backHotspot = createNavHotspot(
            frame,
            panoramas[index - 1],
            -frame.x,
            frame.y - 500,
            -frame.z,
            `Go back`
          );
          panoramas[index].add(backHotspot);
        }
      });

      viewer.setPanorama(panoramas[currentPanoramaIndex]);
    } else {
      const panorama = new PANOLENS.ImagePanorama("/frames/frame_0.jpg");
      viewer.add(panorama);
      panorama.addEventListener("dblclick", (event) => {
        const currentTime = Date.now();
        if (currentTime - lastClickTime < doubleClickThreshold) {
          onPanoramaClick(event);
        }
        lastClickTime = currentTime;
      });
      viewer.setPanorama(panorama);
    }
  };

  useEffect(() => {
    const frameData = JSON.parse(localStorage.getItem("response"));
    if (frameData && frameData.frame_points) {
      loadInfospots();
    }
  }, []);

  useEffect(() => {
    getJsonData();
  }, []);

  useEffect(() => {
    initViewer();
  }, [framePoints, infospots]);

  const handleUploadVideoFormSubmit = async (event) => {
    event.preventDefault();
    const uploadButton = document.getElementById("convertVideoBtn");
    uploadButton.disabled = true;

    const formData = new FormData();
    const fileInput = document.getElementById("videoFile");

    if (!fileInput.files.length) {
      alert("Please select a video file to upload.");
      uploadButton.disabled = false;
      return;
    } else {
      setLoading(true);
    }

    formData.append("video", fileInput.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:8000/video/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        getJsonData();
        localStorage.removeItem("response");
        localStorage.setItem("response", JSON.stringify(data));
        loadInfospots();
        getJsonData();
      } else {
        const errorData = response.data;
        localStorage.setItem("error", JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error uploading video:", error.message);
      alert("Error uploading video: " + error.message);
    } finally {
      uploadButton.disabled = false;
      setLoading(false);
      initViewer();
    }
  };

  const handleInfospotFormSubmit = async (e) => {
    e.preventDefault();
    if (currentClickPositionRef.current && currentPanoramaRef.current) {
      const { x, y, z } = currentClickPositionRef.current;
      const video_id = JSON.parse(localStorage.getItem("response")).newVideo
        ._id;
      try {
        await axios.post("http://localhost:8000/infospots/create", {
          title: infospotFields.title,
          description: infospotFields.description,
          position_x: x,
          position_y: y,
          position_z: z,
          video_id: video_id,
          panorama_id: currentPanoramaIndex,
        });
        loadInfospots();
        alert("Infospot created successfully.");
      } catch (error) {
        alert("Error in creating infospot");
      }

      const { title, description } = infospotFields;
      const infospot = new PANOLENS.Infospot(300, PANOLENS.DataImage.Info);
      infospot.position.copy(currentClickPositionRef.current);
      infospot.addHoverElement(createInfospotElement(title, description), 10);
      currentPanoramaRef.current.add(infospot);
      setShowModal(false);
      setInfospotFields({
        title: "",
        description: "",
      });
    }
  };

  const createInfospotElement = (title, description) => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div class="bg-white w-[300px] p-4 shadow-lg rounded-lg">
        <h3 class="text-xl font-bold mb-2">${title}</h3>
        <hr/>
        <p class="text-sm text-gray-700 mt-2">${description}</p>
      </div>`;
    return element;
  };

  const handleDeleteInfospot = async (id) => {
    const confirm = window.confirm("Do you want to delete infospot?");
    if (confirm) {
      try {
        await axios.delete(`http://localhost:8000/infospots/delete/${id}`);
        loadInfospots();
      } catch (error) {
        alert("Error deleting infospot");
      }
    }
  };
  const handleUpdateInfospot = async (e) => {
    e.preventDefault();
    const { title, description } = infospotFields;
    const { _id } = selectedInfospot;
    console.log(title, description, _id);
    try {
      await axios.put(`http://localhost:8000/infospots/update/${_id}`, {
        title,
        description,
      });
      loadInfospots();
      setInfospotFields({
        title: "",
        description: "",
      });
      setSelectedInfospot({});
      setShowModal(false);
      setIsUpdating(false);
    } catch (error) {
      alert("Error updating infospot");
    }
  };

  return (
    <>
      {loading && (
        <div className="h-screen w-screen fixed top-0 left-0 text-white flex flex-col gap-4 justify-center items-center bg-black opacity-70 z-50">
          <h1 className="text-5xl font-semibold">Creating Virtual Tour</h1>
          <ClockLoader color="#ffffff" size={60} />{" "}
          <h1 className="text-3xl">This might take few minutes</h1>
        </div>
      )}
      <div className="grid grid-cols-4 gap-4 p-4 sm:ml-0 ml-4">
        <form
          onSubmit={handleUploadVideoFormSubmit}
          className="col-span-4 flex flex-wrap gap-4 items-center"
        >
          <input
            type="file"
            id="videoFile"
            name="video"
            accept="video/*"
            className="border border-gray-300 p-1 rounded"
          />
          <button
            type="submit"
            id="convertVideoBtn"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? (
              <BarLoader loading={loading} color="#ffffff" />
            ) : (
              "Convert to Virtual Tour"
            )}
          </button>
        </form>
        <div
          className="w-full h-[450px] md:col-span-3 col-span-4"
          ref={containerRef}
        ></div>
        <div className="md:col-span-1 col-span-4">
          <h2 className="text-2xl mb-2">Infospots</h2>
          <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {infospots.map((infospot) => (
              <li
                key={infospot._id}
                className="p-2 border border-blue-300 rounded-lg bg-blue-50 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{infospot.title}</h3>
                  <p className="text-sm">{infospot.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedInfospot(infospot);
                      setIsUpdating(true);
                      setInfospotFields({
                        title: infospot.title,
                        description: infospot.description,
                      });
                    }}
                    className="text-blue-500"
                  >
                    <MdModeEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteInfospot(infospot._id)}
                    className="text-red-500"
                  >
                    <MdOutlineDelete size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Add Infospot</h2>
            <form onSubmit={handleInfospotFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={infospotFields.title}
                  onChange={(e) =>
                    setInfospotFields({
                      ...infospotFields,
                      title: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={infospotFields.description}
                  onChange={(e) =>
                    setInfospotFields({
                      ...infospotFields,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setInfospotFields({ title: "", description: "" });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Infospot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isUpdating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Update Infospot</h2>
            <form onSubmit={handleUpdateInfospot}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={infospotFields.title}
                  onChange={(e) =>
                    setInfospotFields({
                      ...infospotFields,
                      title: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={infospotFields.description}
                  onChange={(e) =>
                    setInfospotFields({
                      ...infospotFields,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsUpdating(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update Infospot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualTourComponent;
