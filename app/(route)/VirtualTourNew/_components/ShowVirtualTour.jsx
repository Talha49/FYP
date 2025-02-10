import React, { useEffect, useRef } from "react";
import * as PANOLENS from "panolens";

const ShowVirtualTour = ({ virtualTour }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const panoramasRef = useRef({});

  useEffect(() => {
    if (!virtualTour?.frames?.length) return;

    // Ensure cleanup before re-initializing
    if (viewerRef.current) {
      viewerRef.current.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = ""; // ✅ Check if it's not null
      }
    }

    // Initialize PANOLENS Viewer
    viewerRef.current = new PANOLENS.Viewer({
      container: containerRef.current,
      autoRotate: false,
      controlBar: true,
    });

    // Create panoramas for each frame
    virtualTour.frames.forEach((frame, index) => {
      const panorama = new PANOLENS.ImagePanorama(frame.url);

      panorama.addEventListener("load", () => {
        console.log(`Loaded frame ${index + 1}`);
      });

      panoramasRef.current[frame._id] = panorama;

      // Add navigation hotspots
      if (index > 0) {
        addHotspot(panorama, virtualTour.frames[index - 1], "Back", -5000);
      }
      if (index < virtualTour.frames.length - 1) {
        addHotspot(panorama, virtualTour.frames[index + 1], "Next", 5000);
      }
    });

    // Set first panorama
    const firstPanorama = panoramasRef.current[virtualTour.frames[0]._id];
    viewerRef.current.add(firstPanorama);
    viewerRef.current.setPanorama(firstPanorama);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = ""; // ✅ Safe check to avoid the error
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
        viewerRef.current.setPanorama(nextPanorama);
      } else {
        console.error("Next panorama not found!");
      }
    });

    panorama.add(hotspot);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-black"
      style={{ position: "relative", overflow: "hidden" }}
    />
  );
};

export default ShowVirtualTour;
