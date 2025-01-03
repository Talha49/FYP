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

function DualAreaChart({ selectedDate }) {
  const [chartData, setChartData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
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

  const allData = [
    // January 2022
    {
      name: "Alpha Plaza",
      date: "2022-01-02",
      tasks: 150,
      rfi: 40,
    },
    {
      name: "Beta Complex",
      date: "2022-01-02",
      tasks: 130,
      rfi: 50,
    },
    {
      name: "Gamma Towers",
      date: "2022-01-02",
      tasks: 140,
      rfi: 45,
    },
    {
      name: "Delta Residences",
      date: "2022-01-02",
      tasks: 120,
      rfi: 55,
    },
    {
      name: "Epsilon Heights",
      date: "2022-01-02",
      tasks: 160,
      rfi: 35,
    },
    {
      name: "Zeta Apartments",
      date: "2022-01-02",
      tasks: 125,
      rfi: 60,
    },
    {
      name: "Eta Villas",
      date: "2022-01-02",
      tasks: 180,
      rfi: 30,
    },
    {
      name: "Theta Homes",
      date: "2022-01-02",
      tasks: 110,
      rfi: 70,
    },

    // January 2022
    {
      name: "Iota Mall",
      date: "2022-01-04",
      tasks: 155,
      rfi: 42,
    },
    {
      name: "Kappa Towers",
      date: "2022-01-04",
      tasks: 135,
      rfi: 48,
    },
    {
      name: "Lambda Residences",
      date: "2022-01-04",
      tasks: 145,
      rfi: 52,
    },
    {
      name: "Mu Complex",
      date: "2022-01-04",
      tasks: 125,
      rfi: 56,
    },
    {
      name: "Nu Homes",
      date: "2022-01-04",
      tasks: 165,
      rfi: 34,
    },
    {
      name: "Xi Villas",
      date: "2022-01-04",
      tasks: 128,
      rfi: 64,
    },
    {
      name: "Omicron Apartments",
      date: "2022-01-04",
      tasks: 185,
      rfi: 29,
    },
    {
      name: "Pi Estates",
      date: "2022-01-04",
      tasks: 112,
      rfi: 75,
    },

    // December 2022
    {
      name: "Rho Plaza",
      date: "2022-12-11",
      tasks: 290,
      rfi: 110,
    },
    {
      name: "Sigma Residences",
      date: "2022-12-11",
      tasks: 310,
      rfi: 95,
    },
    {
      name: "Tau Homes",
      date: "2022-12-11",
      tasks: 280,
      rfi: 105,
    },
    {
      name: "Upsilon Towers",
      date: "2022-12-11",
      tasks: 300,
      rfi: 100,
    },

    // February 2023
    {
      name: "Phi Complex",
      date: "2023-02-05",
      tasks: 160,
      rfi: 62,
    },
    {
      name: "Chi Heights",
      date: "2023-02-05",
      tasks: 170,
      rfi: 58,
    },
    {
      name: "Psi Villas",
      date: "2023-02-05",
      tasks: 150,
      rfi: 65,
    },
    {
      name: "Omega Homes",
      date: "2023-02-05",
      tasks: 180,
      rfi: 54,
    },
    {
      name: "Zenith Plaza",
      date: "2023-02-05",
      tasks: 175,
      rfi: 61,
    },
    {
      name: "Apex Residences",
      date: "2023-02-05",
      tasks: 155,
      rfi: 66,
    },
    {
      name: "Summit Towers",
      date: "2023-02-05",
      tasks: 165,
      rfi: 59,
    },
    {
      name: "Vertex Apartments",
      date: "2023-02-05",
      tasks: 140,
      rfi: 70,
    },

    // June 2023
    {
      name: "Zenith Plaza",
      date: "2023-06-15",
      tasks: 260,
      rfi: 88,
    },
    {
      name: "Nadir Villas",
      date: "2023-06-15",
      tasks: 250,
      rfi: 80,
    },
    {
      name: "Pinnacle Complex",
      date: "2023-06-15",
      tasks: 240,
      rfi: 85,
    },
    {
      name: "Acme Residences",
      date: "2023-06-15",
      tasks: 230,
      rfi: 90,
    },
    {
      name: "Crest Towers",
      date: "2023-06-15",
      tasks: 245,
      rfi: 82,
    },
    {
      name: "Peak Homes",
      date: "2023-06-15",
      tasks: 235,
      rfi: 87,
    },
    {
      name: "Crown Villas",
      date: "2023-06-15",
      tasks: 220,
      rfi: 83,
    },
    {
      name: "Apex Plaza",
      date: "2023-06-15",
      tasks: 250,
      rfi: 84,
    },

    // October 2024
    {
      name: "Summit Villas",
      date: "2024-10-01",
      tasks: 300,
      rfi: 120,
    },
    {
      name: "Vertex Heights",
      date: "2024-10-01",
      tasks: 290,
      rfi: 115,
    },
    {
      name: "Peak Residences",
      date: "2024-10-01",
      tasks: 280,
      rfi: 125,
    },
    {
      name: "Crest Towers",
      date: "2024-10-01",
      tasks: 275,
      rfi: 110,
    },
    {
      name: "Apex Plaza",
      date: "2024-10-01",
      tasks: 310,
      rfi: 130,
    },
    {
      name: "Nadir Complex",
      date: "2024-10-01",
      tasks: 265,
      rfi: 117,
    },
    {
      name: "Ali Gardens",
      date: "2024-10-01",
      tasks: 285,
      rfi: 128,
    },
    {
      name: "Faisal Villas",
      date: "2024-10-01",
      tasks: 270,
      rfi: 121,
    },
    {
      name: "Kamran Residences",
      date: "2024-10-01",
      tasks: 295,
      rfi: 119,
    },
    {
      name: "Ahmed Towers",
      date: "2024-10-01",
      tasks: 300,
      rfi: 122,
    },
    {
      name: "Saqib Homes",
      date: "2024-10-01",
      tasks: 310,
      rfi: 123,
    },
    {
      name: "Umar Estates",
      date: "2024-10-01",
      tasks: 280,
      rfi: 127,
    },
    {
      name: "Bilal Apartments",
      date: "2024-10-01",
      tasks: 290,
      rfi: 124,
    },
    {
      name: "Omar Villas",
      date: "2024-10-01",
      tasks: 275,
      rfi: 126,
    },

    // November 2024
    {
      name: "Hassan Complex",
      date: "2024-11-02",
      tasks: 230,
      rfi: 75,
    },
    {
      name: "Fahad Towers",
      date: "2024-11-02",
      tasks: 240,
      rfi: 72,
    },
    {
      name: "Rizwan City",
      date: "2024-11-02",
      tasks: 225,
      rfi: 78,
    },
    {
      name: "Ali Gardens",
      date: "2024-11-02",
      tasks: 250,
      rfi: 70,
    },
    {
      name: "Faisal Villas",
      date: "2024-11-02",
      tasks: 235,
      rfi: 74,
    },
    {
      name: "Kamran Apartments",
      date: "2024-11-02",
      tasks: 245,
      rfi: 76,
    },
    {
      name: "Ahmed Homes",
      date: "2024-11-02",
      tasks: 220,
      rfi: 80,
    },
  ];

  const memoizedAllData = useMemo(() => allData, []);

  useEffect(() => {
    const updateChartData = () => {
      const formattedSelectedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      const filteredData = memoizedAllData.filter(
        (item) => item.date === formattedSelectedDate
      );

      if (filteredData.length > 0) {
        setChartData(filteredData);
        setDataAvailable(true);
      } else {
        setChartData([
          {
            date: formattedSelectedDate,
            sales: 0,
            revenue: 0,
            customers: 0,
          },
        ]);
        setDataAvailable(false);
      }
    };

    updateChartData();
  }, [selectedDate, memoizedAllData]);

  const generatePDF = async () => {
    setGeneratingPDF(true);
    const element = document.getElementById("report-content");
    if (!element) {
      alert("Report content not found!");
      setGeneratingPDF(false);
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");

    // Capture the element using html2canvas
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Set dimensions for the PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Scale height proportionally

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const formattedSelectedDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    pdf.save(`Tasks_Report_${formattedSelectedDate}.pdf`);
    setGeneratingPDF(false);
  };

  function downloadCSV(dataToDownload, fileName) {
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

    setDownloadMenuVisible(!downloadMenuVisible);
  }

  function toggleDownloadMenu() {
    setDownloadMenuVisible((prevState) => !prevState);
  }

  function formatXAxis(tickItem) {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  function customTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p className="label text-purple-400">{`Name: ${payload[0].payload.name}`}</p>
          <p className="desc">{`Tasks: ${payload[0].payload.tasks}`}</p>
          <p className="desc">{`Rfi: ${payload[0].payload.rfi}`}</p>
          <p className="desc">{`Date: ${payload[0].payload.date}`}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <p>Area Chart</p>
        <div className="relative">
          <button
            onClick={toggleDownloadMenu}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded flex items-center text-sm ${
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
                          `Area_chart_report_${
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
                      onClick={() =>
                        downloadCSV(memoizedAllData, "all_data_report.csv")
                      }
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
                      onClick={() => {
                        setIsOpenReportModal(true);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-150"
                    >
                      <BsGraphUpArrow
                        size={18}
                        className="mr-2 text-green-600"
                      />
                      <span>Generate Report</span>
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          {/* Horizontal grid lines only */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          {/* X and Y axes */}
          <XAxis dataKey="date" tickFormatter={formatXAxis} type="category" />
          <YAxis dataKey="rfi" />

          {/* Area chart with smooth curves */}
          <Area
            type="monotone"
            dataKey="tasks"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
          <Area
            type="monotone"
            dataKey="rfi"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.3}
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />

          {/* Tooltip for interaction */}
          <Tooltip content={customTooltip} />

          {/* Custom legend */}
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
      {!dataAvailable && (
        <div style={{ textAlign: "center", marginTop: "10px", color: "#666" }}>
          No data available for{" "}
          {selectedDate.toLocaleString("default", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      )}

      {/* Report Modal */}
      <Dialog
        isOpen={isOpenReportModal}
        onClose={() => {
          setIsOpenReportModal(false);
        }}
        isLeft={false}
        widthClass={"w-[950px] rounded-lg p-4"}
        padding={"p-12"}
        withBlur={true}
        minWidth={950}
      >
        {/* report header */}
        <div className="flex items-center justify-between gap-3 border-b pb-4 mb-4">
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
              onClick={() => {
                setIsOpenReportModal(false);
              }}
            />
          </div>
        </div>
        {/* report Content in Template Here */}
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
              Tasks Report
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
              This report provides information on task progress, including the
              number of tasks completed, their alignment with project
              milestones, and team performance, offering insights into overall
              productivity and workflow efficiency.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-blue-600">
                Total Tasks
              </h2>
              <p className="text-2xl font-bold text-blue-800">
                {chartData
                  .reduce((sum, item) => sum + item.tasks, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-green-600">
                Total RFI's
              </h2>
              <p className="text-2xl font-bold text-green-800">
                {chartData
                  .reduce((sum, item) => sum + item.rfi, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Performance Chart
            </h2>
            <div className="w-full h-64 bg-gray-100 rounded-lg p-4">
              {/* Embed the LineChart component here */}
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  {/* Horizontal grid lines only */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  {/* X and Y axes */}
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    type="category"
                  />
                  <YAxis dataKey="rfi" />

                  {/* Area chart with smooth curves */}
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rfi"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />

                  {/* Tooltip for interaction */}
                  <Tooltip content={customTooltip} />

                  {/* Custom legend */}
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Detailed Data
            </h2>
            <div className="overflow-auto border rounded-lg">
              <table className="w-full text-sm text-left text-gray-800">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Tasks</th>
                    <th className="px-4 py-2">RFI's</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-4 py-2">{item.date}</td>
                      <td className="px-4 py-2">{item.tasks}</td>
                      <td className="px-4 py-2">{item.rfi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default DualAreaChart;
