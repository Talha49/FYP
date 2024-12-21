"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { PiFileTextThin } from "react-icons/pi";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Dialog from "@/app/_components/Dialog/Dialog";
import { ImSpinner3 } from "react-icons/im";
import { MdClose } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { fetchUsers } from "@/lib/Features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "../_datatable/DetailsModal";

function AreaChartComponent({ selectedDate }) {
  const [chartData, setChartData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const companyLogo = "/images/SIJM-LOGO.png";
  const companyName = "Smart Inspection & Job Monitoring System";
  const users = useSelector((state) => state.UserSlice.users);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user?.userData?.token) {
      dispatch(fetchUsers(session.user.userData.token));
    }
  }, [dispatch, session?.user?.userData?.token]);

  const processUserData = useMemo(() => {
    if (!users?.length) return [];

    // Group users by hour to show meaningful trends
    const groupedData = users.reduce((acc, user) => {
      if (!user.createdAt) return acc; // Skip users without a valid createdAt
    
      const date = new Date(user.createdAt);
      if (isNaN(date.getTime())) return acc; // Skip invalid dates
    
      const hour = date.getHours();
      const key = `${date.toISOString().split('T')[0]}-${hour}`;
    
      if (!acc[key]) {
        acc[key] = {
          date: date.toISOString().split('T')[0],
          hour,
          time: `${hour.toString().padStart(2, '0')}:00`,
          totalUsers: 0,
          usersByCity: 0,
          socialLoginUsers: 0,
          users: [],
        };
      }
    
      acc[key].totalUsers += 1;
      acc[key].usersByCity += user.city ? 1 : 0;
      acc[key].socialLoginUsers += user.isSocialLogin ? 1 : 0;
      acc[key].users.push(user);
    
      return acc;
    }, {});
    

    return Object.values(groupedData).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });
  }, [users]);

  useEffect(() => {
    if (selectedDate && processUserData.length > 0) {
      const formattedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      ).toISOString().split('T')[0];

      const filteredData = processUserData.filter(
        (item) => item.date === formattedDate
      );

      setChartData(filteredData);
      setDataAvailable(filteredData.length > 0);
    } else {
      setChartData(processUserData);
      setDataAvailable(processUserData.length > 0);
    }
  }, [selectedDate, processUserData]);

  const generatePDF = async () => {
    setGeneratingPDF(true);
    const element = document.getElementById("report-content");

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`User_Analytics_${selectedDate.toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const downloadCSV = (data, filename) => {
    if (!data?.length) {
      alert("No data available to download");
      return;
    }

    const headers = ["Date", "Time", "Total Users", "Users By City", "Social Login Users"];
    const csvContent = [
      headers.join(","),
      ...data.map((item) =>
        [
          item.date,
          item.time,
          item.totalUsers,
          item.usersByCity,
          item.socialLoginUsers
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-semibold text-gray-800">Time: {data.time}</p>
        <p className="text-blue-600">Total Users: {data.totalUsers}</p>
        <p className="text-green-600">Users by City: {data.usersByCity}</p>
        <p className="text-purple-600">Social Login Users: {data.socialLoginUsers}</p>
        <p className="text-sm text-gray-500 mt-2">Click for detailed view</p>
      </div>
    );
  };

  const handleDataPointClick = (data) => {
    if (data && data.users && data.users.length > 0) {
      setSelectedUser({
        ...data,
        users: data.users.map(user => ({
          ...user,
          isSocialLogin: !!user.isSocialLogin // Ensure boolean value
        }))
      });
      setIsModalOpen(true);
    }
  };
  const columns = [
    { 
      header: "User ID", 
      key: "_id",
      accessor: (user) => user._id?.$oid || user._id || 'N/A'
    },
    { 
      header: "Name", 
      key: "fullName",
      accessor: (user) => user.fullName || 'N/A'
    },
    { 
      header: "City", 
      key: "city",
      accessor: (user) => user.city || 'N/A'
    },
    { 
      header: "Contact", 
      key: "contact",
      accessor: (user) => user.contact || 'N/A'
    },
    { 
      header: "Social Login", 
      key: "isSocialLogin",
      accessor: (user) => user.isSocialLogin ? "Yes" : "No"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-600">User Analytics Area</h2>
        <div className="relative">
          <button
            onClick={() => setDownloadMenuVisible(!downloadMenuVisible)}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded flex items-center text-sm ${
              !dataAvailable && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!dataAvailable}
          >
            <FaDownload size={16} />
            <span>Export</span>
          </button>

          {downloadMenuVisible && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-10">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => downloadCSV(chartData, `user_analytics_${selectedDate?.toISOString().split("T")[0] || 'all'}`)}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
                >
                  <PiFileTextThin size={18} className="mr-2 text-blue-600" />
                  <span>Export Current View</span>
                </button>
                <button
                  onClick={() => downloadCSV(processUserData, 'complete_user_analytics')}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
                >
                  <PiFileTextThin size={18} className="mr-2 text-blue-600" />
                  <span>Export All Data</span>
                </button>
                <button
                  onClick={() => setIsOpenReportModal(true)}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg"
                >
                  <BsGraphUpArrow size={18} className="mr-2 text-green-600" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart 
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onClick={(e) => e?.activePayload && handleDataPointClick(e.activePayload[0].payload)}
        >
          <defs>
            <linearGradient id="totalUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="usersByCity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="socialLoginUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time"
            tick={{ fill: '#666' }}
            tickLine={{ stroke: '#666' }}
          />
          <YAxis
            tick={{ fill: '#666' }}
            tickLine={{ stroke: '#666' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="totalUsers"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#totalUsers)"
            name="Total Users"
          />
          <Area
            type="monotone"
            dataKey="usersByCity"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#usersByCity)"
            name="Users by City"
          />
          <Area
            type="monotone"
            dataKey="socialLoginUsers"
            stroke="#ffc658"
            fillOpacity={1}
            fill="url(#socialLoginUsers)"
            name="Social Login Users"
          />
        </AreaChart>
      </ResponsiveContainer>

      {!dataAvailable && (
        <div className="text-center mt-4 text-gray-600">
          No data available for {selectedDate?.toLocaleDateString()}
        </div>
      )}

      <Dialog
        isOpen={isOpenReportModal}
        onClose={() => setIsOpenReportModal(false)}
        isLeft={false}
        widthClass="w-[950px]"
        padding="p-6"
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-semibold">Analytics Report</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={generatePDF}
              disabled={generatingPDF}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              {generatingPDF ? (
                <>
                  <ImSpinner3 className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FaDownload />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              onClick={() => setIsOpenReportModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        <div id="report-content" className="bg-white p-6">
          <div className="flex items-center justify-between mb-8">
            <img src={companyLogo} alt="Company Logo" className="h-16" />
            <h1 className="text-2xl font-bold">{companyName}</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">User Analytics Report</h2>
            <p className="text-gray-600">
              Generated for: {selectedDate?.toLocaleDateString() || 'All Time'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">
                {chartData.reduce((sum, item) => sum + item.totalUsers, 0)}
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-800">Users by City</h3>
              <p className="text-3xl font-bold text-green-600">
                {chartData.reduce((sum, item) => sum + item.usersByCity, 0)}
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Social Login Users</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {chartData.reduce((sum, item) => sum + item.socialLoginUsers, 0)}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Hourly Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Users</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users by City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Social Login Users</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chartData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.totalUsers}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.usersByCity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.socialLoginUsers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Dialog>

      <DetailsModal
        isOpen={isModalOpen}
        columns={columns}
        onClose={() => setIsModalOpen(false)}
        title="User Details"
        data={selectedUser?.users || []}
      />
    </div>
  );
}

export default AreaChartComponent;