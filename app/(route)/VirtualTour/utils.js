import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  // Format date as YYYY-MM-DD
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  // Format time as HH:MM AM/PM
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} at ${formattedTime}`;
}

const infospotCache = new Map();
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export async function fetchInfospots(id) {
  try {
    const cacheEntry = infospotCache.get(id);

    // Check if data exists and is not expired
    if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION_MS) {
      console.log("Returning cached infospots:", cacheEntry.data);
      return cacheEntry.data;
    }

    // Fetch from API if not in cache or expired
    const response = await fetch(`/api/infospot/get/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch infospots: ${response.statusText}`);
    }

    const data = await response.json();
    const infospots = data.infospots || [];

    // Store in cache with a timestamp
    infospotCache.set(id, { data: infospots, timestamp: Date.now() });

    console.log("Fetched from API:", infospots);
    return infospots;
  } catch (error) {
    console.error("Error fetching infospots:", error);
    return [];
  }
}

export async function deleteInfospot(id) {
  try {
    const response = await fetch(`/api/infospot/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete infospot: ${response.statusText}`);
    }
    console.log("Infospot deleted successfully");
    const data = await response.json();
    return data.deletedInfospot;
  } catch (error) {
    console.error("Error deleting infospot:", error);
  }
}

export async function updateInfospot(id, data) {
  try {
    const response = await fetch(`/api/infospot/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update infospot: ${response.statusText}`);
    }
    const resData = await response.json();
    return resData.updatedInfospot;
  } catch (error) {
    console.error("Error updating infospot:", error);
  }
}

const rfiCache = new Map();

export const fetchRFIs = async (id) => {
  try {
    const cacheEntry = rfiCache.get(id);

    // Check if cached data is valid
    if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION_MS) {
      console.log("Returning cached RFIs:", cacheEntry.data);
      return cacheEntry.data;
    }

    // Fetch from API if cache is empty/expired
    const res = await fetch(`/api/New/GetVtTasks/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch RFIs: ${res.statusText}`);
    }

    const data = await res.json();
    const rfis = data.rfis || [];

    // Store response in cache
    rfiCache.set(id, { data: rfis, timestamp: Date.now() });

    console.log("Fetched from API:", rfis);
    return rfis;
  } catch (error) {
    console.error("Error fetching RFIs:", error);
    return []; // Return an empty array on failure
  }
};

export const driverObj = driver({
  animate: true,
  showProgress: true,
  showButtons: ["next", "previous", "close"],
  steps: [
    {
      element: "#auto-rotate",
      popover: {
        title: "Auto Rotate",
        description:
          "Here you can start and stop auto-rotating of virtual content",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#split-mode",
      popover: {
        title: "Split Mode",
        description:
          "You can split the screen up to three panels to compare the virtual tours",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#view-infospots",
      popover: {
        title: "View Infospots",
        description:
          "View all the infospots you have added to the virtual tour",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "#vt-panel",
      popover: {
        title: "Navigation",
        description: "Click on arrows to navigate within virtual tour",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#vt-panel",
      popover: {
        title: "Add Infospot",
        description: "Rigt click to add infospot to the virtual tour",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#vt-date",
      popover: {
        title: "Navigate Dates",
        description:
          "You can navigate between virtual tours of different dates",
        side: "top",
        align: "left",
      },
    },
    {
      element: "#learn",
      popover: {
        title: "Learn How to operate",
        description: "Click here to learn how to operate the virtual tour",
        side: "bottom",
        align: "center",
      },
    },
  ],
});
