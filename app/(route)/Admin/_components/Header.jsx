"use client";
import React from 'react';
import { IoMdSearch } from 'react-icons/io';
import { AiOutlineDownload, AiOutlineUserAdd } from 'react-icons/ai';

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className='bg-white rounded-md border-2 border-gray-200 py-4 px-4 mt-4'>
      <div className="flex justify-between lg:flex-row flex-col lg:gap-y-0 gap-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center border rounded px-4 py-2">
            <IoMdSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name or email"
              className="outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-transparent text-gray-600 px-2 py-2 text-sm rounded border border-gray-300">
            Filter by Project
          </button>
          <button className="bg-gray-200 text-gray-600 px-2 text-sm py-2 rounded">
            + Add to projects
          </button>
        </div>
        <div className='flex gap-2'>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-2 text-sm py-2 rounded">
            <AiOutlineDownload /> Download CSV
          </button>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-2 text-sm py-2 rounded">
            <AiOutlineUserAdd /> Invite users
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header;
