"use client";
import React, { useState } from "react";
import { GiSpaceShuttle } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleDialog = () => {
    setShowDialog(!showDialog);
  };

  return (
    <div className="flex w-full justify-between leading-[60px] border-b-2 px-8 bg-white sticky top-0 z-10 cursor-pointer shadow-sm">
      <div className="flex gap-2 items-center">
        <GiSpaceShuttle className="md:text-[35px] sm:text-sm text-blue-400" />
        <div className="md:text-[16px] sm:text-[12px] font-semibold">OpenSpace - Home</div>
      </div>
      <div className="flex items-center gap-2 relative" onClick={handleDialog}>
        <FaQuestion className="text-lg text-gray-600" />
        <div className="bg-slate-400 rounded-full p-1">
          <Image src="/avatar.png" width={35} height={35} alt="Profile" className="rounded-full" />
        </div>
        {showDialog && (
          <div className="absolute top-14 right-0 w-[300px] bg-white shadow-lg border border-gray-200 rounded-lg py-3 px-4 transform transition-transform duration-300 ease-in-out">
            <div className="text-center mb-3">
              <p className="text-base font-semibold text-gray-800">Welcome to OpenSpace.ai</p>
            </div>
            <div className="flex gap-2 mb-3">
              <Link
                href="/Auth"
                className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-400 transition-colors duration-200 py-1.5 rounded-md text-blue-500 text-center text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/Auth"
                className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200 py-1.5 rounded-md text-white text-center text-sm font-medium"
              >
                Register
              </Link>
            </div>
            {/* Uncomment below for additional profile details */}
            {/* <div className="py-4 border-t border-gray-200">
              <p className="font-semibold leading-tight">Muhammad Saleem</p>
              <p className="text-gray-500 leading-tight">saleem@peritus.ae</p>
            </div>
            <hr className="border-t border-gray-300 my-4" />
            <div className="flex justify-between text-gray-500 py-3 px-1 text-sm">
              <Link href="/Profile" className="hover:underline uppercase">View Profile</Link>
              <Link href="/signout" className="hover:underline uppercase">Sign Out</Link>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
