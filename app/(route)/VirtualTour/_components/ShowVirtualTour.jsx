"use client";
import React, { useEffect, useRef, useState } from "react";
import * as PANOLENS from "panolens";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SwitchButton from "./SwitchButton";
import {
  Bug,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  LoaderCircle,
  LockKeyhole,
  LockKeyholeOpen,
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
import {
  deleteInfospot,
  driverObj,
  fetchInfospots,
  formatTimestamp,
  updateInfospot,
} from "../utils";
import "driver.js/dist/driver.css";
import { GoQuestion } from "react-icons/go";
import TaskCreationForm from "../../Upload/UploadForm/UploadForm";

const ShowVirtualTour = ({ virtualTour }) => {
  const mainContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const mainViewerRef = useRef(null);
  const activeViewerRef = useRef(null);
  const rightViewerRef = useRef(null);
  const mainPanoramasRef = useRef({});
  const rightPanoramasRef = useRef({});
  const resizeObserverRef = useRef(null);
  const [isSplitModeOn, setIsSplitModeOn] = useState(false);
  const [isAutoRotateOn, setIsAutoRotateOn] = useState(true);
  const [isOpenVtSelectionDialog, setIsOpenVtSelectionDialog] = useState(false);
  const { virtualTours } = useSelector((state) => state.VTour);
  const [clickedPanel, setClickedPanel] = useState(null);
  const [rightPanelVT, setRightPanelVT] = useState(null);
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
  const [rightPanelVtInfospots, setRightPanelVtInfospots] = useState([]);
  const [activeInfospotTab, setActiveInfospotTab] = useState(1);
  const [isOpenConfirmDeleteDialog, setIsOpenConfirmDeleteDialog] =
    useState(false);
  const [loadingInfospots, setLoadingInfospots] = useState(false);
  const [isEditingInfospot, setIsEditingInfospot] = useState(false);
  const [editingInfospot, setEditingInfospot] = useState(false);
  const [isDeletingInfospot, setIsDeletingInfospot] = useState(false);
  const [selectedInfospot, setSelectedInfospot] = useState(null);
  const [deletedInfospots, setDeletedInfospots] = useState(
    sessionStorage.getItem("deletedInfospots")
      ? JSON.parse(sessionStorage.getItem("deletedInfospots"))
      : []
  );
  const [updatedInfospots, setUpdatedInfospots] = useState(
    sessionStorage.getItem("updatedInfospots")
      ? JSON.parse(sessionStorage.getItem("updatedInfospots"))
      : []
  );
  const [updatingInfospotId, setUpdatingInfospotId] = useState(null);
  const [isOpenActionSelectionDialog, setIsOpenActionSelectionDialog] =
    useState(false);
  const [isOpenCreateTaskDialog, setIsOpenCreateTaskDialog] = useState(false);
  const [clickedInfospot, setClickedInfospot] = useState(null);
  const [locked, setLocked] = useState(false);
  const syncingRef = useRef(false);
  const [mainPanelVtIndex, setMainPanelVtIndex] = useState(0);
  const [rightPanelVtIndex, setRightPanelVtIndex] = useState(0);
  const [mainPanelVT, setMainPanelVT] = useState(virtualTour);

  const navigateVirtualTour = (direction, panel) => {
    const isMainPanel = panel === "main";
    const currentIndex = isMainPanel ? mainPanelVtIndex : rightPanelVtIndex;
    const setIndex = isMainPanel ? setMainPanelVtIndex : setRightPanelVtIndex;

    // Calculate new index based on direction
    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % virtualTours.length;
    } else {
      newIndex = (currentIndex - 1 + virtualTours.length) % virtualTours.length;
    }

    setIndex(newIndex);

    // Update the appropriate panel with the new virtual tour
    if (isMainPanel) {
      // We need to reinitialize the main viewer with the new virtual tour
      const newVirtualTour = virtualTours[newIndex];
      // Reset any existing viewer
      if (mainViewerRef.current) {
        mainViewerRef.current.dispose();
      }
      if (mainContainerRef.current) {
        mainContainerRef.current.innerHTML = "";
      }

      // Initialize with the new tour (similar logic to your existing useEffect)
      const activeInfospots = newVirtualTour.infospots.filter(
        (infospot) => !deletedInfospots.includes(infospot._id)
      );
      const finalInfospots = activeInfospots.map((infospot) => {
        const updatedInfospot = updatedInfospots.find(
          (updated) => updated._id === infospot._id
        );
        return updatedInfospot ? updatedInfospot : infospot;
      });

      // Update the main panel virtual tour state
      setMainPanelVT(newVirtualTour);

      initializeViewer(
        mainContainerRef.current,
        newVirtualTour.frames,
        mainViewerRef,
        mainPanoramasRef,
        newVirtualTour._id,
        setMainVtInfospots,
        finalInfospots
      );
    } else {
      // Update only the right panel with the new tour
      setRightPanelVT(virtualTours[newIndex]);
    }
  };

  useEffect(() => {
    if (virtualTour && virtualTours?.length) {
      const index = virtualTours.findIndex(
        (tour) => tour._id === virtualTour._id
      );
      if (index !== -1) {
        setMainPanelVtIndex(index);
      }
    }
  }, [virtualTour, virtualTours]);

  useEffect(() => {
    if (rightPanelVT && virtualTours?.length) {
      const index = virtualTours.findIndex(
        (tour) => tour._id === rightPanelVT._id
      );
      if (index !== -1) {
        setRightPanelVtIndex(index);
      }
    }
  }, [rightPanelVT, virtualTours]);

  // Replace the existing setupSynchronization function with this improved version
  const setupSynchronization = () => {
    if (locked && mainViewerRef.current && rightViewerRef.current) {
      const mainControls = mainViewerRef.current.OrbitControls;
      const rightControls = rightViewerRef.current.OrbitControls;

      // Add event listeners for main viewer
      const mainControlsChangeHandler = () => {
        if (syncingRef.current || !locked) return;

        syncingRef.current = true;

        // Sync camera position and rotation from main to right
        const mainCamera = mainViewerRef.current.camera;
        const rightCamera = rightViewerRef.current.camera;

        // Apply position and rotation to right camera
        rightCamera.position.copy(mainCamera.position);
        rightCamera.quaternion.copy(mainCamera.quaternion);

        // Update controls and renderer
        rightControls.update();
        rightViewerRef.current.renderer.render(
          rightViewerRef.current.scene,
          rightCamera
        );

        syncingRef.current = false;
      };

      // Add event listeners for right viewer
      const rightControlsChangeHandler = () => {
        if (syncingRef.current || !locked) return;

        syncingRef.current = true;

        // Sync camera position and rotation from right to main
        const mainCamera = mainViewerRef.current.camera;
        const rightCamera = rightViewerRef.current.camera;

        // Apply position and rotation to main camera
        mainCamera.position.copy(rightCamera.position);
        mainCamera.quaternion.copy(rightCamera.quaternion);

        // Update controls and renderer
        mainControls.update();
        mainViewerRef.current.renderer.render(
          mainViewerRef.current.scene,
          mainCamera
        );

        syncingRef.current = false;
      };

      // Add event listeners
      mainControls.addEventListener("change", mainControlsChangeHandler);
      rightControls.addEventListener("change", rightControlsChangeHandler);

      // Return cleanup function
      return () => {
        if (mainControls) {
          mainControls.removeEventListener("change", mainControlsChangeHandler);
        }
        if (rightControls) {
          rightControls.removeEventListener(
            "change",
            rightControlsChangeHandler
          );
        }
      };
    }
    return () => {}; // Return empty cleanup function if conditions aren't met
  };

  // Make sure this useEffect is properly implemented to setup and cleanup the synchronization
  useEffect(() => {
    const cleanupSync = setupSynchronization();

    // Clean up on component unmount or when lock state changes
    return () => {
      if (cleanupSync) cleanupSync();
    };
  }, [locked, isSplitModeOn, mainViewerRef.current, rightViewerRef.current]);

  useEffect(() => {
    const hasDriven = sessionStorage.getItem("hasDriven");

    if (!hasDriven) {
      setTimeout(() => {
        driverObj.drive();
      }, 1500);
      sessionStorage.setItem("hasDriven", "true");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      "deletedInfospots",
      JSON.stringify(deletedInfospots)
    );
  }, [deletedInfospots]);

  useEffect(() => {
    sessionStorage.setItem(
      "updatedInfospots",
      JSON.stringify(updatedInfospots)
    );
  }, [updatedInfospots]);

  useEffect(() => {
    if (!isSplitModeOn) {
      setRightPanelVT(null);
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
      setLoadingInfospots(true);
      const infospots = await fetchInfospots(id);
      setInfospots(infospots);
      return infospots;
    } catch (error) {
      console.error("Error loading infospots:", error);
      return [];
    } finally {
      setLoadingInfospots(false);
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
          // "setting",
          // "video",
          // "gallery",
          // "zoom",
          // "compass",
          // "autorotate",
          // "viewControl",
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
          // setIsOpenCreateInfospotDialog(true);
          setIsOpenActionSelectionDialog(true);

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
            setClickedInfospot({
              title: spot.title,
              description: spot.description,
            });
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
    const activeInfospots = virtualTour.infospots.filter(
      (infospot) => !deletedInfospots.includes(infospot._id)
    );
    const finalInfospots = activeInfospots.map((infospot) => {
      const updatedInfospot = updatedInfospots.find(
        (updated) => updated._id === infospot._id
      );
      return updatedInfospot ? updatedInfospot : infospot;
    });

    initializeViewer(
      mainContainerRef.current,
      virtualTour.frames,
      mainViewerRef,
      mainPanoramasRef,
      virtualTour._id,
      setMainVtInfospots,
      finalInfospots
    );

    // Setup ResizeObserver
    resizeObserverRef.current = new ResizeObserver((entries) => {
      entries.forEach(() => {
        if (mainViewerRef.current) mainViewerRef.current.onWindowResize();
        if (rightViewerRef.current) rightViewerRef.current.onWindowResize();
      });
    });

    if (mainContainerRef.current) {
      resizeObserverRef.current.observe(mainContainerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      [mainViewerRef, rightViewerRef].forEach((ref) => {
        if (ref.current) {
          ref.current.dispose();
        }
      });
    };
  }, [virtualTour, deletedInfospots, updatedInfospots]);

  // Initialize top panel viewer
  useEffect(() => {
    if (isSplitModeOn && rightPanelVT?.frames?.length) {
      const activeInfospots = rightPanelVT.infospots.filter(
        (infospot) => !deletedInfospots.includes(infospot._id)
      );
      const finalInfospots = activeInfospots.map((infospot) => {
        const updatedInfospot = updatedInfospots.find(
          (updated) => updated._id === infospot._id
        );
        return updatedInfospot ? updatedInfospot : infospot;
      });
      initializeViewer(
        rightContainerRef.current,
        rightPanelVT.frames,
        rightViewerRef,
        rightPanoramasRef,
        rightPanelVT._id,
        setRightPanelVtInfospots,
        finalInfospots
      );
      if (resizeObserverRef.current && rightContainerRef.current) {
        resizeObserverRef.current.observe(rightContainerRef.current);
      }
    }
  }, [rightPanelVT, deletedInfospots, updatedInfospots]);

  const handleResize = () => {
    [mainViewerRef, rightViewerRef].forEach((ref) => {
      if (ref.current) {
        ref.current.onWindowResize();
      }
    });
  };

  const toggleAutoRotate = () => {
    setIsAutoRotateOn((prevState) => {
      const newState = !prevState;

      // Update all active viewers
      const viewers = [mainViewerRef.current, rightViewerRef.current].filter(
        Boolean
      );

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
    } else if (container === rightContainerRef.current) {
      activeViewerRef.current = rightViewerRef.current;
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
      loadInfospots(virtualTour._id, setMainVtInfospots);
      loadInfospots(rightPanelVT?._id, setRightPanelVtInfospots);
    } catch (error) {
      console.log("Failed to create infospot:", error);
    } finally {
      setCreatingInfospot(false);
    }
  };

  const handleDeleteInfospot = async (infospotId) => {
    try {
      setIsDeletingInfospot(true);
      const deletedInfospot = await deleteInfospot(infospotId);
      if (deletedInfospot) {
        loadInfospots(virtualTour._id, setMainVtInfospots);
        loadInfospots(rightPanelVT?._id, setRightPanelVtInfospots);
        setDeletedInfospots([...deletedInfospots, deletedInfospot?._id]);
      }
    } catch (error) {
      console.error("Error deleting infospot:", error);
    } finally {
      setIsDeletingInfospot(false);
      setIsOpenConfirmDeleteDialog(false);
    }
  };

  const handleUpdateInfospot = async (e) => {
    try {
      e.preventDefault();
      setEditingInfospot(true);
      const updatedInfospot = await updateInfospot(
        updatingInfospotId,
        newInfospotData
      );
      if (updatedInfospot) {
        loadInfospots(virtualTour._id, setMainVtInfospots);
        loadInfospots(rightPanelVT?._id, setRightPanelVtInfospots);
        setIsOpenCreateInfospotDialog(false);
        setNewInfospotData({
          title: "",
          description: "",
          frame_id: "",
          position: { x: 0, y: 0, z: 0 },
          vt_id: virtualTour._id,
        });
        setUpdatedInfospots([...updatedInfospots, updatedInfospot]);
      }
    } catch (error) {
      console.error("Error updating infospot:", error);
    } finally {
      setEditingInfospot(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center mb-4 gap-4 absolute top-2 right-20 z-20 w-full">
        <GoQuestion
          id="learn"
          className="cursor-pointer text-3xl text-blue-500 hover:scale-110 hover:text-blue-600 transition-all"
          onClick={() => driverObj.drive()}
        />
        <div
          id="auto-rotate"
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-500 text-blue-500 p-2 rounded-lg transition-all"
        >
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
        <div
          id="split-mode"
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-500 text-blue-500 p-2 rounded-lg transition-all"
        >
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
          id="view-infospots"
          onClick={() => setIsOpenInfospotsDrawer(true)}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-500 text-blue-500 p-2 rounded-lg transition-all"
        >
          <Info size={18} /> View Infospots
        </button>
      </div>
      <PanelGroup
        id="vt-panel"
        direction="horizontal"
        className="h-screen border bg-blue-300 rounded-lg"
        onLayout={handleResize}
      >
        <Panel
          defaultSize={50}
          minSize={30}
          maxSize={80}
          className="bg-blue-300 relative"
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
          <div className="absolute bottom-2 left-0 px-2 flex items-center justify-center gap-2">
            <button
              className="bg-white p-1 rounded-md shadow-md"
              onClick={() => navigateVirtualTour("prev", "main")}
            >
              <ChevronLeft />
            </button>
            <div className="bg-white px-6 py-1 rounded-md shadow-md line-clamp-1">
              {formatTimestamp(mainPanelVT?.createdAt)}
            </div>
            <button
              className="bg-white p-1 rounded-md shadow-md"
              onClick={() => navigateVirtualTour("next", "main")}
            >
              <ChevronRight />
            </button>
          </div>
        </Panel>

        {isSplitModeOn && (
          <>
            <PanelResizeHandle className="relative w-1 bg-blue-500 transition-all">
              <button
                onClick={() => setLocked(!locked)}
                className={`absolute z-50 top-1/2 left-[-14px] cursor-pointer p-2 rounded-md border border-blue-500 ${
                  locked ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                } transform -translate-y-1/2`}
              >
                {locked ? (
                  <LockKeyholeOpen size={15} />
                ) : (
                  <LockKeyhole size={15} />
                )}
              </button>
            </PanelResizeHandle>

            <Panel
              defaultSize={50}
              minSize={30}
              maxSize={80}
              className="flex bg-blue-300 relative"
              onClick={() => {
                if (!rightPanelVT) {
                  setIsOpenVtSelectionDialog(true);
                  setClickedPanel("right");
                }
              }}
            >
              {rightPanelVT ? (
                <div className="relative w-full h-full">
                  <div
                    ref={rightContainerRef}
                    className="w-full h-full bg-black shadow-md"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      touchAction: "none",
                    }}
                  />
                  <div className="absolute bottom-2 left-0 px-2 flex items-center justify-center gap-2">
                    <button
                      className="bg-white p-1 rounded-md shadow-md"
                      onClick={() => navigateVirtualTour("prev", "right")}
                    >
                      <ChevronLeft />
                    </button>
                    <div className="bg-white px-6 py-1 rounded-md shadow-md line-clamp-1">
                      {formatTimestamp(rightPanelVT?.createdAt)}
                    </div>
                    <button
                      className="bg-white p-1 rounded-md shadow-md"
                      onClick={() => navigateVirtualTour("next", "right")}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                  <button
                    className="absolute top-2 right-2 z-10 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-1.5 shadow-md transition-all duration-200 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent panel click event
                      if (rightViewerRef.current) {
                        rightViewerRef.current.dispose();
                      }
                      setRightPanelVT(null);
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
                    Select another virtual tour to compare an immersive virtual
                    experience.
                  </p>
                </div>
              )}
            </Panel>
          </>
        )}
      </PanelGroup>
      {/* VT selection Dialog */}
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
                tour._id !== virtualTour._id && tour._id !== rightPanelVT?._id
            )
            ?.map((tour) => (
              <VTCard
                key={tour._id}
                tour={tour}
                isSelectionDialog={true}
                buttonOnClick={() => {
                  if (clickedPanel === "right") {
                    setRightPanelVT(tour);
                  }
                  setIsOpenVtSelectionDialog(false);
                }}
              />
            ))}
        </div>
      </Dialog>
      {/* Action Selectio Dialog */}
      <Dialog
        isOpen={isOpenActionSelectionDialog}
        onClose={() => setIsOpenActionSelectionDialog(false)}
        title="What you want to do?"
        className="max-w-xl max-h-[500px]"
      >
        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsOpenActionSelectionDialog(false);
              setIsOpenCreateInfospotDialog(true);
            }}
            className="w-full p-4 flex flex-col items-center justify-center rounded-lg cursor-pointer border border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-600"
          >
            <Info size={30} /> Create Infospot
          </button>
          <button
            onClick={() => {
              setIsOpenActionSelectionDialog(false);
              setIsOpenCreateTaskDialog(true);
            }}
            className="w-full p-4 flex flex-col items-center justify-center rounded-lg cursor-pointer border border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-600"
          >
            <Bug size={30} /> Create Task
          </button>
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
        <form className="flex flex-col gap-2">
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
              onClick={(e) => {
                e.preventDefault();
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
                onClick={(e) => handleCreateInfospot(e)}
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
                className="flex items-center justify-center w-full p-2 bg-blue-500 text-white disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-md hover:bg-blue-600 transition"
                disabled={editingInfospot}
                onClick={(e) => {
                  handleUpdateInfospot(e);
                }}
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
        isLoading={loadingInfospots}
        onRefresh={() => {
          loadInfospots(virtualTour?._id, setMainVtInfospots);
          loadInfospots(rightPanelVT?._id, setRightPanelVtInfospots);
        }}
      >
        <div className="space-y-2">
          {[
            {
              id: 1,
              title: "Left Panel Infospots",
              data: mainVtInfospots,
            },
            {
              id: 2,
              title: "Right Panel Infospots",
              data: rightPanelVtInfospots,
              isVisible: isSplitModeOn && rightPanelVT,
              emptyMessage: !rightPanelVT
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
                                  setUpdatingInfospotId(infospot._id);
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
                                onClick={() => {
                                  setSelectedInfospot(infospot);
                                  setIsOpenConfirmDeleteDialog(true);
                                }}
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
              className="flex items-center gap-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-neutral-700 disabled:cursor-not-allowed transition"
              onClick={() =>
                handleDeleteInfospot(
                  selectedInfospot._id,
                  selectedInfospot.frame_id
                )
              }
              disabled={isDeletingInfospot}
            >
              {isDeletingInfospot ? (
                <p className="flex items-center gap-2">
                  <LoaderCircle size={18} className="animate-spin" />
                  <span>Deleting...</span>
                </p>
              ) : (
                <p className="flex items-center gap-2">
                  <Trash2 size={18} />
                  <span>Delete</span>
                </p>
              )}
            </button>
          </div>
        </div>
      </Dialog>
      {/* Create Task dialog */}
      <Dialog
        isOpen={isOpenCreateTaskDialog}
        onClose={() => {
          setIsOpenCreateTaskDialog(false);
        }}
        title={"Create Task"}
        className="max-w-4xl max-h-96 overflow-y-auto"
      >
        <TaskCreationForm />
      </Dialog>
      {/* Infospot Details Dialog */}
      <Dialog
        isOpen={clickedInfospot}
        onClose={() => {
          setClickedInfospot(false);
        }}
        title={clickedInfospot?.title}
        className="max-w-lg max-h-96 overflow-y-auto"
      >
        <p>{clickedInfospot?.description}</p>
      </Dialog>
    </div>
  );
};

export default ShowVirtualTour;
