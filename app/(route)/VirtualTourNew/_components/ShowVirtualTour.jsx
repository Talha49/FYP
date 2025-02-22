"use client";
import React, { useEffect, useRef, useState } from "react";
import * as PANOLENS from "panolens";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SwitchButton from "./SwitchButton";
import {
  ChevronDown,
  Info,
  LoaderCircle,
  Pencil,
  Rotate3d,
  SquareSplitHorizontal,
  Tag,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import Dialog from "./Dialog";
import { useSelector } from "react-redux";
import VTCard from "./VTCard";
import InfospotDrawer from "./InfospotDrawer";
import { TbMapPlus } from "react-icons/tb";
import { fetchInfospots } from "../utils";

const ShowVirtualTour = ({ virtualTour }) => {
  const mainContainerRef = useRef(null);
  const topContainerRef = useRef(null);
  const bottomContainerRef = useRef(null);
  const mainViewerRef = useRef(null);
  const activeViewerRef = useRef(null);
  const topViewerRef = useRef(null);
  const bottomViewerRef = useRef(null);
  const mainPanoramasRef = useRef({});
  const topPanoramasRef = useRef({});
  const bottomPanoramasRef = useRef({});
  const resizeObserverRef = useRef(null);
  const [isSplitModeOn, setIsSplitModeOn] = useState(false);
  const [isAutoRotateOn, setIsAutoRotateOn] = useState(true);
  const [isOpenVtSelectionDialog, setIsOpenVtSelectionDialog] = useState(false);
  const { virtualTours } = useSelector((state) => state.VTour);
  const [clickedPanel, setClickedPanel] = useState(null);
  const [topPanelVT, setTopPanelVT] = useState(null);
  const [bottomPanelVT, setBottomPanelVT] = useState(null);
  const [isOpenInfospotsDrawer, setIsOpenInfospotsDrawer] = useState(false);
  const [isOpenCreateInfospotDialog, setIsOpenCreateInfospotDialog] =
    useState(false);
  const [activeEventVtId, setActiveEventVtId] = useState(null);
  const [newInfospotData, setNewInfospotData] = useState({
    title: "",
    description: "",
    frame_id: "",
    position: { x: 0, y: 0, z: 0 },
    vt_id: null,
  });
  const [creatingInfospot, setCreatingInfospot] = useState(false);
  const [mainVtInfospots, setMainVtInfospots] = useState([]);
  const [topPanelVtInfospots, setTopPanelVtInfospots] = useState([]);
  const [bottomPanelVtInfospots, setBottomPanelVtInfospots] = useState([]);
  const [activeInfospotTab, setActiveInfospotTab] = useState(1);
  const [isOpenConfirmDeleteDialog, setIsOpenConfirmDeleteDialog] =
    useState(false);
  const [isEditingInfospot, setIsEditingInfospot] = useState(false);
  const [editingInfospot, setEditingInfospot] = useState(false);

  useEffect(() => {
    if (!isSplitModeOn) {
      setTopPanelVT(null);
      setBottomPanelVT(null);
    }
  }, [isSplitModeOn]);

  useEffect(() => {
    if (activeEventVtId) {
      setNewInfospotData((prev) => ({
        ...prev,
        vt_id: activeEventVtId,
      }));
    }
  }, [activeEventVtId]);

  const loadInfospots = async (id, setInfospots) => {
    if (!id) {
      console.warn("No ID provided for loading infospots.");
      return [];
    }
    try {
      const infospots = await fetchInfospots(id);
      setInfospots(infospots);
      return infospots;
    } catch (error) {
      console.error("Error loading infospots:", error);
      return [];
    }
  };

  const initializeViewer = (
    container,
    frames,
    viewerRef,
    panoramasRef,
    vt_id,
    setInfospots,
    infospots
  ) => {
    if (!container || !frames?.length) return;

    // Cleanup previous viewer
    if (viewerRef.current) {
      viewerRef.current.dispose();
      container.innerHTML = "";
    }

    try {
      // Initialize viewer
      viewerRef.current = new PANOLENS.Viewer({
        container: container,
        autoRotate: isAutoRotateOn,
        autoRotateSpeed: 0.7,
        controlBar: true,
        controlButtons: [
          "fullscreen",
          "setting",
          "video",
          "gallery",
          "zoom",
          "compass",
          "autorotate",
          "viewControl",
        ],
        output: "console",
      });

      loadInfospots(vt_id, setInfospots);

      container.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        setActiveViewer(container);
        setActiveEventVtId(vt_id);
        const currentPanorama = viewerRef.current.panorama;
        const frameId = Object.keys(panoramasRef.current).find(
          (key) => panoramasRef.current[key] === currentPanorama
        );
        const rect = container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        const y =
          -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        const raycaster = viewerRef.current.raycaster;
        const camera = viewerRef.current.camera;
        raycaster.setFromCamera({ x, y }, camera);

        const intersects = raycaster.intersectObject(currentPanorama, true);

        if (intersects.length > 0) {
          const worldPosition = intersects[0].point;
          const localPosition = currentPanorama.worldToLocal(
            worldPosition.clone()
          );
          setIsOpenCreateInfospotDialog(true);

          // Update new infospot data
          setNewInfospotData((prev) => ({
            ...prev,
            frame_id: frameId,
            position: {
              x: localPosition.x,
              y: localPosition.y,
              z: localPosition.z,
            },
          }));
        }
      });

      // Create panoramas
      frames.forEach((frame, index) => {
        const panorama = new PANOLENS.ImagePanorama(frame.url);

        panorama.addEventListener("load", () => {
          console.log(`Loaded frame ${index + 1}`);
        });

        // Store panorama reference
        panoramasRef.current[frame._id] = panorama;
        viewerRef.current.add(panorama);

        // Attach infospots to the respective panorama
        const frameInfospots = infospots.filter(
          (spot) => spot.frame_id === frame._id
        );
        frameInfospots.forEach((spot) => {
          const infoSpot = new PANOLENS.Infospot(300, PANOLENS.DataImage.Info);
          infoSpot.position.set(
            spot.position.x,
            spot.position.y,
            spot.position.z
          );
          infoSpot.addHoverText(spot.title, 30);

          infoSpot.addEventListener("click", () => {
            alert(`${spot.title}: ${spot.description}`);
          });

          panorama.add(infoSpot);
        });

        // Add navigation hotspots
        if (index > 0) {
          addHotspot(
            panorama,
            frames[index - 1],
            "Move Back",
            -5000,
            viewerRef,
            panoramasRef
          );
        }
        if (index < frames.length - 1) {
          addHotspot(
            panorama,
            frames[index + 1],
            "Move Forward",
            5000,
            viewerRef,
            panoramasRef
          );
        }
      });

      // Set first panorama
      const firstPanorama = panoramasRef.current[frames[0]._id];
      if (firstPanorama) {
        viewerRef.current.setPanorama(firstPanorama, 1000);
      }
    } catch (error) {
      console.error("WebGL error:", error);
    }
  };

  const addHotspot = (
    panorama,
    targetFrame,
    text,
    xOffset,
    viewerRef,
    panoramasRef
  ) => {
    const hotspot = new PANOLENS.Infospot(400, PANOLENS.DataImage.Arrow);
    hotspot.position.set(xOffset, 0, 0);
    hotspot.addHoverText(text);

    hotspot.addEventListener("click", () => {
      const nextPanorama = panoramasRef.current[targetFrame._id];
      if (nextPanorama) {
        viewerRef.current.setPanorama(nextPanorama, 1000);
      }
    });

    panorama.add(hotspot);
  };

  // Initialize main viewer
  useEffect(() => {
    if (!virtualTour?.frames?.length) return;
    initializeViewer(
      mainContainerRef.current,
      virtualTour.frames,
      mainViewerRef,
      mainPanoramasRef,
      virtualTour._id,
      setMainVtInfospots,
      virtualTour.infospots
    );

    // Setup ResizeObserver
    resizeObserverRef.current = new ResizeObserver((entries) => {
      entries.forEach(() => {
        if (mainViewerRef.current) mainViewerRef.current.onWindowResize();
        if (topViewerRef.current) topViewerRef.current.onWindowResize();
        if (bottomViewerRef.current) bottomViewerRef.current.onWindowResize();
      });
    });

    if (mainContainerRef.current) {
      resizeObserverRef.current.observe(mainContainerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      [mainViewerRef, topViewerRef, bottomViewerRef].forEach((ref) => {
        if (ref.current) {
          ref.current.dispose();
        }
      });
    };
  }, [virtualTour]);

  // Initialize top panel viewer
  useEffect(() => {
    if (isSplitModeOn && topPanelVT?.frames?.length) {
      initializeViewer(
        topContainerRef.current,
        topPanelVT.frames,
        topViewerRef,
        topPanoramasRef,
        topPanelVT._id,
        setTopPanelVtInfospots,
        topPanelVT.infospots
      );
      if (resizeObserverRef.current && topContainerRef.current) {
        resizeObserverRef.current.observe(topContainerRef.current);
      }
    }
  }, [topPanelVT]);

  // Initialize bottom panel viewer
  useEffect(() => {
    if (isSplitModeOn && bottomPanelVT?.frames?.length) {
      initializeViewer(
        bottomContainerRef.current,
        bottomPanelVT.frames,
        bottomViewerRef,
        bottomPanoramasRef,
        bottomPanelVT._id,
        setBottomPanelVtInfospots,
        bottomPanelVT.infospots
      );
      if (resizeObserverRef.current && bottomContainerRef.current) {
        resizeObserverRef.current.observe(bottomContainerRef.current);
      }
    }
  }, [bottomPanelVT]);

  const handleResize = () => {
    [mainViewerRef, topViewerRef, bottomViewerRef].forEach((ref) => {
      if (ref.current) {
        ref.current.onWindowResize();
      }
    });
  };

  const toggleAutoRotate = () => {
    setIsAutoRotateOn((prevState) => {
      const newState = !prevState;

      // Update all active viewers
      const viewers = [
        mainViewerRef.current,
        topViewerRef.current,
        bottomViewerRef.current,
      ].filter(Boolean);

      viewers.forEach((viewer) => {
        if (viewer && viewer.OrbitControls) {
          viewer.OrbitControls.autoRotate = newState;

          // If turning off auto-rotate, reset the rotation angle and update controls
          if (!newState) {
            viewer.OrbitControls.autoRotateSpeed = 0;
            viewer.OrbitControls.update();
          } else {
            viewer.OrbitControls.autoRotateSpeed = 0.7; // or whatever speed you prefer
          }
        }
      });

      return newState;
    });
  };

  const handleChange = (e) => {
    setNewInfospotData({
      ...newInfospotData,
      [e.target.name]: e.target.value,
    });
  };

  const setActiveViewer = (container) => {
    if (container === mainContainerRef.current) {
      activeViewerRef.current = mainViewerRef.current;
    } else if (container === topContainerRef.current) {
      activeViewerRef.current = topViewerRef.current;
    } else if (container === bottomContainerRef.current) {
      activeViewerRef.current = bottomViewerRef.current;
    }
  };

  const handleCreateInfospot = async (e) => {
    e.preventDefault();
    setCreatingInfospot(true);
    try {
      const res = await fetch("/api/infospot/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInfospotData),
      });
      if (!res.ok) {
        throw new Error("Failed to create infospot");
      }
      const data = await res.json();
      const newInfospot = data.newInfospot;
      setIsOpenCreateInfospotDialog(false);
      setNewInfospotData({
        title: "",
        description: "",
        frame_id: "",
        position: { x: 0, y: 0, z: 0 },
        vt_id: virtualTour._id,
      });
      const camera = activeViewerRef.current.camera;
      const currentPanorama = activeViewerRef.current.panorama;
      if (!currentPanorama) {
        throw new Error("No panorama active in current viewer");
      }
      const spot = new PANOLENS.Infospot(300, PANOLENS.DataImage.Info);
      spot.position.copy(newInfospot.position);
      spot.position.z += 50; // Move forward for better visibility
      spot.scale.set(2, 2, 2); // Increase size
      spot.lookAt(camera.position); // Face camera
      spot.addHoverText(newInfospot.title);

      currentPanorama.add(spot);
      activeViewerRef.current.update(); // Refresh scene
    } catch (error) {
      console.log("Failed to create infospot:", error);
    } finally {
      setCreatingInfospot(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center mb-4 gap-4 absolute top-2 right-20 z-20 w-full">
        <div className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-500 text-blue-500 p-2 rounded-lg transition-all">
          <h1
            className={`${
              isSplitModeOn ? "text-blue-500" : "text-blue-500"
            } transition-all flex items-center gap-2`}
          >
            <Rotate3d size={18} />
            Auto Rotate
          </h1>
          <SwitchButton checked={isAutoRotateOn} onChange={toggleAutoRotate} />
        </div>
        <div className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-500 text-blue-500 p-2 rounded-lg transition-all">
          <h1
            className={`${
              isSplitModeOn ? "text-blue-500" : "text-blue-500"
            } transition-all flex items-center gap-2`}
          >
            <SquareSplitHorizontal size={18} />
            Split Mode
          </h1>
          <SwitchButton
            checked={isSplitModeOn}
            onChange={() => {
              setIsSplitModeOn(!isSplitModeOn);
            }}
          />
        </div>
        <button
          onClick={() => setIsOpenInfospotsDrawer(true)}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-500 text-blue-500 p-2 rounded-lg transition-all"
        >
          <Info size={18} /> View Infospots
        </button>
      </div>
      <PanelGroup
        direction="horizontal"
        className="h-screen border bg-blue-300 rounded-lg"
        onLayout={handleResize}
      >
        <Panel
          defaultSize={50}
          minSize={20}
          maxSize={80}
          className="rounded-lg bg-blue-300"
        >
          <div
            ref={mainContainerRef}
            className="w-full h-full bg-black shadow-md"
            style={{
              position: "relative",
              overflow: "hidden",
              touchAction: "none",
            }}
          />
        </Panel>

        {isSplitModeOn && (
          <>
            <PanelResizeHandle className="w-1 bg-blue-300 hover:bg-blue-600 transition-all cursor-col-resize" />
            <Panel
              defaultSize={50}
              minSize={0}
              maxSize={80}
              className="flex bg-blue-300"
            >
              <PanelGroup direction="vertical">
                <Panel
                  defaultSize={50}
                  minSize={20}
                  maxSize={80}
                  className="group flex items-center justify-center rounded-lg bg-blue-300 bg-opacity-70 transition-all hover:bg-black hover:bg-opacity-70 backdrop-blur-md cursor-pointer"
                  onClick={() => {
                    if (!topPanelVT) {
                      setIsOpenVtSelectionDialog(true);
                      setClickedPanel("top");
                    }
                  }}
                >
                  {topPanelVT ? (
                    <div className="relative w-full h-full">
                      <div
                        ref={topContainerRef}
                        className="w-full h-full bg-black shadow-md"
                        style={{
                          position: "relative",
                          overflow: "hidden",
                          touchAction: "none",
                        }}
                      />
                      <button
                        className="absolute top-2 right-2 z-10 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-1.5 shadow-md transition-all duration-200 hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent panel click event
                          if (topViewerRef.current) {
                            topViewerRef.current.dispose();
                          }
                          setTopPanelVT(null);
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="cursor-pointer text-blue-500 transition-transform duration-300 group hover:text-blue-600 flex flex-col items-center justify-center space-y-2 p-4 bg-blue-50 w-full h-full">
                      <TbMapPlus
                        size={80}
                        className="text-blue-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-600"
                      />

                      <h1 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
                        Add New Virtual Tour
                      </h1>

                      <p className="text-sm text-gray-500 group-hover:text-gray-700">
                        Select another virtual tour to compare an immersive
                        virtual experience.
                      </p>
                    </div>
                  )}
                </Panel>

                <PanelResizeHandle className="h-1 bg-blue-300 hover:bg-blue-600 transition-all cursor-row-resize" />

                <Panel
                  defaultSize={50}
                  minSize={20}
                  maxSize={80}
                  className="group flex items-center justify-center rounded-lg bg-blue-300 bg-opacity-70 transition-all hover:bg-black hover:bg-opacity-70 backdrop-blur-md cursor-pointer"
                  onClick={() => {
                    if (!bottomPanelVT) {
                      setIsOpenVtSelectionDialog(true);
                      setClickedPanel("bottom");
                    }
                  }}
                >
                  {bottomPanelVT ? (
                    <div className="relative w-full h-full">
                      <div
                        ref={bottomContainerRef}
                        className="w-full h-full bg-black shadow-md"
                        style={{
                          position: "relative",
                          overflow: "hidden",
                          touchAction: "none",
                        }}
                      />
                      <button
                        className="absolute top-2 right-2 z-10 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-1.5 shadow-md transition-all duration-200 hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent panel click event
                          if (bottomViewerRef.current) {
                            bottomViewerRef.current.dispose();
                          }
                          setBottomPanelVT(null);
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="cursor-pointer text-blue-500 transition-transform duration-300 group hover:text-blue-600 flex flex-col items-center justify-center space-y-2 p-4 bg-blue-50 w-full h-full">
                      <TbMapPlus
                        size={80}
                        className="text-blue-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-600"
                      />

                      <h1 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
                        Add New Virtual Tour
                      </h1>

                      <p className="text-sm text-gray-500 group-hover:text-gray-700">
                        Select another virtual tour to compare an immersive
                        virtual experience.
                      </p>
                    </div>
                  )}
                </Panel>
              </PanelGroup>
            </Panel>
          </>
        )}
      </PanelGroup>
      <Dialog
        isOpen={isOpenVtSelectionDialog}
        onClose={() => setIsOpenVtSelectionDialog(false)}
        title="Select Virtual Tour"
        className="max-w-3xl max-h-[500px]"
      >
        <div className="grid grid-cols-2 gap-4">
          {virtualTours
            ?.filter(
              (tour) =>
                tour._id !== virtualTour._id &&
                tour._id !== topPanelVT?._id &&
                tour._id !== bottomPanelVT?._id
            )
            ?.map((tour) => (
              <VTCard
                key={tour._id}
                tour={tour}
                isSelectionDialog={true}
                buttonOnClick={() => {
                  if (clickedPanel === "top") {
                    setTopPanelVT(tour);
                  } else {
                    setBottomPanelVT(tour);
                  }
                  setIsOpenVtSelectionDialog(false);
                }}
              />
            ))}
        </div>
      </Dialog>
      {/* Create infospot dialog */}
      <Dialog
        isOpen={isOpenCreateInfospotDialog}
        onClose={() => {
          setIsOpenCreateInfospotDialog(false);
          setNewInfospotData({
            title: "",
            description: "",
            frame_id: "",
            position: { x: 0, y: 0, z: 0 },
            vt_id: virtualTour._id,
          });
          setIsEditingInfospot(false);
        }}
        title={isEditingInfospot ? "Edit Infospot" : "Create Infospot"}
        className="max-w-[500px]"
      >
        <form
          onSubmit={(e) => handleCreateInfospot(e)}
          className="flex flex-col gap-2"
        >
          <div>
            <label htmlFor="title" className="text-sm text-gray-600">
              Infospot Title
            </label>
            <input
              id="title"
              name="title"
              value={newInfospotData.title}
              onChange={handleChange}
              type="text"
              placeholder="Infospot Title"
              className="w-full p-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="description" className="text-sm text-gray-600">
              Infospot Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newInfospotData.description}
              onChange={handleChange}
              placeholder="Infospot Description"
              className="w-full h-32 p-2 border border-blue-500 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              className="flex items-center justify-center gap-2 p-2 w-full bg-neutral-100 text-neutral-800 border rounded-md hover:bg-neutral-200 transition"
              onClick={() => {
                setIsOpenCreateInfospotDialog(false);
                setNewInfospotData({
                  title: "",
                  description: "",
                  frame_id: "",
                  position: { x: 0, y: 0, z: 0 },
                  vt_id: virtualTour._id,
                });
                setIsEditingInfospot(false);
              }}
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            {!isEditingInfospot ? (
              <button
                type="submit"
                className="flex items-center justify-center w-full p-2 bg-blue-500 text-white disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-md hover:bg-blue-600 transition"
                disabled={creatingInfospot}
              >
                {creatingInfospot ? (
                  <p className="flex items-center gap-2">
                    <LoaderCircle size={18} className="animate-spin" />
                    <span>Creating Infospot...</span>
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    <Tag size={18} />
                    <span>Create Infospot</span>
                  </p>
                )}
              </button>
            ) : (
              <button
                className="flex items-center justify-center w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                disabled={editingInfospot}
                onClick={() => {}}
              >
                {editingInfospot ? (
                  <p className="flex items-center gap-2">
                    <LoaderCircle size={18} className="animate-spin" />
                    <span>Updating Infospot...</span>
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    <Tag size={18} />
                    <span>Update Infospot</span>
                  </p>
                )}
              </button>
            )}
          </div>
        </form>
      </Dialog>
      {/* Infospots drawer */}
      <InfospotDrawer
        isOpen={isOpenInfospotsDrawer}
        onClose={() => {
          setIsOpenInfospotsDrawer(false);
        }}
        title={"Infospots"}
        description={"List of infospots you have added to current virtual tour"}
      >
        <div className="space-y-2">
          {[
            {
              id: 1,
              title: "Main Panel Infospots",
              data: mainVtInfospots,
            },
            {
              id: 2,
              title: "Top-Right Panel Infospots",
              data: topPanelVtInfospots,
              isVisible: isSplitModeOn && topPanelVT,
              emptyMessage: !topPanelVT
                ? "Please open virtual tour first"
                : "No infospots",
            },
            {
              id: 3,
              title: "Bottom-Right Panel Infospots",
              data: bottomPanelVtInfospots,
              isVisible: isSplitModeOn && bottomPanelVT,
              emptyMessage: !bottomPanelVT
                ? "Please open virtual tour first"
                : "No infospots",
            },
          ].map(
            ({
              id,
              title,
              data,
              isVisible = true,
              emptyMessage = "No infospots",
            }) =>
              isVisible ? (
                <div
                  key={id}
                  className={`${
                    activeInfospotTab === id
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-500"
                  } p-2 rounded-md cursor-pointer`}
                  onClick={() => setActiveInfospotTab(id)}
                >
                  <h1 className="text-lg font-semibold flex items-center justify-between">
                    <span>{title}</span>
                    <ChevronDown
                      className={`${
                        activeInfospotTab === id ? "rotate-180" : "rotate-0"
                      } transition-all`}
                    />
                  </h1>
                  {activeInfospotTab === id && (
                    <div className="space-y-2 mt-2">
                      {data.length ? (
                        data.map((infospot) => (
                          <div
                            key={infospot._id}
                            className="relative flex flex-col p-2 bg-blue-50 rounded-md"
                          >
                            <h1 className="text-lg text-black font-semibold">
                              {infospot.title}
                            </h1>
                            <p className="text-sm text-gray-500">
                              {infospot.description}
                            </p>
                            <div className="absolute top-2 right-2 flex items-center gap-2">
                              <Pencil
                                size={15}
                                className="text-black hover:scale-110 hover:rotate-3 transition-all"
                                onClick={() => {
                                  setNewInfospotData({
                                    title: infospot.title,
                                    description: infospot.description,
                                    frame_id: infospot.frame_id,
                                    position: infospot.position,
                                    vt_id: infospot.vt_id,
                                  });
                                  setIsEditingInfospot(true);
                                  setIsOpenCreateInfospotDialog(true);
                                }}
                              />
                              <Trash2
                                size={15}
                                className="text-red-600 hover:scale-110 hover:rotate-3 transition-all"
                                onClick={() =>
                                  setIsOpenConfirmDeleteDialog(true)
                                }
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-100 p-2">
                          {emptyMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : null
          )}
        </div>
      </InfospotDrawer>
      {/* Confirmation Delete dialog */}
      <Dialog
        title={"Please Confirm!"}
        isOpen={isOpenConfirmDeleteDialog}
        onClose={() => {
          setIsOpenConfirmDeleteDialog(false);
        }}
        className="max-w-[550px]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex items-center justify-center">
              <span className="bg-yellow-100 p-3 flex items-center justify-center rounded-full">
                <TriangleAlert size={40} className="text-yellow-500" />
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                Are you sure you want to delete this Infospot?
              </h1>
              <p className="text-sm text-gray-600">
                This action cannot be undone. Once deleted, the infospot will be
                permanently removed.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              className="flex items-center gap-2 p-2 bg-neutral-100 text-neutral-800 border rounded-md hover:bg-neutral-200 transition"
              onClick={() => setIsOpenConfirmDeleteDialog(false)}
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button
              className="flex items-center gap-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              onClick={() => {
                alert("Delete Infospot");
              }}
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ShowVirtualTour;
