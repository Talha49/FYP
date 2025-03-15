"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { GoProjectSymlink } from "react-icons/go";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { LuWorkflow } from "react-icons/lu";
import { PiRadioactive } from "react-icons/pi";
import { IoPricetagsOutline } from "react-icons/io5";
import { TbArrowRoundaboutLeft } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { PiVirtualRealityFill } from "react-icons/pi";
import { MdOutlineFileUpload } from "react-icons/md";
import Dialog from "../Dialog/Dialog";
import FieldNotesModal from "../FieldNotesModal/FieldNotesModal";
import CaptureModal from "../CaptureModal/CaptureModal";

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [menus, setMenus] = useState([]);
  const [openCaptures, setOpenCaptures] = useState(false);
  const [openFieldnote, setOpenFieldnote] = useState(false);

  const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const publicPaths = ["/", "/Auth"];

  console.log("Session =>", session);

  // Memoize menu permissions
  const menuPermissions = useMemo(() => {
    return (
      session?.user?.userData?.role?.permissions?.menuPermissions?.basicMenu ||
      []
    );
  }, [session]);

  const includedMenus = useMemo(() => {
    return menuPermissions.filter((menu) => menu.included);
  }, [menuPermissions]);

  const allowedPaths = useMemo(() => {
    return includedMenus.map((menu) => menu.path);
  }, [includedMenus]);

  useEffect(() => {
    if (status === "loading") return; // Wait until session status is loaded

    if (status === "unauthenticated") {
      // Redirect unauthenticated users to "/Auth" if they're on a protected path
      setIsVisible(false);
      if (!publicPaths.includes(pathName)) {
        router.push("/Auth");
      }
      return;
    }

    if (status === "authenticated") {
      setMenus(includedMenus);
      setIsVisible(includedMenus.length > 0);

      const getFirstPath = (path) => {
        const parts = path.split("/").filter(Boolean); // Split and remove empty segments
        return parts.length > 0 ? `/${parts[0]}` : "/";
      };

      // Redirect if the current path is not in the list of allowed paths
      if (
        !allowedPaths.includes(pathName) &&
        !publicPaths.includes(pathName) &&
        !allowedPaths.includes(getFirstPath(pathName)) // ✅ FIXED: Call the function with pathName
      ) {
        router.push("/Access-Denied");
      }
    }
  }, [status, includedMenus, allowedPaths, pathName, router, publicPaths]);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div className={`${isVisible ? "mr-14" : "hidden"}`}>
      <div
        className={`bg-white shadow-lg h-screen overflow-y-auto scrollbar-hide fixed top-0 pt-16 border-r transition-all duration-300 z-10
          ${isOpen ? "md:w-52 w-14" : "w-14"} ${isVisible ? "" : "hidden"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ul className="list-none p-0 flex flex-col justify-center">
          {menus.map((menu) => (
            <li
              key={menu.id}
              className={`flex items-center hover:bg-blue-200 cursor-pointer ${
                !menu.path && "cursor-not-allowed"
              }`}
              onClick={() => {
                if (!menu.path) {
                  // Open modals based on menu name
                  if (menu.name === "Captures") setOpenCaptures(true);
                  if (menu.name === "FieldNotes") setOpenFieldnote(true);
                }
              }}
            >
              <Link
                href={menu.path || "#"}
                target={
                  (menu.name === "Admin" || menu.name === "Workflow") &&
                  "_blank"
                }
              >
                <div className="flex items-center p-4">
                  {/* Dynamic Icons Based on Menu Name */}
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
                    {menu.name === "Profile" && <CgProfile />}
                    {menu.name === "Upload Fieldnote" && (
                      <MdOutlineFileUpload />
                    )}
                    {/* Add more icons if necessary */}
                  </span>
                  {isOpen && (
                    <span className="ml-4 text-black text-sm hidden md:inline">
                      {menu.name}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Modals */}
        <Dialog
          isOpen={openCaptures}
          onClose={() => setOpenCaptures(false)}
          widthClass="w-[400px]"
        >
          <div>
            <CaptureModal
              title={"Captures"}
              onClose={() => setOpenCaptures(false)}
            />
          </div>
        </Dialog>

        <Dialog
          isOpen={openFieldnote}
          onClose={() => setOpenFieldnote(false)}
          widthClass="w-[600px]"
        >
          <div>
            <FieldNotesModal
              title={"Field Notes"}
              onClose={() => setOpenFieldnote(false)}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SideNav;
