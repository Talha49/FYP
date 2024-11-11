import React, { useState } from "react";
import { PiFileCsv } from "react-icons/pi";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { LiaSortSolid } from "react-icons/lia";
import Table from "@/app/_components/HOC/Table/Table";

function Projects() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);

  const rowsPerPage = 5;

  const users = [
    {
      projectname: "InspectionPro",
      address: "Kiliki, Turkey, Istanbul",
      topcapturer: "1",
      lastcapturer: "1",
      videos: "3",
      photos: "2",
      Scans: "-",
      inspectiontype: "Building Inspection",
      jobstatus: "In Progress",
    },
    {
      projectname: "ConstructionCheck",
      address: "Eminönü, Turkey, Istanbul",
      topcapturer: "2",
      lastcapturer: "2",
      videos: "4",
      photos: "3",
      Scans: "1",
      inspectiontype: "Construction Inspection",
      jobstatus: "Completed",
    },
    {
      projectname: "ElectriSafe",
      address: "Beşiktaş, Turkey, Istanbul",
      topcapturer: "3",
      lastcapturer: "3",
      videos: "5",
      photos: "4",
      Scans: "2",
      inspectiontype: "Electrical Inspection",
      jobstatus: "Scheduled",
    },
    {
      projectname: "PlumbingPro",
      address: "Kadıköy, Turkey, Istanbul",
      topcapturer: "4",
      lastcapturer: "4",
      videos: "6",
      photos: "5",
      Scans: "3",
      inspectiontype: "Plumbing Inspection",
      jobstatus: "In Progress",
    },
    {
      projectname: "HVACInspect",
      address: "Üsküdar, Turkey, Istanbul",
      topcapturer: "5",
      lastcapturer: "5",
      videos: "7",
      photos: "6",
      Scans: "4",
      inspectiontype: "HVAC Inspection",
      jobstatus: "Completed",
    },
    {
      projectname: "FireSafetyFirst",
      address: "Şişli, Turkey, Istanbul",
      topcapturer: "6",
      lastcapturer: "6",
      videos: "8",
      photos: "7",
      Scans: "5",
      inspectiontype: "Fire Safety Inspection",
      jobstatus: "Scheduled",
    },
    {
      projectname: "AccessibilityCheck",
      address: "Beyoğlu, Turkey, Istanbul",
      topcapturer: "7",
      lastcapturer: "7",
      videos: "9",
      photos: "8",
      Scans: "6",
      inspectiontype: "Accessibility Inspection",
      jobstatus: "In Progress",
    },
    {
      projectname: "EnvironmentalInspect",
      address: "Eyüp, Turkey, Istanbul",
      topcapturer: "8",
      lastcapturer: "8",
      videos: "10",
      photos: "9",
      Scans: "7",
      inspectiontype: "Environmental Inspection",
      jobstatus: "Completed",
    },
    {
      projectname: "StructuralSafe",
      address: "Fatih, Turkey, Istanbul",
      topcapturer: "9",
      lastcapturer: "9",
      videos: "11",
      photos: "10",
      Scans: "8",
      inspectiontype: "Structural Inspection",
      jobstatus: "Scheduled",
    },
    {
      projectname: "MechanicalInspect",
      address: "Zeytinburnu, Turkey, Istanbul",
      topcapturer: "10",
      lastcapturer: "10",
      videos: "12",
      photos: "11",
      Scans: "9",
      inspectiontype: "Mechanical Inspection",
      jobstatus: "In Progress",
    },
    {
      projectname: "SafetyFirstInspection",
      address: "Gaziosmanpaşa, Turkey, Istanbul",
      topcapturer: "11",
      lastcapturer: "11",
      videos: "13",
      photos: "12",
      Scans: "10",
      inspectiontype: "Electrical Inspection",
      jobstatus: "Completed",
    },
    {
      projectname: "BuildingInspectionPro",
      address: "Sultanbeyli, Turkey, Istanbul",
      topcapturer: "12",
      lastcapturer: "12",
      videos: "14",
      photos: "13",
      Scans: "11",
      inspectiontype: "Plumbing Inspection",
      jobstatus: "Scheduled",
    },
    {
      projectname: "ConstructionInsight",
      address: "Sultangazi, Turkey, Istanbul",
      topcapturer: "13",
      lastcapturer: "13",
      videos: "15",
      photos: "14",
      Scans: "12",
      inspectiontype: "HVAC Inspection",
      jobstatus: "In Progress",
    },
    {
      projectname: "ElectricalInspectionExpert",
      address: "Başakşehir, Turkey, Istanbul",
      topcapturer: "14",
      lastcapturer: "14",
      videos: "16",
      photos: "15",
      Scans: "13",
      inspectiontype: "Electrical Inspection",
      jobstatus: "Completed",
    },
    {
      projectname: "FireSafetyInspectionServices",
      address: "Arnavutköy, Turkey, Istanbul",
      topcapturer: "15",
      lastcapturer: "15",
      videos: "17",
      photos: "16",
      Scans: "14",
      inspectiontype: "Fire Safety Inspection",
      jobstatus: "Scheduled",
    },
  ];

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / rowsPerPage);

  const sortedCurrentUsers = [...currentUsers].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
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
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const headers = [
    { key: "projectname", label: "Project Name", sortable: true },
    { key: "address", label: "Address", sortable: false },
    { key: "topcapturer", label: "Top Capturer", sortable: false },
    { key: "lastcapturer", label: "Last Capture", sortable: false },
    { key: "videos", label: "360° Videos", sortable: false },
    { key: "photos", label: "360° Photos", sortable: false },
    { key: "Scans", label: "3D Scans", sortable: false },
  ];


  return (
    <div>
      <div className=" mx-2 p-2 border border-gray-300 shadow-md rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2 w-full ">
            <div className="w-full md:w-1/4 lg:w-1/6">
              <label className="text-xs text-gray-500" htmlFor="select">
                Projects
              </label>
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
              <label className="text-xs text-gray-500" htmlFor="select">
                Timeframe
              </label>
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
              <label className="text-xs text-gray-500" htmlFor="select">
                Project Status
              </label>
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
            <div className="flex items-center">
              <p className="text-[12px] px-2">
                <span>{indexOfFirstUser + 1}</span> -{" "}
                <span>{Math.min(indexOfLastUser, users.length)}</span> of{" "}
                <span>{users.length}</span>
              </p>
              <div className="flex items-center mr-2">
                <LuChevronLeft
                  onClick={handlePrevPage}
                  className={`${
                    currentPage === 1 ? "text-gray-300" : "cursor-pointer"
                  }`}
                />
                <LuChevronRight
                  onClick={handleNextPage}
                  className={`${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "cursor-pointer"
                  }`}
                />
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
                <td
                  className="border p-2 flex justify-between items-center text-left"
                  style={{ cursor: "pointer" }}
                >
                  Project Name{" "}
                  <LiaSortSolid onClick={() => handleSort("projectname")} />
                </td>
                <td className="border p-2 text-left">Address</td>
                <td className="border p-2 text-left">Top Capturer</td>
                <td className="border p-2 text-left">Last Capture</td>
                <td className="border p-2 text-left">360&deg; Videos</td>
                <td className="border p-2 text-left">360&deg; Photos</td>
                <td className="border p-2 text-left">3D Scans</td>
              </tr>
            </thead>
            <tbody className="text-sm">
              {sortedCurrentUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{user.projectname}</td>
                  <td className="border p-2">{user.address}</td>
                  <td className="border p-2">{user.topcapturer}</td>
                  <td className="border p-2">{user.lastcapturer}</td>
                  <td className="border p-2">{user.videos}</td>
                  <td className="border p-2">{user.photos}</td>
                  <td className="border p-2">{user.Scans}</td>
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

export default Projects;
