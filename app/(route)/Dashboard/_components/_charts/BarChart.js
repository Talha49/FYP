import React, { useEffect, useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { PiFileTextThin } from "react-icons/pi";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BsGraphUpArrow } from "react-icons/bs";
import Dialog from "@/app/_components/Dialog/Dialog";
import { ImSpinner3 } from "react-icons/im";
import { MdClose } from "react-icons/md";
import { getTasks } from "@/lib/Features/TaskSlice";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "../_datatable/DetailsModal";

function BarChartComp({ selectedDate }) {
  const [chartData, setChartData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBarData, setSelectedBarData] = useState(null);
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.TaskSlice);
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

  // Fetch tasks when component mounts
  useEffect(() => {
    if (session?.user?.userData?._id) {
      dispatch(getTasks(session.user.userData._id));
    }
  }, [dispatch, session?.user?.userData?._id]);

  // Process filtered tasks based on selected date
  const filteredTasks = useMemo(() => {
    if (!tasks || !selectedDate) return [];

    const formattedSelectedDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    return tasks
      .filter((task) => task.dueDate?.split("T")[0] === formattedSelectedDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return tasks
      .filter((task) => task.dueDate?.split("T")[0] === formattedSelectedDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks, selectedDate]);

  // Update chart data when filtered tasks change
  useEffect(() => {
    if (!filteredTasks.length) {
      setDataAvailable(false);
      setChartData([]);
      return;
    }

    setDataAvailable(true);

    // Aggregate data for visualization
    const aggregatedData = filteredTasks.reduce((acc, task) => {
      // Floor statistics
      if (task.floor === "First") {
        acc.firstFloor = (acc.firstFloor || 0) + 1;
      } else {
        acc.otherFloors = (acc.otherFloors || 0) + 1;
      }

      // Status statistics
      acc[task.status] = (acc[task.status] || 0) + 1;

      // Priority statistics
      acc[`${task.priority}Priority`] =
        (acc[`${task.priority}Priority`] || 0) + 1;
      acc[`${task.priority}Priority`] =
        (acc[`${task.priority}Priority`] || 0) + 1;

      return acc;
    }, {});

    // Transform aggregated data for chart
    const transformedData = [
      {
        name: "Distribution",
        "First Floor": aggregatedData.firstFloor || 0,
        "Other Floors": aggregatedData.otherFloors || 0,
        Completed: aggregatedData.Completed || 0,
        Pending: aggregatedData.Pending || 0,
        "High Priority": aggregatedData.HighPriority || 0,
        "Low Priority": aggregatedData.LowPriority || 0,
      },
    ];

    setChartData(transformedData);
  }, [filteredTasks]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  };

  // Download functions
  const downloadCSV = (data, filename) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      alert("No data available to download");
      return;
    }

    // Create CSV headers
    const headers = Object.keys(data[0]).join(",");

    // Map data to CSV rows
    const csvData = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value.toString().replace(/"/g, '""')}"`) // Escape double quotes
        .join(",")
    );

    // Combine headers and rows
    const csv = [headers, ...csvData].join("\n");

    // Create a Blob and download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename || "chart_data.csv";

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate PDF report
  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      const element = document.getElementById("report-content");
      if (!element) {
        throw new Error("Report content not found");
        throw new Error("Report content not found");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Task_Report_${selectedDate.toISOString().split("T")[0]}.pdf`);
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Task_Report_${selectedDate.toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };
  const handleBarClick = (data, index) => {
    let filteredData = [];
    const category = data.name;

    switch (category) {
      case "First Floor":
        filteredData = filteredTasks.filter((task) => task.floor === "First");
        filteredData = filteredTasks.filter((task) => task.floor === "First");
        break;
      case "Other Floors":
        filteredData = filteredTasks.filter((task) => task.floor !== "First");
        filteredData = filteredTasks.filter((task) => task.floor !== "First");
        break;
      case "Completed":
        filteredData = filteredTasks.filter(
          (task) => task.status === "Completed"
        );
        filteredData = filteredTasks.filter(
          (task) => task.status === "Completed"
        );
        break;
      case "Pending":
        filteredData = filteredTasks.filter(
          (task) => task.status === "Pending"
        );
        filteredData = filteredTasks.filter(
          (task) => task.status === "Pending"
        );
        break;
      case "High Priority":
        filteredData = filteredTasks.filter((task) => task.priority === "High");
        filteredData = filteredTasks.filter((task) => task.priority === "High");
        break;
      case "Low Priority":
        filteredData = filteredTasks.filter((task) => task.priority === "Low");
        filteredData = filteredTasks.filter((task) => task.priority === "Low");
        break;
      default:
        filteredData = filteredTasks;
    }

    setSelectedBarData({
      title: `${category} Tasks`,
      data: filteredData,
      data: filteredData,
    });
    setDetailsModalOpen(true);
  };

  const columns = [
    { header: "Description", key: "description" },
    { header: "Status", key: "status" },
    { header: "Priority", key: "priority" },
    { header: "Floor", key: "floor" },
    {
      header: "Due Date",
      key: "dueDate",
      accessor: (item) => new Date(item.dueDate).toLocaleDateString(),
    },
    { header: "Assignees", key: "assignees" },
  ];
  const toggleDownloadMenu = () => {
    setDownloadMenuVisible((prevState) => !prevState);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-600 leading-tight">
          Task Distribution Chart
        </h2>

        <div className="relative">
          <button
            onClick={toggleDownloadMenu}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded flex items-center text-sm ${
              !dataAvailable && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!dataAvailable}
          >
            <FaDownload size={16} />
            <span>Export</span>
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

      {!dataAvailable ? (
        <div className="text-center py-10 text-gray-500">
          No data available for {selectedDate.toLocaleDateString()}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={800}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="First Floor"
              fill="#8884d8"
              onClick={handleBarClick}
            />
            <Bar
              dataKey="Other Floors"
              fill="#82ca9d"
              onClick={handleBarClick}
            />
            <Bar dataKey="Completed" fill="#ffc658" onClick={handleBarClick} />
            <Bar dataKey="Pending" fill="#ff8042" onClick={handleBarClick} />
            <Bar
              dataKey="High Priority"
              fill="#d0ed57"
              onClick={handleBarClick}
            />
            <Bar
              dataKey="Low Priority"
              fill="#8dd1e1"
              onClick={handleBarClick}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Report Modal */}
      <Dialog
        isOpen={isOpenReportModal}
        onClose={() => setIsOpenReportModal(false)}
        isLeft={false}
        widthClass="w-[950px]"
        padding="p-6"
      >
        <div className="flex justify-between items-center mb-6 border-b p-4">
          <h2 className="text-2xl font-bold">Task Report</h2>
          <div className="flex gap-2">
            {graphicalReport?.included &&
              graphicalReport?.subReports[1]?.expport && (
                <button
                  onClick={generatePDF}
                  disabled={generatingPDF}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  {generatingPDF ? (
                    <>
                      <ImSpinner3 className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FaDownload size={16} />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              )}

            <button
              onClick={() => setIsOpenReportModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        <div id="report-content" className="bg-white p-6">
          {/* Report Header */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={companyLogo}
              alt="Company Logo"
              className="h-20 w-20 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {companyName}
              </h1>
              <p className="text-gray-600">Task Distribution Report</p>
              <p className="text-gray-600">
                Date: {selectedDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Tasks</h3>
              <p className="text-2xl font-bold text-blue-600">
                {filteredTasks.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Completed Tasks</h3>
              <p className="text-2xl font-bold text-green-600">
                {
                  filteredTasks.filter((task) => task.status === "Completed")
                    .length
                }
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">
                High Priority Tasks
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {
                  filteredTasks.filter((task) => task.priority === "High")
                    .length
                }
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Task Distribution Chart
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="First Floor" fill="#8884d8" />
                  <Bar dataKey="Other Floors" fill="#82ca9d" />
                  <Bar dataKey="Completed" fill="#ffc658" />
                  <Bar dataKey="Pending" fill="#ff8042" />
                  <Bar dataKey="High Priority" fill="#d0ed57" />
                  <Bar dataKey="Low Priority" fill="#8dd1e1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Task List */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Task Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Floor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.description || "N/A"}
                        {task.description || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.floor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Dialog>

      <DetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={selectedBarData?.title || "Task Details"}
        columns={columns}
        data={selectedBarData?.data || []}
        contextType="Tasks"
      />
    </div>
  );
}

export default BarChartComp;
