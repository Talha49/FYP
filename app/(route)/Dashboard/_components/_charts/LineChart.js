import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiFileTextThin } from "react-icons/pi";
import { ImSpinner3 } from "react-icons/im";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Dialog from "@/app/_components/Dialog/Dialog";
import DetailsModal from "../_datatable/DetailsModal";
import { getTasks } from "@/lib/Features/TaskSlice";

function LineChartComp({ selectedDate }) {
  const [chartData, setChartData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const [tabularReport, setTabularReport] = useState();
  const [graphicalReport, setGraphicalReport] = useState();

  // console.log("Session =>", session);
  // console.log("Tabular Report Permissions =>", tabularReport);
  // console.log("Graphical Report Permissions =>", graphicalReport);

  useEffect(() => {
    const tabRep =
      session?.user?.userData?.role?.permissions?.reportPermissions.find(
        (report) => report.name === "Tabular Report"
      );
    const graphRep =
      session?.user?.userData?.role?.permissions?.reportPermissions.find(
        (report) => report.name === "Graphical Report"
      );
    setTabularReport(tabRep);
    setGraphicalReport(graphRep);
  }, [session, status]);

  const companyLogo = "/images/SIJM-LOGO.png";
  const companyName = "Smart Inspection & Job Monitoring System";

  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.TaskSlice);

  const priorityMap = {
    Low: 40,
    Medium: 65,
    High: 95,
  };

  const formatDate = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    if (session?.user?.userData?.id) {
      dispatch(getTasks(session.user.userData.id));
    }
  }, [dispatch, session?.user?.userData?.id]);

  useEffect(() => {
    const updateChartData = () => {
      const formattedSelectedDate = formatDate(selectedDate);
      const filteredTasks = tasks.filter(
        (task) => formatDate(new Date(task.dueDate)) === formattedSelectedDate
      );

      const taskData = filteredTasks.map((task) => ({
        id: task._id?.$oid || task._id,
        title: task.username || "No Title",
        status: task.status || "No Status",
        date: formattedSelectedDate,
        priority: task.priority,
        priorityValue: priorityMap[task.priority] || 0,
        task: task, // Include full task object
      }));
      setChartData(taskData);
    };

    updateChartData();
  }, [selectedDate, tasks]);

  const handleDataPointClick = (taskDetails) => {
    setSelectedTaskDetails(taskDetails);
    setIsModalOpen(true);
  };
  const generatePDF = async () => {
    setGeneratingPDF(true);
    const element = document.getElementById("report-content");
    if (!element) {
      alert("Report content not found!");
      setGeneratingPDF(false);
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Sales_Report_${selectedDate.toISOString().split("T")[0]}.pdf`);
    setGeneratingPDF(false);
  };

  const downloadCSV = (dataToDownload, fileName) => {
    if (dataToDownload.length === 0) {
      alert("No data available to download");
      return;
    }

    const headers = Object.keys(dataToDownload[0]).join(",");
    const csv = [
      headers,
      ...dataToDownload.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setDownloadMenuVisible(false);
  };

  const toggleDownloadMenu = () => {
    setDownloadMenuVisible((prevState) => !prevState);
  };

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const taskData = payload[0].payload;
      return (
        <div
          onClick={() => handleDataPointClick(taskData)}
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <p className="label text-purple-400">{`Priority: ${taskData.priority}`}</p>
          <p className="desc">{`Task: ${taskData.title}`}</p>
          <p className="desc">{`Status: ${taskData.status}`}</p>
        </div>
      );
    }
    return null;
  };

  const columns = [
    { header: "Task ID", key: "id" },
    { header: "Task Title", key: "title" },
    { header: "Date", key: "date" },
    { header: "Priority", key: "priority" },
    { header: "Status", key: "status" },
  ];

  return (
    <div>
      <div className="flex justify-between mb-2">
        <p>LineChart</p>
        <div className="relative">
          <button
            onClick={toggleDownloadMenu}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded flex items-center justify-center text-sm ${
              !dataAvailable && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!dataAvailable}
          >
            <FaDownload size={12} />
          </button>
          {downloadMenuVisible && (
            <div className="absolute right-0 mt-2 z-10 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ease-in-out transform origin-top-right">
              <div className="p-2 space-y-1">
                {tabularReport?.included &&
                  tabularReport?.subReports[1]?.expport && (
                    <button
                      onClick={() =>
                        downloadCSV(
                          chartData,
                          `priority_chart_report_${
                            selectedDate.toISOString().split("T")[0]
                          }.csv`
                        )
                      }
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                    >
                      <PiFileTextThin
                        size={18}
                        className="mr-2 text-blue-600"
                      />
                      <span>Extract Chosen Entries</span>
                    </button>
                  )}

                {tabularReport?.included &&
                  tabularReport?.subReports[0]?.expport && (
                    <button
                      onClick={() => downloadCSV(tasks, "full_data_report.csv")}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                    >
                      <PiFileTextThin
                        size={18}
                        className="mr-2 text-blue-600"
                      />
                      <span>Retrieve Full Data</span>
                    </button>
                  )}

                {graphicalReport?.included &&
                  graphicalReport?.subReports[1]?.view && (
                    <button
                      onClick={() => setIsOpenReportModal(true)}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-150"
                    >
                      <BsGraphUpArrow
                        size={18}
                        className="mr-2 text-green-600"
                      />
                      <span>View Report</span>
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onClick={(e) => handleDataPointClick(e.payload)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            domain={["dataMin", "dataMax"]}
            type="category"
          />
          <YAxis />
          <Tooltip content={customTooltip} />
          <Legend />
          <Line
            type="monotone"
            dataKey="priorityValue"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            className="cursor-pointer"
          />
        </LineChart>
      </ResponsiveContainer>

      <DetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Task Details"
        columns={columns}
        data={chartData}
      />
      <Dialog
        isOpen={isOpenReportModal}
        onClose={() => setIsOpenReportModal(false)}
        isLeft={false}
        widthClass="w-[950px]"
        padding="p-6"
      >
        {/* Report Modal Content */}
        <div className="flex items-center justify-between gap-3 border-b p-4 mb-4">
          <h1 className="text-2xl font-semibold">Report Preview</h1>
          <div className="flex items-center gap-3">
            {graphicalReport?.included &&
              graphicalReport?.subReports[1]?.expport && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded transition-all px-2 py-1"
                  onClick={generatePDF}
                  disabled={generatingPDF}
                >
                  {generatingPDF ? (
                    <div className="flex items-center gap-2">
                      <ImSpinner3 className="animate-spin" />
                      Downloading...
                    </div>
                  ) : (
                    "Download as PDF"
                  )}
                </button>
              )}

            <MdClose
              className="text-2xl cursor-pointer hover:scale-110"
              onClick={() => setIsOpenReportModal(false)}
            />
          </div>
        </div>

        {/* Report Content */}
        <div
          id="report-content"
          className="bg-white shadow-md rounded-lg p-6 border"
        >
          {/* Report Header */}
          <div className="flex items-center justify-between gap-3 mb-6 border rounded-lg bg-neutral-50 shadow-lg">
            <div className="flex items-center gap-4">
              {companyLogo && (
                <img
                  src={companyLogo}
                  alt={`${companyName} Logo`}
                  className="h-32 w-32 object-contain"
                />
              )}
              <h1 className="text-4xl font-semibold text-blue-700">
                {companyName}
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Task Performance Report
            </h1>
            <p className="text-gray-600">
              Report Date:{" "}
              {selectedDate.toLocaleString("default", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Summary Section */}
          <div className="my-6">
            <h2 className="text-xl font-bold mb-2">Summary</h2>
            <p className="text-gray-600">
              This report highlights key task metrics for the selected date,
              providing insights into task distribution and priority.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-blue-600">
                Total Tasks
              </h2>
              <p className="text-2xl font-bold text-blue-800">
                {chartData.length}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-green-600">
                High Priority
              </h2>
              <p className="text-2xl font-bold text-green-800">
                {chartData.filter((task) => task.priority === "High").length}
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-red-600">
                Low Priority
              </h2>
              <p className="text-2xl font-bold text-red-800">
                {chartData.filter((task) => task.priority === "Low").length}
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={customTooltip} />
              <Legend />
              <Line
                type="monotone"
                dataKey="priorityValue"
                stroke="#8884d8"
                name="Priority Levels"
              />
            </LineChart>
          </ResponsiveContainer>
          <div>
            <h2 classNmae="">Task Details</h2>
            <table className="table-auto w-full border">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="border px-4 py-2">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => (
                  <tr key={row.id}>
                    {columns.map((col) => (
                      <td key={col.key} className="border px-4 py-2">
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default LineChartComp;
