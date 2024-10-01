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

function BarGraphtwo ({ selectedDate }){
  const [chartData, setChartData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

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
  };

  function toggleDownloadMenu() {
    setDownloadMenuVisible((prevState) => !prevState);
  };

  function formatXAxis(tickItem) {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  function customTooltip  ({ active, payload }) {
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
  };

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
          <XAxis dataKey="date" tickFormatter={formatXAxis}
            type="category" />
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
    </div>
  );
};
export default BarGraphtwo;
