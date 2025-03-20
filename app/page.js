"use client";
import { useEffect } from "react";
import About from "./_components/About/About";

export default function Home() {
  useEffect(() => {
    const fetchDueTasks = async () => {
      try {
        const response = await fetch("/api/checkDueDate"); // Call the API
        const data = await response.json();
        console.log("🔔 Due Task API Response:", data);
      } catch (error) {
        console.error("❌ Error fetching due tasks:", error);
      }
    };

    // ✅ Run the function every after 1 day 
    const interval = setInterval(fetchDueTasks, 86400000);

    // ✅ Cleanup function to stop the interval when component unmounts
    return () => {
      console.log("🛑 Cleaning up interval...");
      clearInterval(interval);
    };
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <main className="md:ml-0 ml-4">
      <About />
    </main>
  );
}
