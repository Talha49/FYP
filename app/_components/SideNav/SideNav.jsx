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
import { MdOutlineFileUpload, MdOutlineSpaceDashboard } from "react-icons/md";
import { LuWorkflow } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCaptures, setopenCaptures] = useState(false);
  const [openFieldnote, setopenFieldnote] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [menues, setMenues] = useState([]);

  const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const publicPaths = ["/", "/Auth"];
  console.log("Session =>", session);

  useEffect(() => {
    if (status !== "loading") {
      if (status === "authenticated") {
        // Check if menuPermissions exist and filter the allowed menus
        const menuPermissions =
          session?.user?.userData?.role?.permissions?.menuPermissions
            ?.basicMenu || [];
        const includedMenues = menuPermissions.filter(
          (menu) => menu.included === true
        );
        setMenues(includedMenues);
        if (menues.length <= 0) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }

        // Check if current path is in allowed menus
        const allowedPaths = includedMenues.map((menu) => menu.path);
        if (
          !session?.user?.userData?.role &&
          !allowedPaths.includes(pathName)
        ) {
          if (publicPaths.includes(pathName)) {
            return;
          }
          router.push("/Access-Denied"); // Navigate to the "Access Denied" page
        }
      } else if (status === "unauthenticated") {
        setIsVisible(false);

        if (!publicPaths.includes(pathName)) {
          router.push("/Auth");
        }
      } else {
        setIsVisible(false);
      }
    }
  }, [session, status, pathName, router]);

  // console.log("Menues =>", menues);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className={`${isVisible ? "mr-14" : "hidden"}`}>
      <div
        className={`bg-white shadow-lg h-screen overflow-y-auto scrollbar-hide fixed top-0 pt-16 border-r transition-all  duration-300 z-10
                ${isOpen ? "md:w-52 w-14" : "w-14"} ${
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
              target={
                (menu.name === "Admin" || menu.name === "Workflow") && "_blank"
              }
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
                  {menu.name === "Profile" && <CgProfile />}
                  {menu.name === "Upload Fieldnote" && <MdOutlineFileUpload />}
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
