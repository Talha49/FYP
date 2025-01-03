"use client";
import React, { useState, useEffect } from "react";
import { GiSpaceShuttle } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { GoLinkExternal } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { ImSpinner8 } from "react-icons/im";

function Header() {
  const [showDialog, setShowDialog] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();
  // console.log("Session =>", session);

  useEffect(() => {
    setAuthenticatedUser(session?.user?.userData);
  }, [session, pathname]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
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

          <div className="bg-blue-500 rounded-full shadow-md overflow-hidden w-fit h-fit">
            <Image
              src={profileImage}
              width={40}
              height={40}
              alt="Profile"
              className="rounded-full object-cover"
            />
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
    </div>
  );
}

export default Header;
