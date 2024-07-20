"use client"
import React, { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { GoProjectSymlink } from "react-icons/go";
import { GiWorld } from "react-icons/gi";
import { IoPricetagsOutline } from "react-icons/io5";
import { TbArrowRoundaboutLeft } from "react-icons/tb";
import { RiAdminLine } from "react-icons/ri";
import { PiRadioactive } from "react-icons/pi";
import Link from 'next/link';
const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  

   const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`bg-white shadow-lg h-screen fixed transition-all duration-300 z-10
                  ${isOpen ? 'md:w-36 w-12' : 'md:w-12 w-12'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="list-none p-0 ">
        
          <Link href="/" className="flex items-center hover:bg-blue-200">
          <li className='flex items-center p-4  cursor-pointer'>
            <FaHome className="text-blue-400 text-xl" />
            {isOpen && <span className="ml-4 text-black hidden md:inline">Home</span>}
        </li>
        </Link>
          <Link href="/Projects" className='flex items-center hover:bg-blue-200 '>
          <li className="flex items-center p-4  cursor-pointer ">
            <GoProjectSymlink className="text-blue-400 text-xl" />
            {isOpen && <span className="ml-4 text-black hidden md:inline">Projects</span>}
            </li>
          </Link>
        
        
          <Link href="/Admin" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4  cursor-pointer">
            <RiAdminLine className="text-blue-400 text-xl" />
            {isOpen && <span className="ml-4 text-black hidden md:inline">Admin</span>}
            </li>
          </Link>
        
        <hr/>
        
          <Link href="/Active" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4  cursor-pointer">
            <PiRadioactive className="text-blue-400 text-xl" />
            {isOpen && <span className="ml-4 text-black hidden md:inline">Active</span>}
            </li>
          </Link>
       
        
          <Link href="/settings" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4  cursor-pointer">
            <IoPricetagsOutline className="text-blue-400 text-xl" />
            {isOpen && <span className="ml-4 text-black hidden md:inline">Settings</span>}
        
        </li>
       </Link>
       
          <Link href="/settings" className="flex items-center hover:bg-blue-200">
          <li className="flex items-center p-4 cursor-pointer">
            <TbArrowRoundaboutLeft className="text-blue-400 text-xl" />
            {isOpen && <span className="ml-4 text-black hidden md:inline">About</span>}
            </li>
          </Link>
     
      </ul>
    </div>
  );
};

export default SideNav;