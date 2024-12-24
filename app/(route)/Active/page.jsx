"use client"
import React from "react";
import Main from "./_components/Main";
import { useSession } from "next-auth/react";
import { ImSpinner8 } from "react-icons/im";

function Active() {
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
    <div className="ml-5 sm:ml-0">
      <Main />
    </div>
  );
}

export default Active;
