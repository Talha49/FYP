import React, { useEffect, useMemo, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { PiFileTextThin } from 'react-icons/pi';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function BarChartComp ({selectedDate}){
    
  const [chartData, setChartData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);


  const allData = [
    // January 2022
    { "name": "Lahore Towers", "date": "2022-01-02", "tasksCompleted": 45, "budgetSpent": 45000, "teamSize": 10 },
    { "name": "Karachi Heights", "date": "2022-01-02", "tasksCompleted": 30, "budgetSpent": 30000, "teamSize": 8 },
    { "name": "Islamabad Complex", "date": "2022-01-02", "tasksCompleted": 50, "budgetSpent": 55000, "teamSize": 12 },
    { "name": "Faisalabad Plaza", "date": "2022-01-02", "tasksCompleted": 25, "budgetSpent": 20000, "teamSize": 6 },
    { "name": "Multan Villas", "date": "2022-01-02", "tasksCompleted": 35, "budgetSpent": 40000, "teamSize": 9 },
    { "name": "Peshawar Residences", "date": "2022-01-02", "tasksCompleted": 40, "budgetSpent": 38000, "teamSize": 11 },
    { "name": "Quetta Apartments", "date": "2022-01-02", "tasksCompleted": 55, "budgetSpent": 50000, "teamSize": 14 },
    { "name": "Sialkot Homes", "date": "2022-01-02", "tasksCompleted": 20, "budgetSpent": 15000, "teamSize": 5 },
   
   
    // January 2022
    { "name": "Gujranwala Mall", "date": "2022-01-04", "tasksCompleted": 60, "budgetSpent": 60000, "teamSize": 15 },
    { "name": "Sargodha Towers", "date": "2022-01-04", "tasksCompleted": 45, "budgetSpent": 45000, "teamSize": 12 },
    { "name": "Bahawalpur Complex", "date": "2022-01-04", "tasksCompleted": 70, "budgetSpent": 70000, "teamSize": 18 },
    { "name": "Okara Villas", "date": "2022-01-04", "tasksCompleted": 35, "budgetSpent": 35000, "teamSize": 9 },
    { "name": "Rahim Yar Khan Homes", "date": "2022-01-04", "tasksCompleted": 50, "budgetSpent": 55000, "teamSize": 14 },
    { "name": "Khanewal Residences", "date": "2022-01-04", "tasksCompleted": 65, "budgetSpent": 65000, "teamSize": 16 },
    { "name": "Mianwali Apartments", "date": "2022-01-04", "tasksCompleted": 40, "budgetSpent": 40000, "teamSize": 10 },
    { "name": "Lodhran Estates", "date": "2022-01-04", "tasksCompleted": 30, "budgetSpent": 30000, "teamSize": 7 },
   
   // December 2022
   { "name": "Chakwal Apartments", "date": "2022-12-11", "tasksCompleted": 50, "budgetSpent": 50000, "teamSize": 13 },
   { "name": "Taxila Estates", "date": "2022-12-11", "tasksCompleted": 30, "budgetSpent": 30000, "teamSize": 7 },
   { "name": "Wah Cantt Homes", "date": "2022-12-11", "tasksCompleted": 20, "budgetSpent": 20000, "teamSize": 5 },
   { "name": "Attock Residences", "date": "2022-12-11", "tasksCompleted": 65, "budgetSpent": 65000, "teamSize": 16 },
   
   
   // February 2023
   { "name": "Hafizabad Complex", "date": "2023-02-05", "tasksCompleted": 60, "budgetSpent": 60000, "teamSize": 15 },
   { "name": "Gujrat Towers", "date": "2023-02-05", "tasksCompleted": 45, "budgetSpent": 45000, "teamSize": 12 },
   { "name": "Mandi Bahauddin Villas", "date": "2023-02-05", "tasksCompleted": 70, "budgetSpent": 70000, "teamSize": 18 },
   { "name": "Sadiqabad Homes", "date": "2023-02-05", "tasksCompleted": 35, "budgetSpent": 35000, "teamSize": 9 },
   { "name": "Rajanpur Residences", "date": "2023-02-05", "tasksCompleted": 50, "budgetSpent": 55000, "teamSize": 14 },
   { "name": "Dera Ghazi Khan Apartments", "date": "2023-02-05", "tasksCompleted": 40, "budgetSpent": 40000, "teamSize": 10 },
   { "name": "Muzaffargarh Estates", "date": "2023-02-05", "tasksCompleted": 30, "budgetSpent": 30000, "teamSize": 7 },
   { "name": "Layyah Homes", "date": "2023-02-05", "tasksCompleted": 25, "budgetSpent": 25000, "teamSize": 6 },
   
   
   // June 2023
   { "name": "Bhakkar Complex", "date": "2023-06-15", "tasksCompleted": 55, "budgetSpent": 55000, "teamSize": 13 },
   { "name": "Khushab Towers", "date": "2023-06-15", "tasksCompleted": 40, "budgetSpent": 40000, "teamSize": 10 },
   { "name": "Talagang Villas", "date": "2023-06-15", "tasksCompleted": 75, "budgetSpent": 75000, "teamSize": 19 },
   { "name": "Pind Dadan Khan Homes", "date": "2023-06-15", "tasksCompleted": 45, "budgetSpent": 45000, "teamSize": 12 },
   { "name": "Jhelum Residences", "date": "2023-06-15", "tasksCompleted": 60, "budgetSpent": 60000, "teamSize": 15 },
   { "name": "Chakwal Apartments", "date": "2023-06-15", "tasksCompleted": 50, "budgetSpent": 50000, "teamSize": 13 },
   { "name": "Taxila Estates", "date": "2023-06-15", "tasksCompleted": 30, "budgetSpent": 30000, "teamSize": 7 },
   { "name": "Wah Cantt Homes", "date": "2023-06-15", "tasksCompleted": 20, "budgetSpent": 20000, "teamSize": 5 },
   
   
   // October 2024
   { "name": "Ali Gardens", "date": "2024-10-01", "tasksCompleted": 50, "budgetSpent": 50000, "teamSize": 13 },
   { "name": "Faisal Villas", "date": "2024-10-01", "tasksCompleted": 40, "budgetSpent": 40000, "teamSize": 10 },
   { "name": "Kamran Residences", "date": "2024-10-01", "tasksCompleted": 75, "budgetSpent": 75000, "teamSize": 19 },
   { "name": "Ahmed Towers", "date": "2024-10-01", "tasksCompleted": 35, "budgetSpent": 35000, "teamSize": 9 },
   { "name": "Saqib Homes", "date": "2024-10-01", "tasksCompleted": 60, "budgetSpent": 60000, "teamSize": 15 },
   { "name": "Umar Estates", "date": "2024-10-01", "tasksCompleted": 45, "budgetSpent": 45000, "teamSize": 12 },
   { "name": "Bilal Apartments", "date": "2024-10-01", "tasksCompleted": 30, "budgetSpent": 30000, "teamSize": 7 },
   { "name": "Omar Villas", "date": "2024-10-01", "tasksCompleted": 25, "budgetSpent": 25000, "teamSize": 6 },
   
   
   // November 2024
   { "name": "Hassan Complex", "date": "2024-11-02", "tasksCompleted": 55, "budgetSpent": 55000, "teamSize": 13 },
   { "name": "Fahad Towers", "date": "2024-11-02", "tasksCompleted": 40, "budgetSpent": 40000, "teamSize": 10 },
   { "name": "Rizwan City", "date": "2024-11-02", "tasksCompleted": 75, "budgetSpent": 75000, "teamSize": 19 },
   { "name": "Ali Gardens", "date": "2024-11-02", "tasksCompleted": 45, "budgetSpent": 45000, "teamSize": 12 },
   { "name": "Kamran Residences", "date": "2024-11-02", "tasksCompleted": 60, "budgetSpent": 60000, "teamSize": 15 },
   { "name": "Ahmed Towers", "date": "2024-11-02", "tasksCompleted": 50, "budgetSpent": 50000, "teamSize": 13 },
   { "name": "Saqib Homes", "date": "2024-11-02", "tasksCompleted": 30, "budgetSpent": 30000, "teamSize": 7 },
   { "name": "Umar Estates", "date": "2024-11-02", "tasksCompleted": 20, "budgetSpent": 20000, "teamSize": 5 }
   
   
   ];
   
   const memoizedAllData = useMemo(() => allData, []);

  useEffect(() => {
    const updateChartData = () => {
      const formattedSelectedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      ).toISOString().split("T")[0];

      const filteredData = memoizedAllData.filter(
        (item) => item.date === formattedSelectedDate
      );

      if (filteredData.length > 0) {
        setChartData(filteredData);
        setDataAvailable(true);
      } else {
        setChartData([{
          date: formattedSelectedDate,
          sales: 0,
          revenue: 0,
          customers: 0,
        }]);
        setDataAvailable(false);
      }
    };

    updateChartData();
  }, [selectedDate, memoizedAllData]);








  
  function downloadCSV  (dataToDownload, fileName) {
    if (dataToDownload.length === 0) {
      alert("No data available to download");
      return;

    }

    const headers = Object.keys(dataToDownload[0]).join(',');
    const csv = [
      headers,
      ...dataToDownload.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setDownloadMenuVisible(!downloadMenuVisible)

  };

  function toggleDownloadMenu()  {
    setDownloadMenuVisible((prevState) => !prevState);
  };

  function formatXAxis (tickItem) {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  

  function customTooltip({ active, payload }){
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label text-purple-400">{`Name: ${payload[0].payload.name}`}</p>
          <p className="intro">{`Budget: ${payload[0].payload.budgetSpent}`}</p>
          <p className="desc">{`Completion: ${payload[0].payload.tasksCompleted}`}</p>
          <p className="desc">{`Team: ${payload[0].payload.teamSize}`}</p>
          <p className="desc">{`Date: ${payload[0].payload.date}`}</p>
        </div>
      );
    }
    return null;
  };
  
return(
  <div>
    <div className="flex justify-between mb-2">
        <p>BarChart</p>
        <div className="relative">
          <button
            onClick={toggleDownloadMenu}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded flex items-center text-sm ${
              !dataAvailable && 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!dataAvailable}          >
            <FaDownload className="mr-1" size={12} />
          </button>
          {downloadMenuVisible && (
        <div className="absolute right-0 mt-2 z-10 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ease-in-out transform origin-top-right">
          <div className="p-2 space-y-1">
            <button
              onClick={() => downloadCSV(chartData, `Bar_chart_report_${selectedDate.toISOString().split('T')[0]}.csv`)  }
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
            >
              <PiFileTextThin size={18} className="mr-2 text-blue-600" />
              <span>Extract Chosen Entries</span>
            </button>
            <button
              onClick={() => downloadCSV(memoizedAllData, 'all_data_report.csv')}
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
      <YAxis dataKey="tasksCompleted" />
      <Tooltip content={customTooltip} />
      <Legend />
      <Bar dataKey="budgetSpent" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
      <Bar dataKey="tasksCompleted" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
      <Bar dataKey="teamSize" fill="#8884d8" activeBar={<Rectangle fill="green" stroke="orange" />} />

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
          .
        </div>
      )}
  </div>
);
}
export default BarChartComp;
