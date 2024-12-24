"use client";
import React from "react";
import VirtualTourComponent from "./_components/VirtualTour";
import { useSession } from "next-auth/react";
import { ImSpinner8 } from "react-icons/im";

function VirtualTour() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <ImSpinner8 className="text-2xl animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }
  return (
    <>
      <VirtualTourComponent />
    </>
  );
}

export default VirtualTour;
