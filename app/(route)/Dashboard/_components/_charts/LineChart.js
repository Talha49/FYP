import Dialog from "@/app/_components/Dialog/Dialog";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiFileTextThin } from "react-icons/pi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
import { ImSpinner3 } from "react-icons/im";

function LineChartComp({ selectedDate }) {
  const [chartData, setChartData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const companyLogo = "/images/SIJM-LOGO.png";
  const companyName = "Smart Inspection & Job Monitoring System";
  // Sample data for 2024 with daily data
  const allData = [
    {
      date: "2024-01-01",
      sales: 3490,
      revenue: 4300,
      customers: 130,
      type: "Retail",
    },
    {
      date: "2024-01-02",
      sales: 1420,
      revenue: 1200,
      customers: 50,
      type: "Retail",
    },
    {
      date: "2024-01-01",
      sales: 5490,
      revenue: 4300,
      customers: 130,
      type: "Retail",
    },
    {
      date: "2024-01-01",
      sales: 490,
      revenue: 430,
      customers: 30,
      type: "Online",
    },
    {
      date: "2024-01-02",
      sales: 3200,
      revenue: 4100,
      customers: 120,
      type: "Retail",
    },
    {
      date: "2024-01-02",
      sales: 200,
      revenue: 8100,
      customers: 20,
      type: "Retail",
    },
    {
      date: "2024-01-03",
      sales: 3100,
      revenue: 4000,
      customers: 110,
      type: "Retail",
    },
    {
      date: "2024-01-04",
      sales: 2900,
      revenue: 3800,
      customers: 100,
      type: "Retail",
    },
    {
      date: "2024-01-05",
      sales: 3300,
      revenue: 4300,
      customers: 140,
      type: "Online",
    },
    {
      date: "2024-02-01",
      sales: 3200,
      revenue: 2300,
      customers: 85,
      type: "Retail",
    },
    {
      date: "2024-02-02",
      sales: 3000,
      revenue: 2100,
      customers: 80,
      type: "Online",
    },
    {
      date: "2024-02-03",
      sales: 2900,
      revenue: 2000,
      customers: 75,
      type: "Retail",
    },
    {
      date: "2024-02-04",
      sales: 3100,
      revenue: 2200,
      customers: 90,
      type: "Online",
    },
    {
      date: "2024-03-01",
      sales: 3200,
      revenue: 4100,
      customers: 130,
      type: "Retail",
    },
    {
      date: "2024-03-02",
      sales: 3000,
      revenue: 3800,
      customers: 120,
      type: "Online",
    },
    {
      date: "2024-03-03",
      sales: 3300,
      revenue: 4200,
      customers: 140,
      type: "Retail",
    },
    {
      date: "2024-04-01",
      sales: 3500,
      revenue: 4300,
      customers: 150,
      type: "Retail",
    },
    {
      date: "2024-04-02",
      sales: 3200,
      revenue: 4000,
      customers: 120,
      type: "Online",
    },
    {
      date: "2024-05-01",
      sales: 3300,
      revenue: 4500,
      customers: 135,
      type: "Retail",
    },
    {
      date: "2024-05-02",
      sales: 3400,
      revenue: 4700,
      customers: 145,
      type: "Online",
    },
    {
      date: "2024-06-01",
      sales: 3700,
      revenue: 5200,
      customers: 150,
      type: "Retail",
    },
    {
      date: "2024-06-02",
      sales: 3500,
      revenue: 4900,
      customers: 140,
      type: "Retail",
    },
    {
      date: "2024-07-01",
      sales: 3900,
      revenue: 5600,
      customers: 165,
      type: "Retail",
    },
    {
      date: "2024-07-02",
      sales: 3700,
      revenue: 5400,
      customers: 150,
      type: "Online",
    },
    {
      date: "2024-08-01",
      sales: 4100,
      revenue: 6000,
      customers: 170,
      type: "Retail",
    },
    {
      date: "2024-08-02",
      sales: 4200,
      revenue: 6100,
      customers: 180,
      type: "Online",
    },
    {
      date: "2024-09-01",
      sales: 4300,
      revenue: 6200,
      customers: 185,
      type: "Retail",
    },
    {
      date: "2024-09-02",
      sales: 4100,
      revenue: 5900,
      customers: 170,
      type: "Online",
    },
    {
      date: "2024-09-21",
      sales: 1300,
      revenue: 4200,
      customers: 125,
      type: "Retail",
    },
    {
      date: "2024-09-22",
      sales: 4100,
      revenue: 5900,
      customers: 160,
      type: "Online",
    },
    {
      date: "2024-09-01",
      sales: 4300,
      revenue: 6200,
      customers: 185,
      type: "Retail",
    },
    {
      date: "2024-09-22",
      sales: 7100,
      revenue: 2900,
      customers: 160,
      type: "Online",
    },
    {
      date: "2024-10-01",
      sales: 4600,
      revenue: 6700,
      customers: 190,
      type: "Retail",
    },
    {
      date: "2024-10-02",
      sales: 4400,
      revenue: 6400,
      customers: 175,
      type: "Online",
    },
    {
      date: "2024-11-01",
      sales: 4700,
      revenue: 6800,
      customers: 200,
      type: "Retail",
    },
    {
      date: "2024-11-02",
      sales: 4500,
      revenue: 6500,
      customers: 190,
      type: "Online",
    },
    {
      date: "2023-12-01",
      sales: 4900,
      revenue: 7100,
      customers: 210,
      type: "Retail",
    },
    {
      date: "2023-12-02",
      sales: 4700,
      revenue: 6800,
      customers: 200,
      type: "Online",
    },
    // Add more days for each month or fill in missing dates as necessary
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
    pdf.save(`Sales_Report_${formattedSelectedDate}.pdf`);
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

  const memoizedYDomain = useMemo(() => {
    const maxSales = Math.max(...memoizedAllData.map((item) => item.sales));
    const maxRevenue = Math.max(...memoizedAllData.map((item) => item.revenue));
    const maxCustomers = Math.max(
      ...memoizedAllData.map((item) => item.customers)
    );
    const overallMax = Math.max(maxSales, maxRevenue, maxCustomers);
    return [0, Math.ceil(overallMax * 1.1)]; // 10% padding
  }, [memoizedAllData]);

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
          <p className="label text-purple-400">{`Sales: ${payload[0].payload.sales}`}</p>
          <p className="intro">{`Revenue: ${payload[0].payload.revenue}`}</p>
          <p className="intro">{`Customers: ${payload[0].payload.customers}`}</p>
          <p className="desc">{`Type: ${payload[0].payload.type}`}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <p>LineChart</p>
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
                      `line_chart_report_${
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

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            domain={["dataMin", "dataMax"]}
            type="category"
          />
          <YAxis domain={memoizedYDomain} />
          <Tooltip content={customTooltip} />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={3}
            dot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
            strokeWidth={3}
            dot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {!dataAvailable && (
        <div style={{ textAlign: "center", marginTop: "10px", color: "#666" }}>
          No data available for{" "}
          {selectedDate.toLocaleString("default", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          .
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
              Sales Performance Report
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
              This report highlights key performance metrics for the selected
              data, providing insights into sales trends, customer behavior, and
              revenue growth.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-blue-600">
                Total Sales
              </h2>
              <p className="text-2xl font-bold text-blue-800">
                $
                {chartData
                  .reduce((sum, item) => sum + item.sales, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-green-600">
                Total Revenue
              </h2>
              <p className="text-2xl font-bold text-green-800">
                $
                {chartData
                  .reduce((sum, item) => sum + item.revenue, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-yellow-600">
                Total Customers
              </h2>
              <p className="text-2xl font-bold text-yellow-800">
                {chartData
                  .reduce((sum, item) => sum + item.customers, 0)
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatXAxis} />
                  <YAxis domain={memoizedYDomain} />
                  <Tooltip content={customTooltip} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
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
                    <th className="px-4 py-2">Sales</th>
                    <th className="px-4 py-2">Revenue</th>
                    <th className="px-4 py-2">Customers</th>
                    <th className="px-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-4 py-2">{item.date}</td>
                      <td className="px-4 py-2">
                        ${item.sales.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        ${item.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{item.customers}</td>
                      <td className="px-4 py-2">{item.type}</td>
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

export default LineChartComp;
