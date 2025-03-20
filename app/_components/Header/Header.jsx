"use client";
import React, { useState, useEffect } from "react";
import { GiSpaceShuttle } from "react-icons/gi";
import { FaBell, FaQuestion } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { GoLinkExternal } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { ImSpinner8 } from "react-icons/im";
import NotificationsModal from "../Notificationmodal/notification";
import { IoNotificationsCircleOutline } from "react-icons/io5";

function Header() {
  const [showDialog, setShowDialog] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3); // Example notifications count
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();
  // console.log("Session =>", session);

 
  useEffect(() => {
    if (session?.user?.userData?._id) {
      setAuthenticatedUser(session.user.userData);
      fetchNotificationsCount(session.user.userData._id);
    }
  }, [session, pathname]);

  const fetchNotificationsCount = async (userId) => {
    try {
      const response = await fetch(`/api/getNotifications?userId=${userId}&count=true`);
      const data = await response.json();
      if (response.ok) {
        setNotificationsCount(data.count || 0);
      } else {
        console.error("Failed to fetch notifications count:", data.error);
      }
    } catch (error) {
      console.error("Error fetching notifications count:", error);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleBellClick = (e) => {
    e.stopPropagation();
    // Close the notification modal if it's open
    setShowNotifications(true); // Open the notifications modal
    setShowDialog(false); // Close the dialog when the bell is clicked
  };
  const handleCloseModal = () => {
    setShowNotifications(false); // Close the notifications modal
   
  };
  // console.log("Session =>", session);
  // console.log("Authenticated User =>", authenticatedUser);

  const profileImage = authenticatedUser?.image || "/avatar.png";

  return (
    <div className="flex w-full justify-between leading-[60px] border-b px-8 bg-white sticky top-0 z-50 cursor-pointer shadow-sm">
      <div className="flex gap-2 items-center">
        <Image src={"/images/logo.png"} height={50} width={50} />
        <div className="md:text-[16px] sm:text-[12px]">SIJM - Home</div>
      </div>
      {session ? (

        <div
          className="flex items-center gap-2 relative"
          onClick={() => setShowDialog(!showDialog)}
        >
          <span className="text-blue-500  text-base">
            {authenticatedUser?.fullName || "Guest"}
          </span>

          <div className="flex items-center gap-1"> {/* Increased gap for spacing */}
            <div className="bg-blue-500 rounded-full shadow-md overflow-hidden w-fit h-fit">
              <Image
                src={profileImage}
                width={40}
                height={40}
                alt="Profile"
                className="rounded-full object-cover"
              />
            </div>

            <div className="relative ml-1">
              <div className="border border-gray-300 p-1 rounded-full bg-white shadow-md flex items-center justify-center w-9 h-9">
                <IoNotificationsCircleOutline
                  className="text-black text-3xl cursor-pointer hover:text-blue-600 transition"
                  onClick={handleBellClick}
                />
                {notificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </div>
            </div>


          </div>

          {showDialog && (
            <div className="animate-fade-in absolute top-14 right-0 w-[350px] bg-white shadow-lg border border-gray-200 rounded-xl p-4 transform transition-transform duration-300 ease-in-out">
              {authenticatedUser ? (
                <>
                  <div className="flex items-center gap-2">
                    <Image
                      src={profileImage}
                      width={50}
                      height={50}
                      alt="Profile"
                      className="rounded-full object-cover"
                    />
                    <div className="py-4">
                      <p className="font-semibold leading-tight flex items-center gap-1">
                        {authenticatedUser.fullName}
                        <span className="text-xs font-normal shadow-md shadow-neutral-700 border-blue-600 text-white bg-blue-500 px-1 rounded-full">
                          {authenticatedUser?.role?.name}
                        </span>
                      </p>
                      <p className="text-gray-500 leading-tight text-xs">
                        {authenticatedUser.email}
                      </p>
                    </div>
                  </div>
                  <hr className="border-t border-gray-300 my-0" />
                  <div className="flex justify-between text-gray-500 pt-3 text-sm rounded-lg">
                    <button
                      className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 hover:shadow-lg transition-all border border-blue-300 px-2 py-2 text-xs rounded-l-lg text-blue-500 w-full"
                      onClick={() => {
                        router.push("/Profile");
                      }}
                    >
                      <GoLinkExternal className="text-lg" />
                      View Profile
                    </button>
                    <button
                      className="flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 hover:shadow-lg transition-all px-2 py-2 text-xs rounded-r-lg text-white w-full"
                      onClick={handleSignOut}
                    >
                      <CiLogout className="text-lg" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-3">
                    <p className="text-base font-semibold text-gray-800">
                      Welcome to OpenSpace.ai
                    </p>
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
                </>
              )}
            </div>
          )}
        </div>
      ) : status === "loading" ? (
        <button className="px-3 py-2">
          <ImSpinner8 className="animate-spin" />
        </button>
      ) : (
        <Link href="/Auth">
          <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 transition-colors duration-200 rounded-md text-white text-center text-sm font-medium">
            Get Started
          </button>
        </Link>
      )}
      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={handleCloseModal}
        
      />

    </div>
  );
}

export default Header;
