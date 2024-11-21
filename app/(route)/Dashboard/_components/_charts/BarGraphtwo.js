import React, { useEffect, useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { PiFileTextThin } from "react-icons/pi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Dialog from "@/app/_components/Dialog/Dialog";
import { ImSpinner3 } from "react-icons/im";
import { MdClose } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";

function BarGraphtwo({ selectedDate }) {
  const [chartData, setChartData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const companyLogo = "/images/SIJM-LOGO.png";
  const companyName = "Smart Inspection & Job Monitoring System";

  const generatePDF = async () => {
    setGeneratingPDF(true);
    const element = document.getElementById("pd-report-content");
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
    pdf.save(`Progress_&_Defects_Report${formattedSelectedDate}.pdf`);
    setGeneratingPDF(false);
  };

  const allData = [
    // January 2022
    {
      name: "Alpha Plaza",
      date: "2022-01-02",
      progressImprovement: 10,
      defectsReported: 3,
      qualityScore: 8.5,
    },
    {
      name: "Beta Complex",
      date: "2022-01-02",
      progressImprovement: -5,
      defectsReported: 6,
      qualityScore: 6.2,
    },
    {
      name: "Gamma Towers",
      date: "2022-01-02",
      progressImprovement: 7,
      defectsReported: 4,
      qualityScore: 7.9,
    },
    {
      name: "Delta Residences",
      date: "2022-01-02",
      progressImprovement: 3,
      defectsReported: 2,
      qualityScore: 8.1,
    },
    {
      name: "Epsilon Heights",
      date: "2022-01-02",
      progressImprovement: -4,
      defectsReported: 5,
      qualityScore: 6.8,
    },
    {
      name: "Zeta Apartments",
      date: "2022-01-02",
      progressImprovement: 2,
      defectsReported: 1,
      qualityScore: 9.1,
    },
    {
      name: "Eta Villas",
      date: "2022-01-02",
      progressImprovement: -3,
      defectsReported: 7,
      qualityScore: 5.6,
    },
    {
      name: "Theta Homes",
      date: "2022-01-02",
      progressImprovement: 5,
      defectsReported: 2,
      qualityScore: 8.7,
    },

    // January 2022
    {
      name: "Iota Mall",
      date: "2022-01-04",
      progressImprovement: 8,
      defectsReported: 3,
      qualityScore: 7.4,
    },
    {
      name: "Kappa Towers",
      date: "2022-01-04",
      progressImprovement: -6,
      defectsReported: 8,
      qualityScore: 5.2,
    },
    {
      name: "Lambda Residences",
      date: "2022-01-04",
      progressImprovement: 4,
      defectsReported: 2,
      qualityScore: 8.0,
    },
    {
      name: "Mu Complex",
      date: "2022-01-04",
      progressImprovement: -2,
      defectsReported: 5,
      qualityScore: 6.7,
    },
    {
      name: "Nu Homes",
      date: "2022-01-04",
      progressImprovement: 7,
      defectsReported: 3,
      qualityScore: 8.5,
    },
    {
      name: "Xi Villas",
      date: "2022-01-04",
      progressImprovement: -5,
      defectsReported: 7,
      qualityScore: 5.9,
    },
    {
      name: "Omicron Apartments",
      date: "2022-01-04",
      progressImprovement: 9,
      defectsReported: 4,
      qualityScore: 8.9,
    },
    {
      name: "Pi Estates",
      date: "2022-01-04",
      progressImprovement: -7,
      defectsReported: 6,
      qualityScore: 6.1,
    },

    // December 2022
    {
      name: "Rho Plaza",
      date: "2022-12-11",
      progressImprovement: 6,
      defectsReported: 3,
      qualityScore: 7.8,
    },
    {
      name: "Sigma Residences",
      date: "2022-12-11",
      progressImprovement: -3,
      defectsReported: 5,
      qualityScore: 6.5,
    },
    {
      name: "Tau Homes",
      date: "2022-12-11",
      progressImprovement: 2,
      defectsReported: 4,
      qualityScore: 8.2,
    },
    {
      name: "Upsilon Towers",
      date: "2022-12-11",
      progressImprovement: -6,
      defectsReported: 7,
      qualityScore: 5.4,
    },

    // February 2023
    {
      name: "Phi Complex",
      date: "2023-02-05",
      progressImprovement: 8,
      defectsReported: 2,
      qualityScore: 8.4,
    },
    {
      name: "Chi Heights",
      date: "2023-02-05",
      progressImprovement: -5,
      defectsReported: 6,
      qualityScore: 6.1,
    },
    {
      name: "Psi Villas",
      date: "2023-02-05",
      progressImprovement: 9,
      defectsReported: 3,
      qualityScore: 8.6,
    },
    {
      name: "Omega Homes",
      date: "2023-02-05",
      progressImprovement: -4,
      defectsReported: 7,
      qualityScore: 5.7,
    },
    {
      name: "Zenith Plaza",
      date: "2023-02-05",
      progressImprovement: 10,
      defectsReported: 2,
      qualityScore: 9.0,
    },
    {
      name: "Apex Residences",
      date: "2023-02-05",
      progressImprovement: -7,
      defectsReported: 5,
      qualityScore: 6.3,
    },
    {
      name: "Summit Towers",
      date: "2023-02-05",
      progressImprovement: 4,
      defectsReported: 1,
      qualityScore: 8.8,
    },
    {
      name: "Vertex Apartments",
      date: "2023-02-05",
      progressImprovement: -6,
      defectsReported: 8,
      qualityScore: 5.8,
    },

    // June 2023
    {
      name: "Zenith Plaza",
      date: "2023-06-15",
      progressImprovement: 8,
      defectsReported: 2,
      qualityScore: 8.8,
    },
    {
      name: "Nadir Villas",
      date: "2023-06-15",
      progressImprovement: -5,
      defectsReported: 4,
      qualityScore: 6.9,
    },
    {
      name: "Pinnacle Complex",
      date: "2023-06-15",
      progressImprovement: 7,
      defectsReported: 3,
      qualityScore: 8.7,
    },
    {
      name: "Acme Residences",
      date: "2023-06-15",
      progressImprovement: 5,
      defectsReported: 2,
      qualityScore: 8.2,
    },
    {
      name: "Crest Towers",
      date: "2023-06-15",
      progressImprovement: -3,
      defectsReported: 5,
      qualityScore: 7.0,
    },
    {
      name: "Peak Homes",
      date: "2023-06-15",
      progressImprovement: 6,
      defectsReported: 3,
      qualityScore: 8.5,
    },
    {
      name: "Crown Villas",
      date: "2023-06-15",
      progressImprovement: -4,
      defectsReported: 6,
      qualityScore: 6.3,
    },
    {
      name: "Apex Plaza",
      date: "2023-06-15",
      progressImprovement: 9,
      defectsReported: 4,
      qualityScore: 9.1,
    },

    // October 2024
    {
      name: "Summit Villas",
      date: "2024-10-01",
      progressImprovement: 5,
      defectsReported: 3,
      qualityScore: 8.3,
    },
    {
      name: "Vertex Heights",
      date: "2024-10-01",
      progressImprovement: -6,
      defectsReported: 7,
      qualityScore: 6.2,
    },
    {
      name: "Peak Residences",
      date: "2024-10-01",
      progressImprovement: 7,
      defectsReported: 2,
      qualityScore: 8.6,
    },
    {
      name: "Crest Towers",
      date: "2024-10-01",
      progressImprovement: 4,
      defectsReported: 3,
      qualityScore: 7.9,
    },
    {
      name: "Apex Plaza",
      date: "2024-10-01",
      progressImprovement: 9,
      defectsReported: 1,
      qualityScore: 9.2,
    },
    {
      name: "Nadir Complex",
      date: "2024-10-01",
      progressImprovement: -5,
      defectsReported: 6,
      qualityScore: 6.0,
    },
    {
      name: "Ali Gardens",
      date: "2024-10-01",
      progressImprovement: 10,
      defectsReported: 4,
      qualityScore: 8.5,
    },
    {
      name: "Faisal Villas",
      date: "2024-10-01",
      progressImprovement: -3,
      defectsReported: 5,
      qualityScore: 7.2,
    },
    {
      name: "Kamran Residences",
      date: "2024-10-01",
      progressImprovement: 6,
      defectsReported: 2,
      qualityScore: 8.0,
    },
    {
      name: "Ahmed Towers",
      date: "2024-10-01",
      progressImprovement: -2,
      defectsReported: 8,
      qualityScore: 5.5,
    },
    {
      name: "Saqib Homes",
      date: "2024-10-01",
      progressImprovement: 3,
      defectsReported: 4,
      qualityScore: 7.8,
    },
    {
      name: "Umar Estates",
      date: "2024-10-01",
      progressImprovement: -1,
      defectsReported: 9,
      qualityScore: 6.1,
    },
    {
      name: "Bilal Apartments",
      date: "2024-10-01",
      progressImprovement: 2,
      defectsReported: 3,
      qualityScore: 7.0,
    },
    {
      name: "Omar Villas",
      date: "2024-10-01",
      progressImprovement: -4,
      defectsReported: 6,
      qualityScore: 5.7,
    },

    // November 2024
    {
      name: "Hassan Complex",
      date: "2024-11-02",
      progressImprovement: 5,
      defectsReported: 3,
      qualityScore: 8.5,
    },
    {
      name: "Fahad Towers",
      date: "2024-11-02",
      progressImprovement: -2,
      defectsReported: 5,
      qualityScore: 7.0,
    },
    {
      name: "Rizwan City",
      date: "2024-11-02",
      progressImprovement: 7,
      defectsReported: 2,
      qualityScore: 9.0,
    },
    {
      name: "Ali Gardens",
      date: "2024-11-02",
      progressImprovement: 4,
      defectsReported: 4,
      qualityScore: 8.2,
    },
    {
      name: "Kamran Residences",
      date: "2024-11-02",
      progressImprovement: 3,
      defectsReported: 3,
      qualityScore: 8.9,
    },
    {
      name: "Ahmed Towers",
      date: "2024-11-02",
      progressImprovement: -5,
      defectsReported: 7,
      qualityScore: 6.8,
    },
    {
      name: "Saqib Homes",
      date: "2024-11-02",
      progressImprovement: 6,
      defectsReported: 2,
      qualityScore: 8.0,
    },
    {
      name: "Umar Estates",
      date: "2024-11-02",
      progressImprovement: -3,
      defectsReported: 6,
      qualityScore: 5.5,
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
          <p className="intro">{`Progress: ${payload[0].payload.progressImprovement}`}</p>
          <p className="desc">{`Score: ${payload[0].payload.qualityScore}`}</p>
          <p className="desc">{`Defects: ${payload[0].payload.defectsReported}`}</p>
          <p className="desc">{`Date: ${payload[0].payload.date}`}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <p>BarChart</p>
        <div className="relative">
          <button
            onClick={toggleDownloadMenu}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded flex items-center text-sm ${
              !dataAvailable && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!dataAvailable}
          >
            <FaDownload className="mr-1" size={12} />
          </button>
          {downloadMenuVisible && (
            <div className="absolute right-0 mt-2 z-10 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ease-in-out transform origin-top-right">
              <div className="p-2 space-y-1">
                <button
                  onClick={() =>
                    downloadCSV(
                      chartData,
                      `Bar_chart_report_${
                        selectedDate.toISOString().split("T")[0]
                      }.csv`
                    )
                  }
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                >
                  <PiFileTextThin size={18} className="mr-2 text-blue-600" />
                  <span>Extract Chosen Entries</span>
                </button>
                <button
                  onClick={() =>
                    downloadCSV(memoizedAllData, "all_data_report.csv")
                  }
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                >
                  <PiFileTextThin size={18} className="mr-2 text-blue-600" />
                  <span>Retrieve Full Data</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpenReportModal(true);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-150"
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
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatXAxis} type="category" />
          <YAxis />
          <Tooltip content={customTooltip} />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="qualityScore" fill="#8884d8" />
          <Bar dataKey="progressImprovement" fill="#82ca9d" />
          <Bar dataKey="defectsReported" fill="#82ca9d" />
        </BarChart>
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
          id="pd-report-content"
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
              Progress & Defects Report
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
              This report provides a comprehensive overview of the project's
              status, including progress updates with milestone achievements and
              completion percentages, task performance insights, and an analysis
              of identified defects. It highlights key accomplishments, ongoing
              activities, and quality concerns, offering a clear understanding
              of project advancement, productivity, and areas requiring
              attention.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-blue-600">
                Average Progress
              </h2>
              <p className="text-2xl font-bold text-blue-800">
                {chartData.length > 0
                  ? (
                      chartData.reduce(
                        (sum, item) => sum + item.progressImprovement,
                        0
                      ) / chartData.length
                    ).toFixed(2)
                  : "N/A"}
              </p>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-blue-600">
                Average Progress
              </h2>
              <p className="text-2xl font-bold text-blue-800">
                {chartData.length > 0
                  ? (
                      chartData.reduce(
                        (sum, item) => sum + item.qualityScore,
                        0
                      ) / chartData.length
                    ).toFixed(2)
                  : "N/A"}
              </p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-yellow-600">
                Total Defects
              </h2>
              <p className="text-2xl font-bold text-yellow-800">
                {chartData.length > 0
                  ? chartData
                      .reduce((sum, item) => sum + item.defectsReported, 0)
                      .toLocaleString()
                  : "No Data"}
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Performance Chart
            </h2>
            <div className="w-full h-[420px] bg-gray-100 rounded-lg p-4">
              {/* Embed the LineChart component here */}
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    type="category"
                  />
                  <YAxis />
                  <Tooltip content={customTooltip} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  <Bar dataKey="qualityScore" fill="#8884d8" />
                  <Bar dataKey="progressImprovement" fill="#82ca9d" />
                  <Bar dataKey="defectsReported" fill="#82ca9d" />
                </BarChart>
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
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Progress</th>
                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">Defects</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-4 py-2">{item.date}</td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.progressImprovement}</td>
                      <td className="px-4 py-2">{item.qualityScore}</td>
                      <td className="px-4 py-2">{item.defectsReported}</td>
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
export default BarGraphtwo;
