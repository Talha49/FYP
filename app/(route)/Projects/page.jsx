"use client";
import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import ProjectCards from "./_components/ProjectCards";
import { useSession } from "next-auth/react";
import { ImSpinner8 } from "react-icons/im";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
    <section className="w-[95%] sm:w-full mt-10 md:ml-0 ml-5">
      <div className="flex justify-between sm:flex-row flex-col ml-5">
        <div className="text-left">
          <h2 className="font-semibold">Active Projects</h2>
          <p> 3 projects</p>
        </div>
        <div className="flex flex-wrap items-center mr-5">
          <div className="flex items-center border rounded px-4 py-2">
            <IoMdSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search projects by name"
              className="outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-all text-white px-4 py-2 rounded-lg sm:ml-4 ml-2 sm:my-0 my-2">
            <AiOutlinePlus color="white" size={20} />
            New Project
          </button>
        </div>
      </div>

      <div>
        <ProjectCards searchQuery={searchQuery} />
      </div>
    </section>
  );
};

export default Page;
