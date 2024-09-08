import React, { useState } from "react";
import { PiFileCsv } from "react-icons/pi";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { LiaSortSolid } from "react-icons/lia";
import Table from "@/app/_components/HOC/Table/Table";

const Captures = () => {
  
  const users = [
    {
    projectname: 'ProjectAlpha',
    capturedate: '2022-01-01',
    uploaded: '100',
    captureremail: 'user1@email.com',
    sheet: 'SheetA',
    type: 'TypeA',
    minutes: '10',
    capture: 'CaptureA',
    },
    {
    projectname: 'ProjectBeta',
    capturedate: '2022-01-02',
    uploaded: '200',
    captureremail: 'user2@email.com',
    sheet: 'SheetB',
    type: 'TypeB',
    minutes: '20',
    capture: 'CaptureB',
    },
    {
    projectname: 'ProjectGamma',
    capturedate: '2022-01-03',
    uploaded: '300',
    captureremail: 'user3@email.com',
    sheet: 'SheetC',
    type: 'TypeC',
    minutes: '30',
    capture: 'CaptureC',
    },
    {
    projectname: 'ProjectDelta',
    capturedate: '2022-01-04',
    uploaded: '400',
    captureremail: 'user4@email.com',
    sheet: 'SheetD',
    type: 'TypeD',
    minutes: '40',
    capture: 'CaptureD',
    },
    {
    projectname: 'ProjectEpsilon',
    capturedate: '2022-01-05',
    uploaded: '500',
    captureremail: 'user5@email.com',
    sheet: 'SheetE',
    type: 'TypeE',
    minutes: '50',
    capture: 'CaptureE',
    },
    {
    projectname: 'ProjectZeta',
    capturedate: '2022-01-06',
    uploaded: '600',
    captureremail: 'user6@email.com',
    sheet: 'SheetF',
    type: 'TypeF',
    minutes: '60',
    capture: 'CaptureF',
    },
    {
    projectname: 'ProjectEta',
    capturedate: '2022-01-07',
    uploaded: '700',
    captureremail: 'user7@email.com',
    sheet: 'SheetG',
    type: 'TypeG',
    minutes: '70',
    capture: 'CaptureG',
    },
    {
    projectname: 'ProjectTheta',
    capturedate: '2022-01-08',
    uploaded: '800',
    captureremail: 'user8@email.com',
    sheet: 'SheetH',
    type: 'TypeH',
    minutes: '80',
    capture: 'CaptureH',
    },
    {
    projectname: 'ProjectIota',
    capturedate: '2022-01-09',
    uploaded: '900',
    captureremail: 'user9@email.com',
    sheet: 'SheetI',
    type: 'TypeI',
    minutes: '90',
    capture: 'CaptureI',
    },
    {
    projectname: 'ProjectKappa',
    capturedate: '2022-01-10',
    uploaded: '1000',
    captureremail: 'user10@email.com',
    sheet: 'SheetJ',
    type: 'TypeJ',
    minutes: '100',
    capture: 'CaptureJ',
    },
    {
    projectname: 'ProjectLambda',
    capturedate: '2022-01-11',
    uploaded: '1100',
    captureremail: 'user11@email.com',
    sheet: 'SheetK',
    type: 'TypeK',
    minutes: '110',
    capture: 'CaptureK',
    },
    {
    projectname: 'ProjectMu',
    capturedate: '2022-01-12',
    uploaded: '1200',
    captureremail: 'user12@email.com',
    sheet: 'SheetL',
    type: 'TypeL',
    minutes: '120',
    capture: 'CaptureL',
    },
    {
    projectname: 'ProjectNu',
    capturedate: '2022-01-13',
    uploaded: '1300',
    captureremail: 'user13@email.com',
    sheet: 'SheetM',
    type: 'TypeM',
    minutes: '130',
    capture: 'CaptureM',
    },
    {
    projectname: 'ProjectXi',
    capturedate: '2022-01-14',
    uploaded: '1400',
    captureremail: 'user14@email.com',
    sheet: 'SheetN',
    type: 'TypeN',
    minutes: '140',
    capture: 'CaptureN',
    },
    ];


  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  

  const rowsPerPage = 5;

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;

  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / rowsPerPage);

  
  const sortedCurrentUsers = [...currentUsers].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };
 

  const headers = [
    { key: "projectname", label: "Project Name", sortable: true },
    { key: "capturedate", label: "Capture Date", sortable: false },
    { key: "uploaded", label: "Uploaded", sortable: false },
    { key: "captureremail", label: "Capture Email", sortable: false },
    { key: "sheet", label: "Sheet", sortable: false },
    { key: "type", label: "Type", sortable: false },
    { key: "minutes", label: "Minutes", sortable: false },
    { key: "capture", label: "Capture", sortable: false },
  ];

  return (
    <div>
      <div className=" mx-2 p-2 border border-gray-300 shadow-md rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2 w-full">
            <div className="w-full md:w-1/4 lg:w-1/6">
              <label className="text-xs text-gray-500" htmlFor="select">Projects</label>
              <select
                className="w-full p-2 text-sm text-gray-700 bg-gray-200 border border-gray-300 rounded"
                defaultValue="All"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="w-full md:w-1/4 lg:w-1/6">
              <label className="text-xs text-gray-500" htmlFor="select">Timeframe</label>
              <select
                className="w-full p-2 text-sm text-gray-700 bg-gray-200 border border-gray-300 rounded"
                defaultValue="Last Month"
              >
                <option value="Last Month">Last Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Last Year">Last Year</option>
              </select>
            </div>
            <div className="w-full md:w-1/4 lg:w-1/6">
              <label className="text-xs text-gray-500" htmlFor="select">Project Status</label>
              <select
                className="w-full p-2 text-sm text-gray-700 bg-gray-200 border border-gray-300 rounded"
                defaultValue="Active"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>
          <div className="w-full flex justify-end items-center mt-5 md:w-1/3 lg:w-1/4">
            <div className="flex items-center ">
              <p className="text-[11px] px-2">
                <span>{indexOfFirstUser + 1}</span> - <span>{Math.min(indexOfLastUser, users.length)}</span> of <span>{users.length}</span>
              </p>
              <div className="flex items-center mr-2">
                <LuChevronLeft onClick={handlePrevPage} className={`${currentPage === 1 ? 'text-gray-300' : 'cursor-pointer'}`} />
                <LuChevronRight onClick={handleNextPage} className={`${currentPage === totalPages ? 'text-gray-300' : 'cursor-pointer'}`} />
              </div>
            </div>
            <button className="flex gap-1 items-center text-sm md:w-fit bg-transparent hover:bg-gray-200 transition-all font-medium py-[5px] px-2 rounded-md border border-gray-300 ">
              Export
              <PiFileCsv className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* <div className="min-w-full overflow-x-auto">
          <table className="w-full border-collapse border min-w-[1000px]">
            <thead className="text-sm font-medium text-gray-600">
              <tr className="bg-gray-200">
                <td className="border p-2 flex justify-between items-center text-left" style={{ cursor: 'pointer' }} >
                  Project Name <LiaSortSolid  onClick={() => handleSort('projectname')}/>
                </td>
                <td className="border p-2 text-left">Capture Date</td>
                <td className="border p-2 text-left">Uploaded</td>
                <td className="border p-2 text-left">Capture Email</td>
                <td className="border p-2 text-left">Sheet</td>
                <td className="border p-2 text-left">Type</td>
                <td className="border p-2 text-left">Minutes</td>
                <td className="border p-2 text-left">Capture</td>
              </tr>
            </thead>
            <tbody className="text-sm">
  {sortedCurrentUsers.map((user, index) => (
    <tr key={index} className="hover:bg-gray-50">
      <td className="border p-2">{user.projectname}</td>
      <td className="border p-2">{user.capturedate}</td>
      <td className="border p-2">{user.uploaded}</td>
      <td className="border p-2">{user.captureremail}</td>
      <td className="border p-2">{user.sheet}</td>
      <td className="border p-2">{user.type}</td>
      <td className="border p-2">{user.minutes}</td>
      <td className="border p-2">{user.capture}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div> */}
               <Table
          headers={headers}
          data={sortedCurrentUsers}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />

      </div>
    </div>
  );
};

export default Captures;
