"use client";
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { GoProjectSymlink } from "react-icons/go";
import { GiWorld } from "react-icons/gi";
import { IoPricetagsOutline } from "react-icons/io5";
import { TbArrowRoundaboutLeft } from "react-icons/tb";
import { RiAdminLine } from "react-icons/ri";
import { PiRadioactive } from "react-icons/pi";
import Link from "next/link";
import Dialog from "../Dialog/Dialog";
import FieldNotesModal from "../FieldNotesModal/FieldNotesModal";
import CaptureModal from "../CaptureModal/CaptureModal";
import { PiVirtualRealityFill } from "react-icons/pi";


const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [openCaptures, setopenCaptures] = useState(false);
  const [openFieldnote, setopenFieldnote] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`bg-white shadow-lg h-screen fixed transition-all  duration-300 z-10
                  ${isOpen ? "md:w-44 w-14" : "md:w-12 w-12"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="list-none p-0 flex flex-col  justify-center ">
        <Link href="/" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4  cursor-pointer">
            <FaHome className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black text-sm hidden md:inline">Home</span>
            )}
          </li>
        </Link>
        <Link href="/Projects" className="flex items-center hover:bg-blue-200 ">
          <li className="flex items-center p-4  cursor-pointer ">
            <GoProjectSymlink className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black text-sm hidden md:inline">Projects</span>
            )}
          </li>
        </Link>

        <Link href="/Admin" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4  cursor-pointer">
            <RiAdminLine className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black text-sm hidden md:inline">Admin</span>
            )}
          </li>
        </Link>

        <hr />

        <Link href="/Active" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4  cursor-pointer">
            <PiRadioactive className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black text-sm hidden md:inline">Active</span>
            )}
          </li>
        </Link>

        <Link
          href={""}
          className="flex items-center hover:bg-blue-200"
          onClick={() => {
            setIsOpen(false);
            setopenCaptures(true);
          }}
        >
          <li className="flex items-center p-4  cursor-pointer">
            <IoPricetagsOutline className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black text-sm hidden md:inline">Captures</span>
            )}
          </li>
        </Link>

        <Link
          href={""}
          className="flex items-center hover:bg-blue-200"
          onClick={() => {
            setIsOpen(false);
            setopenFieldnote(true);
          }}
        >
          <li className="flex items-center p-4 cursor-pointer">
            <TbArrowRoundaboutLeft className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black text-sm hidden md:inline">FieldNotes</span>
            )}
          </li>
        </Link>
        <hr />
        <Link
          href={"/VirtualTour"}
          className="flex items-center hover:bg-blue-200"
        >
          <li className="flex items-center p-4 cursor-pointer">
            <PiVirtualRealityFill  className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black text-sm hidden md:inline">Virtual Tour</span>
            )}
          </li>
        </Link>
      </ul>
      <Dialog
        isOpen={openCaptures}
        onClose={() => {
          setopenCaptures(false);
        }}
        widthClass="w-[400px]"
        
      >
        <div><CaptureModal title={"Captures"} onClose={() =>setopenCaptures(false)}/></div>
      </Dialog> 
      <Dialog
        isOpen={openFieldnote}
        onClose={() => {
          setopenFieldnote(false);
        }}
        widthClass="w-[600px]"
        minWidth="500"
      >
        <div><FieldNotesModal title={"Field Notes"} onClose={() =>setopenFieldnote(false)}  /></div>
      </Dialog>
    </div>
  );
};

export default SideNav;
