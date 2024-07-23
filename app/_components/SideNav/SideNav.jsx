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
import Dialog from "../CaptureModal/CaptureModal";
import FieldNotesModal from "../FieldNotesModal/FieldNotesModal";
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
      className={`bg-white shadow-lg h-screen fixed transition-all duration-300 z-10
                  ${isOpen ? "md:w-36 w-12" : "md:w-12 w-12"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="list-none p-0 ">
        <Link href="/" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4  cursor-pointer">
            <FaHome className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black hidden md:inline">Home</span>
            )}
          </li>
        </Link>
        <Link href="/Projects" className="flex items-center hover:bg-blue-200 ">
          <li className="flex items-center p-4  cursor-pointer ">
            <GoProjectSymlink className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black hidden md:inline">Projects</span>
            )}
          </li>
        </Link>

        <Link href="/Admin" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4  cursor-pointer">
            <RiAdminLine className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black hidden md:inline">Admin</span>
            )}
          </li>
        </Link>

        <hr />

        <Link href="/Active" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4  cursor-pointer">
            <PiRadioactive className="text-blue-400 text-xl" />
            {isOpen && (
              <span className="ml-4 text-black hidden md:inline">Active</span>
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
              <span className="ml-4 text-black hidden md:inline">Captures</span>
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
              <span className="ml-4 text-black hidden md:inline">FieldNotes</span>
            )}
          </li>
        </Link>
      </ul>
      <Dialog
        isOpen={openCaptures}
        onClose={() => {
          setopenCaptures(false);
        }}
      >
        <h1>Settings</h1>
      </Dialog>
      <Dialog
        isOpen={openFieldnote}
        onClose={() => {
          setopenFieldnote(false);
        }}
        widthClass="w-[600px]"
      >
        <h1><FieldNotesModal title={"Field Notes"}/></h1>
      </Dialog>
    </div>
  );
};

export default SideNav;
