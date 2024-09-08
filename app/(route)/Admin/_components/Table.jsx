"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { LiaSortSolid } from "react-icons/lia";

const usersData = [
  {
    name: 'Muhammad Waseem',
    email: 'waseem@peritus.ae',
    jobTitle: 'OpenSpace Partner',
    memberOf: '3 Projects',
    lastLogin: 'Dec 8, 2022',
  },
  {
    name: 'Mehwat Waseem',
    email: 'waseem@peritus.ae',
    jobTitle: 'Manager',
    memberOf: '4 Projects',
    lastLogin: 'Jul 8, 2024',
  },
  {
    name: 'Muhammad Saleem',
    email: 'saleem@peritus.ae',
    jobTitle: 'Manager',
    memberOf: '7 Projects',
    lastLogin: 'Jul 7, 2024',
  },
  {
    name: 'Muhammad Saleem',
    email: 'saleem@peritus.ae',
    jobTitle: 'Manager',
    memberOf: '18 Projects',
    lastLogin: 'Jul 19, 2024',
  },
];

function Table({ searchQuery }) {
  const [users, setUsers] = useState(usersData);
  const [sortOrder, setSortOrder] = useState(null);

  const handleSort = () => {
    let sortedUsers;
    if (sortOrder === 'asc') {
      sortedUsers = [...users].sort((a, b) => b.name.localeCompare(a.name));
      setSortOrder('desc');
    } else {
      sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
      setSortOrder('asc');
    }
    setUsers(sortedUsers);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='mt-4'>
    <div className="overflow-x-auto">
      <div className="min-w-full overflow-x-auto">
        {filteredUsers.length > 0 ? (
          <table className="w-full border-collapse border min-w-[800px]">
            <thead className="text-sm font-medium text-gray-600">
              <tr className="bg-gray-100">
                <td className="border p-2"><input type="checkbox" /></td>
                <td className="border p-2 text-left flex items-center justify-between cursor-pointer">
                  Name <LiaSortSolid onClick={handleSort} />
                </td>
                <td className="border p-2 text-left">Email</td>
                <td className="border p-2 text-left">Job Title</td>
                <td className="border p-2 text-left">Member Of</td>
                <td className="border p-2 text-left">Last Login</td>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2"><input type="checkbox" /></td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.jobTitle}</td>
                  <td className="border p-2">{user.memberOf}</td>
                  <td className="border p-2">{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center mt-4">
  <div className="text-center flex flex-col justify-center max-w-md mx-auto">
    <p className="text-md ">No Matches For Your Results !!</p>
    <Image src='/svg.jpg' width={300} height={300} className="mx-auto md:w-[73%]" />
  </div>
</div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Table;
