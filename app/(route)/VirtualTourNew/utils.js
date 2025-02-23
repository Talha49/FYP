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

export async function fetchInfospots(id) {
  try {
    const response = await fetch(`/api/infospot/get/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch infospots: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);

    return data.infospots || []; // Ensure it returns an array
  } catch (error) {
    console.error("Error fetching infospots:", error);
    return []; // Return an empty array instead of undefined
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
    alert("Error deleting infospot");
  }
}
