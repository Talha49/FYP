"use client";
import React, { useEffect, useRef } from "react";
import * as PANOLENS from "panolens";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const ShowVirtualTour = ({ virtualTour }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const panoramasRef = useRef({});
  const resizeObserverRef = useRef(null);

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
        autoRotateSpeed: 1,
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
    <>
      <div
        ref={containerRef}
        className="w-full h-full bg-black shadow-md "
        style={{
          position: "relative",
          overflow: "hidden",
          touchAction: "none",
        }}
      />
      {/* <PanelGroup
        direction="horizontal"
        className="h-screen border "
        onLayout={handleResize}
      >
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

        <PanelResizeHandle className="w-1 bg-neutral-100 hover:bg-blue-600 transition-all cursor-col-resize" />

        <Panel
          defaultSize={50}
          minSize={20}
          maxSize={80}
          className="flex items-center justify-center bg-gray-300"
        >
          <PanelGroup direction="vertical">
            <Panel
              defaultSize={50}
              minSize={20}
              maxSize={80}
              collapsible={true}
              collapsedSize={0}
            >
              top-right
            </Panel>
            <PanelResizeHandle className="h-1 bg-neutral-100 hover:bg-blue-600 transition-all cursor-col-resize" />
            <Panel
              defaultSize={50}
              minSize={20}
              maxSize={80}
              collapsible={true}
              collapsedSize={0}
            >
              bottom-right
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup> */}
    </>
  );
};

export default ShowVirtualTour;
