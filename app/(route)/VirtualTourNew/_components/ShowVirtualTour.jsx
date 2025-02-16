"use client";
import React, { useEffect, useRef, useState } from "react";
import * as PANOLENS from "panolens";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SwitchButton from "./SwitchButton";
import { Info, Plus, SquareSplitHorizontal, X } from "lucide-react";
import Dialog from "./Dialog";
import { useSelector } from "react-redux";
import VTCard from "./VTCard";
import InfospotDrawer from "./InfospotDrawer";

const ShowVirtualTour = ({ virtualTour }) => {
  const mainContainerRef = useRef(null);
  const topContainerRef = useRef(null);
  const bottomContainerRef = useRef(null);
  const mainViewerRef = useRef(null);
  const topViewerRef = useRef(null);
  const bottomViewerRef = useRef(null);
  const mainPanoramasRef = useRef({});
  const topPanoramasRef = useRef({});
  const bottomPanoramasRef = useRef({});
  const resizeObserverRef = useRef(null);
  const [isSplitModeOn, setIsSplitModeOn] = useState(false);
  const [isOpenVtSelectionDialog, setIsOpenVtSelectionDialog] = useState(false);
  const { virtualTours } = useSelector((state) => state.VTour);
  const [clickedPanel, setClickedPanel] = useState(null);
  const [topPanelVT, setTopPanelVT] = useState(null);
  const [bottomPanelVT, setBottomPanelVT] = useState(null);
  const [isOpenInfospotsDrawer, setIsOpenInfospotsDrawer] = useState(false);

  useEffect(() => {
    if (!isSplitModeOn) {
      setTopPanelVT(null);
      setBottomPanelVT(null);
    }
  }, [isSplitModeOn]);

  const initializeViewer = (container, frames, viewerRef, panoramasRef) => {
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
        autoRotate: true,
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

      // Create panoramas
      frames.forEach((frame, index) => {
        const panorama = new PANOLENS.ImagePanorama(frame.url);
        panorama.addEventListener("load", () => {
          console.log(`Loaded frame ${index + 1}`);
        });

        panoramasRef.current[frame._id] = panorama;
        viewerRef.current.add(panorama);

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
      mainPanoramasRef
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
        topPanoramasRef
      );
      if (resizeObserverRef.current && topContainerRef.current) {
        resizeObserverRef.current.observe(topContainerRef.current);
      }
    }
  }, [topPanelVT, isSplitModeOn]);

  // Initialize bottom panel viewer
  useEffect(() => {
    if (isSplitModeOn && bottomPanelVT?.frames?.length) {
      initializeViewer(
        bottomContainerRef.current,
        bottomPanelVT.frames,
        bottomViewerRef,
        bottomPanoramasRef
      );
      if (resizeObserverRef.current && bottomContainerRef.current) {
        resizeObserverRef.current.observe(bottomContainerRef.current);
      }
    }
  }, [bottomPanelVT, isSplitModeOn]);

  const handleResize = () => {
    [mainViewerRef, topViewerRef, bottomViewerRef].forEach((ref) => {
      if (ref.current) {
        ref.current.onWindowResize();
      }
    });
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
            <SquareSplitHorizontal size={18} />
            Split Mode
          </h1>
          <SwitchButton checked={isSplitModeOn} onChange={setIsSplitModeOn} />
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
        className="h-screen border"
        onLayout={handleResize}
      >
        <Panel defaultSize={50} minSize={20} maxSize={80}>
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
              className="flex bg-neutral-300"
            >
              <PanelGroup direction="vertical">
                <Panel
                  defaultSize={50}
                  minSize={20}
                  maxSize={80}
                  className="group flex items-center justify-center bg-neutral-300 bg-opacity-70 transition-all hover:bg-black hover:bg-opacity-70 backdrop-blur-md cursor-pointer"
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
                      <Plus
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
                  className="group flex items-center justify-center bg-neutral-300 bg-opacity-70 transition-all hover:bg-black hover:bg-opacity-70 backdrop-blur-md cursor-pointer"
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
                      <Plus
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
      <InfospotDrawer
        isOpen={isOpenInfospotsDrawer}
        onClose={() => {
          setIsOpenInfospotsDrawer(false);
        }}
        title={"Infospots"}
        description={"List of infospots you have added to current virtual tour"}
      >
        Hello
      </InfospotDrawer>
    </div>
  );
};

export default ShowVirtualTour;
