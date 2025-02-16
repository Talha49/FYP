"use client";
import React, { useEffect, useRef, useState } from "react";
import * as PANOLENS from "panolens";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SwitchButton from "./SwitchButton";
import { CirclePlus, Plus } from "lucide-react";
import Dialog from "./Dialog";
import { useSelector } from "react-redux";
import VTCard from "./VTCard";

const ShowVirtualTour = ({ virtualTour }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const panoramasRef = useRef({});
  const resizeObserverRef = useRef(null);
  const [isSplitModeOn, setIsSplitModeOn] = useState(false);
  const [isOpenVtSelectionDialog, setIsOpenVtSelectionDialog] = useState(false);
  const { virtualTours, loading, error } = useSelector((state) => state.VTour);

  useEffect(() => {
    if (!virtualTour?.frames?.length) return;

    // Ensure container exists before initializing PANOLENS
    const container = containerRef.current;
    if (!container) {
      console.error("Container ref is null. Delaying initialization...");
      return;
    }

    // Cleanup previous viewer if it exists
    if (viewerRef.current) {
      viewerRef.current.dispose();
      if (container) container.innerHTML = "";
    }

    try {
      // Initialize PANOLENS Viewer
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
        // horizontalView: true,
      });

      // Create and store panoramas
      virtualTour.frames.forEach((frame, index) => {
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
            virtualTour.frames[index - 1],
            "Move Back",
            -5000
          );
        }
        if (index < virtualTour.frames.length - 1) {
          addHotspot(
            panorama,
            virtualTour.frames[index + 1],
            "Move Forward",
            5000
          );
        }
      });

      // Set the first panorama with a fade transition
      const firstPanorama = panoramasRef.current[virtualTour.frames[0]._id];
      if (firstPanorama) {
        viewerRef.current.setPanorama(firstPanorama, 1000);
      }

      // Setup ResizeObserver for container
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (viewerRef.current) {
            viewerRef.current.onWindowResize();
          }
        }
      });

      // Start observing container size changes
      resizeObserverRef.current.observe(container);
    } catch (error) {
      console.error("WebGL error:", error);
    }

    return () => {
      // Cleanup
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (viewerRef.current) {
        viewerRef.current.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      }
    };
  }, [virtualTour]);

  // Function to add navigation hotspot
  const addHotspot = (panorama, targetFrame, text, xOffset) => {
    const hotspot = new PANOLENS.Infospot(400, PANOLENS.DataImage.Arrow);
    hotspot.position.set(xOffset, 0, 0);
    hotspot.addHoverText(text);

    hotspot.addEventListener("click", () => {
      console.log(`Navigating to frame: ${targetFrame._id}`);

      const nextPanorama = panoramasRef.current[targetFrame._id];
      if (nextPanorama) {
        viewerRef.current.setPanorama(nextPanorama, 1000);
      } else {
        console.error("Next panorama not found!");
      }
    });

    panorama.add(hotspot);
  };

  // Simplified resize handler using PANOLENS built-in method
  const handleResize = () => {
    if (viewerRef.current) {
      viewerRef.current.onWindowResize();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center mb-4 gap-2 absolute top-3.5 right-20 z-20">
        <h1
          className={`${
            isSplitModeOn ? "text-blue-500" : "text-black"
          } text-xl transition-all `}
        >
          Split Mode
        </h1>
        <SwitchButton
          checked={isSplitModeOn}
          onChange={(value) => setIsSplitModeOn(value)}
        />
      </div>
      {/* <div
        ref={containerRef}
        className="w-full flex-1 bg-black shadow-md "
        style={{
          position: "relative",
          overflow: "hidden",
          touchAction: "none",
        }}
      /> */}
      <PanelGroup
        direction="horizontal"
        className="h-screen border "
        onLayout={handleResize}
      >
        {/* Left panel */}
        <Panel defaultSize={50} minSize={20} maxSize={80}>
          <div
            ref={containerRef}
            className="w-full h-full bg-black shadow-md "
            style={{
              position: "relative",
              overflow: "hidden",
              touchAction: "none",
            }}
          />
        </Panel>
        {isSplitModeOn && (
          <>
            <PanelResizeHandle className="w-1 bg-neutral-100 hover:bg-blue-600 transition-all cursor-col-resize" />

            {/* Right Panel */}
            <Panel
              defaultSize={50}
              minSize={0}
              maxSize={80}
              className="flex bg-neutral-300"
            >
              <PanelGroup direction="vertical">
                {/* Top Panel */}
                <Panel
                  defaultSize={50}
                  minSize={20}
                  maxSize={80}
                  className="group flex items-center justify-center bg-neutral-300 bg-opacity-70 transition-all hover:bg-black hover:bg-opacity-70 backdrop-blur-md cursor-pointer"
                  onClick={() => setIsOpenVtSelectionDialog(true)}
                >
                  <Plus
                    size={80}
                    className="cursor-pointer text-blue-500 transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600"
                  />
                </Panel>

                <PanelResizeHandle className="h-1 bg-neutral-100 hover:bg-blue-600 transition-all cursor-row-resize" />
                {/* Bottom Panel */}
                <Panel
                  defaultSize={50}
                  minSize={20}
                  maxSize={80}
                  className="group flex items-center justify-center bg-neutral-300 bg-opacity-70 transition-all hover:bg-black hover:bg-opacity-70 backdrop-blur-md cursor-pointer"
                  onClick={() => setIsOpenVtSelectionDialog(true)}
                >
                  <Plus
                    size={80}
                    className="cursor-pointer text-blue-500 transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600"
                  />
                </Panel>
              </PanelGroup>
            </Panel>
          </>
        )}
      </PanelGroup>
      {/* VT Selection Dialog */}
      <Dialog
        isOpen={isOpenVtSelectionDialog}
        onClose={() => {
          setIsOpenVtSelectionDialog(false);
        }}
        title={"Select Virtual Tour"}
        className={"max-w-2xl max-h-[500px]"}
      >
        <div className="grid grid-cols-2 gap-4">
          {virtualTours
            ?.filter((tour) => tour._id !== virtualTour._id)
            ?.map((tour) => (
              <VTCard
                key={tour?._id}
                tour={tour}
                isSelectionDialog={true}
                buttonOnClick={() => {}}
              />
            ))}
        </div>
      </Dialog>
    </div>
  );
};

export default ShowVirtualTour;
