import React, { useState } from "react";
import { PiFileCsv } from "react-icons/pi";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { LiaSortSolid } from "react-icons/lia";
const FieldNotes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(null);
const [sortField, setSortField] = useState(null);
  const rowsPerPage = 5;
  const users = [
    {
      projectname: 'SmartInspection',
      createdon: '12-2-2022',
      captureDate: '2-2-2019',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user1@example.com',
      Description: 'This is a sample project.',
      Start: '2022-01-01',
    },
    {
      projectname: 'AIAssistant',
      createdon: '07-07-2023',
      captureDate: '3-4-2020',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user2@example.com',
      Description: 'An AI-powered assistant.',
      Start: '2023-06-01',
    },
    {
      projectname: 'VirtualReality',
      createdon: '05-05-2022',
      captureDate: '1-1-2021',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user3@example.com',
      Description: 'A virtual reality experience.',
      Start: '2022-04-01',
    },
    {
      projectname: 'BlockchainApp',
      createdon: '09-09-2021',
      captureDate: '6-6-2020',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user4@example.com',
      Description: 'A blockchain-based application.',
      Start: '2021-08-01',
    },
    {
      projectname: 'IoTDevice',
      createdon: '11-11-2022',
      captureDate: '7-7-2021',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user5@example.com',
      Description: 'An IoT device for automation.',
      Start: '2022-10-01',
    },
    {
      projectname: 'CyberSecurity',
      createdon: '03-03-2023',
      captureDate: '4-4-2022',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user6@example.com',
      Description: 'A cybersecurity solution.',
      Start: '2023-02-01',
    },
    {
      projectname: 'DataAnalytics',
      createdon: '01-01-2022',
      captureDate: '5-5-2021',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user7@example.com',
      Description: 'A data analytics platform.',
      Start: '2022-02-01',
    },
    {
      projectname: 'CloudComputing',
      createdon: '08-08-2021',
      captureDate: '2-3-2022',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user8@example.com',
      Description: 'A cloud computing service.',
      Start: '2021-07-01',
    },
    {
      projectname: 'ArtificialIntelligence',
      createdon: '04-04-2022',
      captureDate: '1-2-2023',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user9@example.com',
      Description: 'An AI-powered solution.',
      Start: '2022-05-01',
    },
    {
      projectname: 'MachineLearning',
      createdon: '06-06-2023',
      captureDate: '3-5-2022',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user10@example.com',
      Description: 'A machine learning model.',
      Start: '2023-05-01',
    },
    {
      projectname: 'NaturalLanguage',
      createdon: '02-02-2024',
      captureDate: '4-6-2023',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user11@example.com',
      Description: 'A natural language processing tool.',
      Start: '2024-01-01',
    },
    {
      projectname: 'ComputerVision',
      createdon: '10-10-2021',
      captureDate: '5-7-2022',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user12@example.com',
      Description: 'A computer vision application.',
      Start: '2021-11-01',
    },
    {
      projectname: 'RoboticsEngineering',
      createdon: '07-07-2022',
      captureDate: '6-8-2022',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user13@example.com',
      Description: 'A robotics engineering project.',
      Start: '2022-08-01',
    },
    {
      projectname: 'WebDevelopment',
      createdon: '09-09-2023',
      captureDate: '7-9-2023',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user14@example.com',
      Description: 'A web development project.',
      Start: '2023-10-01',
    },
    {
      projectname: 'DataScience',
      createdon: '11-11-2023',
      captureDate: '8-10-2023',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user15@example.com',
      Description: 'A data science project.',
      Start: '2023-12-01',
    },
    {
      projectname: 'Cybernetics',
      createdon: '01-01-2024',
      captureDate: '9-11-2023',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user16@example.com',
      Description: 'A cybernetics project.',
      Start: '2024-02-01',
    },
    {
      projectname: 'InformationSecurity',
      createdon: '03-03-2024',
      captureDate: '10-12-2023',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user17@example.com',
      Description: 'An information security project.',
      Start: '2024-04-01',
    },
    {
      projectname: 'SoftwareEngineering',
      createdon: '05-05-2024',
      captureDate: '11-01-2024',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user18@example.com',
      Description: 'A software engineering project.',
      Start: '2024-06-01',
    },
    {
      projectname: 'Networking',
      createdon: '06-06-2024',
      captureDate: '12-02-2024',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user19@example.com',
      Description: 'A networking project.',
      Start: '2024-07-01',
    },
    {
      projectname: 'DatabaseManagement',
      createdon: '07-07-2024',
      captureDate: '01-03-2024',
      fieldnoteurl: '(link unavailable)',
      creatoremail: 'user20@example.com',
      Description: 'A database management project.',
      Start: '2024-08-01',
    },
  ]

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const sortedCurrentUsers = [...currentUsers].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  

  const totalPages = Math.ceil(users.length / rowsPerPage);

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
            <label className="text-xs text-gray-500" htmlFor="select">ProjectStatus</label>
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
      <div className="min-w-full overflow-x-auto">
        <table className="w-full border-collapse border min-w-[1000px]">
          <thead className="text-sm font-medium text-gray-600">
            <tr className="bg-gray-200">
            <td className="border p-2 flex justify-between items-center text-left" style={{ cursor: 'pointer' }} >
                  Project Name <LiaSortSolid onClick={() => handleSort('projectname')} />
                </td>
              <td className="border p-2 text-left">Created On</td>
              <td className="border p-2 text-left">Capture Date</td>
              <td className="border p-2 text-left">Field Note Url</td>
              <td className="border p-2 text-left">Creator Email</td>
              <td className="border p-2 text-left">Description</td>
              <td className="border p-2 text-left">Start</td>

            </tr>
          </thead>
          <tbody className="text-sm">
            {sortedCurrentUsers.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border p-2">{user.projectname}</td>
                <td className="border p-2">{user.createdon}</td>
                <td className="border p-2">{user.captureDate}</td>
                <td className="border p-2">{user.fieldnoteurl}</td>
                <td className="border p-2">{user.creatoremail}</td>
                <td className="border p-2">{user.Description}</td>
                <td className="border p-2">{user.Start}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default FieldNotes