import React, { useEffect, useRef } from "react";
import * as PANOLENS from "panolens";

const ShowVirtualTour = ({ virtualTour }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const panoramasRef = useRef({});

  useEffect(() => {
    if (!virtualTour?.frames?.length) return;

    // Cleanup previous viewer if it exists
    if (viewerRef.current) {
      viewerRef.current.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    }

    // Initialize PANOLENS Viewer
    viewerRef.current = new PANOLENS.Viewer({
      container: containerRef.current,
      autoRotate: false,
      controlBar: true,
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
        addHotspot(panorama, virtualTour.frames[index - 1], "Move Back", -5000);
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
      viewerRef.current.setPanorama(firstPanorama, 1000); // Fade duration: 1000ms
    }

    return () => {
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
        viewerRef.current.setPanorama(nextPanorama, 1000); // Smooth fade transition
      } else {
        console.error("Next panorama not found!");
      }
    });

    panorama.add(hotspot);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black rounded-xl shadow-md"
      style={{ position: "relative", overflow: "hidden" }}
    />
  );
};

export default ShowVirtualTour;
