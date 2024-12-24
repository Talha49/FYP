"use client";
import React, { useEffect, useState } from "react";
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
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { LuWorkflow } from "react-icons/lu";
import { useSession } from "@/lib/CustomHooks/useSession";

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCaptures, setopenCaptures] = useState(false);
  const [openFieldnote, setopenFieldnote] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [menues, setMenues] = useState([]);

  const { session, status, isAuthenticated } = useSession();

  useEffect(() => {
    if (isAuthenticated && session.role) {
      setIsVisible(true);
      const includedMenues =
        session?.role?.permissions.menuPermissions?.basicMenu?.filter(
          (menu) => menu.included === true
        );
      setMenues(includedMenues);
      console.log(session);
    } else {
      setIsVisible(false);
    }
  }, [session, status, isAuthenticated]);

  console.log("Menues =>", menues);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className={`${isVisible ? "mr-14" : "hidden"}`}>
      <div
        className={`bg-white shadow-lg h-screen overflow-y-auto custom-scrollbars fixed transition-all  duration-300 z-10
                ${isOpen ? "md:w-48 w-14" : "w-14"} ${
          isVisible ? "" : "hidden"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ul className="list-none p-0 flex flex-col justify-center">
          {menues.map((menu) => (
            <Link
              key={menu.id}
              href={menu.path || ""}
              className={`flex items-center hover:bg-blue-200 ${
                !menu.path && "cursor-not-allowed"
              }`}
              onClick={() => {
                if (!menu.path) {
                  if (menu.name === "Captures") setopenCaptures(true);
                  if (menu.name === "FieldNotes") setopenFieldnote(true);
                }
              }}
            >
              <li className="flex items-center p-4 cursor-pointer">
                {/* Add your custom icons here based on `menu.name` */}
                <span className="icon text-xl">
                  {menu.name === "Home" && <FaHome />}
                  {menu.name === "Dashboard" && <MdOutlineSpaceDashboard />}
                  {menu.name === "Projects" && <GoProjectSymlink />}
                  {menu.name === "Admin" && <RiAdminLine />}
                  {menu.name === "Workflow" && <LuWorkflow />}
                  {menu.name === "Active" && <PiRadioactive />}
                  {menu.name === "Captures" && <IoPricetagsOutline />}
                  {menu.name === "FieldNotes" && <TbArrowRoundaboutLeft />}
                  {menu.name === "VirtualTour" && <PiVirtualRealityFill />}
                  {/* Add more icons as needed */}
                </span>
                {isOpen && (
                  <span className="ml-4 text-black text-sm hidden md:inline">
                    {menu.name}
                  </span>
                )}
              </li>
            </Link>
          ))}
        </ul>

        <Dialog
          isOpen={openCaptures}
          onClose={() => {
            setopenCaptures(false);
          }}
          widthClass="w-[400px]"
        >
          <div>
            <CaptureModal
              title={"Captures"}
              onClose={() => setopenCaptures(false)}
            />
          </div>
        </Dialog>
        <Dialog
          isOpen={openFieldnote}
          onClose={() => {
            setopenFieldnote(false);
          }}
          widthClass="w-[600px]"
          minWidth="500"
        >
          <div>
            <FieldNotesModal
              title={"Field Notes"}
              onClose={() => setopenFieldnote(false)}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SideNav;
