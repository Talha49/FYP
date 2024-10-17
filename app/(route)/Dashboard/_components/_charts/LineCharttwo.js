import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer, Dot, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FaDownload } from "react-icons/fa";
import { PiFileTextThin } from "react-icons/pi";




function LineCharttwo ({selectedDate}) {
 

 const [chartData, setChartData] = useState([])
 const [dataAvailable , setDataAvailable] = useState(true)
 const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);


  const allData = [
    // January 2022
  {
    "name": "Ali Hassan",
    "date": "2022-01-02",
    "value": 15,
    "milestone": "Walls Raised",
    "budgetSpent": 15000,
    "tasksCompleted": 10,
    "teamSize": 12
  },
  {
    "name": "Ahmed Khan",
    "date": "2022-01-02",
    "value": 20,
    "milestone": "Foundation Completed",
    "budgetSpent": 10000,
    "tasksCompleted": 5,
    "teamSize": 10
  },
  {
    "name": "Fahad Ali",
    "date": "2022-01-02",
    "value": 30,
    "milestone": "Roof Installed",
    "budgetSpent": 20000,
    "tasksCompleted": 12,
    "teamSize": 14
  },
  {
    "name": "Umar Farooq",
    "date": "2022-01-04",
    "value": 40,
    "milestone": "Electrical Setup",
    "budgetSpent": 25000,
    "tasksCompleted": 15,
    "teamSize": 15
  },
  {
    "name": "Bilal Ahmed",
    "date": "2022-01-04",
    "value": 50,
    "milestone": "Plumbing Completed",
    "budgetSpent": 30000,
    "tasksCompleted": 20,
    "teamSize": 18
  },
  {
    "name": "Omar Saeed",
    "date": "2022-01-04",
    "value": 60,
    "milestone": "Painting Completed",
    "budgetSpent": 35000,
    "tasksCompleted": 25,
    "teamSize": 20
  },
  {
    "name": "Kamran Butt",
    "date": "2022-01-08",
    "value": 10,
    "milestone": "Inspection Passed",
    "budgetSpent": 40000,
    "tasksCompleted": 30,
    "teamSize": 22
  },
  {
    "name": "Faisal Rehman",
    "date": "2022-01-8",
    "value": 80,
    "milestone": "Flooring Completed",
    "budgetSpent": 45000,
    "tasksCompleted": 35,
    "teamSize": 25
  },
  
  // December 2022
  {
    "name": "Rizwan Ali",
    "date": "2022-12-11",
    "value": 45,
    "milestone": "Walls Raised",
    "budgetSpent": 50000,
    "tasksCompleted": 40,
    "teamSize": 28
  },
  {
    "name": "Saqib Hussain",
    "date": "2022-12-11",
    "value": 55,
    "milestone": "Roof Installed",
    "budgetSpent": 55000,
    "tasksCompleted": 45,
    "teamSize": 30
  },
  {
    "name": "Ali Hassan",
    "date": "2022-12-12",
    "value": 20,
    "milestone": "Foundation Completed",
    "budgetSpent": 60000,
    "tasksCompleted": 50,
    "teamSize": 32
  },
  {
    "name": "Ahmed Khan",
    "date": "2022-12-12",
    "value": 35,
    "milestone": "Electrical Setup",
    "budgetSpent": 65000,
    "tasksCompleted": 55,
    "teamSize": 35
  },
  {
    "name": "Fahad Ali",
    "date": "2022-12-12",
    "value": 50,
    "milestone": "Plumbing Completed",
    "budgetSpent": 70000,
    "tasksCompleted": 60,
    "teamSize": 38
  },
  {
    "name": "Umar Farooq",
    "date": "2022-12-21",
    "value": 60,
    "milestone": "Painting Completed",
    "budgetSpent": 75000,
    "tasksCompleted": 65,
    "teamSize": 40
  },
  {
    "name": "Bilal Ahmed",
    "date": "2022-12-21",
    "value": 75,
    "milestone": "Flooring Completed",
    "budgetSpent": 80000,
    "tasksCompleted": 70,
    "teamSize": 42
  },
  {
    "name": "Omar Saeed",
    "date": "2022-12-21",
    "value": 90,
    "milestone": "Inspection Passed",
    "budgetSpent": 85000,
    "tasksCompleted": 75,
    "teamSize": 45
  },
  
  // February 2023
  {
    "name": "Kamran Butt",
    "date": "2023-02-05",
    "value": 40,
    "milestone": "Walls Raised",
    "budgetSpent": 90000,
    "tasksCompleted": 80,
    "teamSize": 48
  },
  {
    "name": "Faisal Rehman",
    "date": "2023-02-05",
    "value": 60,
    "milestone": "Roof Installed",
    "budgetSpent": 95000,
    "tasksCompleted": 85,
    "teamSize": 50
  },
  {
    "name": "Rizwan Ali",
    "date": "2023-02-10",
    "value": 20,
    "milestone": "Foundation Completed",
    "budgetSpent": 100000,
    "tasksCompleted": 90,
    "teamSize": 52
  },
  {
    "name": "Saqib Hussain",
    "date": "2023-02-10",
    "value": 35,
    "milestone": "Electrical Setup",
    "budgetSpent": 105000,
    "tasksCompleted": 95,
    "teamSize": 55
  },
  {
    "name": "Ali Hassan",
    "date": "2023-02-15",
    "value": 50,
    "milestone": "Plumbing Completed",
    "budgetSpent": 110000,
    "tasksCompleted": 100,
    "teamSize": 58
  },
  {
    "name": "Ahmed Khan",
    "date": "2023-02-15",
    "value": 65,
    "milestone": "Painting Completed",
    "budgetSpent": 115000,
    "tasksCompleted": 105,
    "teamSize": 60
  },
  {
    "name": "Fahad Ali",
    "date": "2023-02-20",
    "value": 80,
    "milestone": "Flooring Completed",
    "budgetSpent": 120000,
    "tasksCompleted": 110,
    "teamSize": 62
  },
  
  // June 2023
  {
    "name": "Umar Farooq",
    "date": "2023-06-02",
    "value": 30,
    "milestone": "Walls Raised",
    "budgetSpent": 125000,
    "tasksCompleted": 115,
    "teamSize": 65
  },
  {
    "name": "Bilal Ahmed",
    "date": "2023-06-02",
    "value": 45,
    "milestone": "Roof Installed",
    "budgetSpent": 130000,
    "tasksCompleted": 120,
    "teamSize": 68
  },
  {
    "name": "Omar Saeed",
    "date": "2023-06-05",
    "value": 60,
    "milestone": "Electrical Setup",
    "budgetSpent": 135000,
    "tasksCompleted": 125,
    "teamSize": 70
  },
  {
    "name": "Kamran Butt",
    "date": "2023-06-10",
    "value": 20,
    "milestone": "Foundation Completed",
    "budgetSpent": 140000,
    "tasksCompleted": 130,
    "teamSize": 72
  },
  {
    "name": "Faisal Rehman",
    "date": "2023-06-12",
    "value": 35,
    "milestone": "Plumbing Completed",
    "budgetSpent": 145000,
    "tasksCompleted": 135,
    "teamSize": 75
  },
  {
    "name": "Rizwan Ali",
    "date": "2023-06-15",
    "value": 50,
    "milestone": "Painting Completed",
    "budgetSpent": 150000,
    "tasksCompleted": 140,
    "teamSize": 78
  },
  {
    "name": "Saqib Hussain",
    "date": "2023-06-15",
    "value": 65,
    "milestone": "Flooring Completed",
    "budgetSpent": 155000,
    "tasksCompleted": 145,
    "teamSize": 80
  },
  {
    "name": "Ali Hassan",
    "date": "2023-06-20",
    "value": 80,
    "milestone": "Inspection Passed",
    "budgetSpent": 160000,
    "tasksCompleted": 150,
    "teamSize": 82
  },
  
  // October 2024
  {
    "name": "Ahmed Khan",
    "date": "2024-10-01",
    "value": 40,
    "milestone": "Walls Raised",
    "budgetSpent": 165000,
    "tasksCompleted": 155,
    "teamSize": 85
  },
  {
    "name": "Fahad Ali",
    "date": "2024-10-05",
    "value": 60,
    "milestone": "Roof Installed",
    "budgetSpent": 170000,
    "tasksCompleted": 160,
    "teamSize": 88
  },
  {
    "name": "Umar Farooq",
    "date": "2024-10-10",
    "value": 20,
    "milestone": "Foundation Completed",
    "budgetSpent": 175000,
    "tasksCompleted": 165,
    "teamSize": 90
  },
  {
    "name": "Bilal Ahmed",
    "date": "2024-10-12",
    "value": 35,
    "milestone": "Electrical Setup",
    "budgetSpent": 180000,
    "tasksCompleted": 170,
    "teamSize": 92
  },
  {
    "name": "Omar Saeed",
    "date": "2024-10-15",
    "value": 50,
    "milestone": "Plumbing Completed",
    "budgetSpent": 185000,
    "tasksCompleted": 175,
    "teamSize": 95
  },
  {
    "name": "Kamran Butt",
    "date": "2024-10-20",
    "value": 65,
    "milestone": "Painting Completed",
    "budgetSpent": 190000,
    "tasksCompleted": 180,
    "teamSize": 98
  },
  {
    "name": "Faisal Rehman",
    "date": "2024-10-25",
    "value": 80,
    "milestone": "Flooring Completed",
    "budgetSpent": 195000,
    "tasksCompleted": 185,
    "teamSize": 100
  },
  
  // November 2024
  {
    "name": "Rizwan Ali",
    "date": "2024-11-02",
    "value": 30,
    "milestone": "Walls Raised",
    "budgetSpent": 200000,
    "tasksCompleted": 190,
    "teamSize": 105
  },
  {
    "name": "Saqib Hussain",
    "date": "2024-11-05",
    "value": 45,
    "milestone": "Roof Installed",
    "budgetSpent": 205000,
    "tasksCompleted": 195,
    "teamSize": 108
  },
  {
    "name": "Ali Hassan",
    "date": "2024-11-10",
    "value": 60,
    "milestone": "Electrical Setup",
    "budgetSpent": 210000,
    "tasksCompleted": 200,
    "teamSize": 110
  },
  {
    "name": "Ahmed Khan",
    "date": "2024-11-12",
    "value": 20,
    "milestone": "Foundation Completed",
    "budgetSpent": 215000,
    "tasksCompleted": 205,
    "teamSize": 112
  },
  {
    "name": "Fahad Ali",
    "date": "2024-11-15",
    "value": 35,
    "milestone": "Plumbing Completed",
    "budgetSpent": 220000,
    "tasksCompleted": 210,
    "teamSize": 115
  },
  {
    "name": "Umar Farooq",
    "date": "2024-11-20",
    "value": 50,
    "milestone": "Painting Completed",
    "budgetSpent": 225000,
    "tasksCompleted": 215,
    "teamSize": 118
  },
  {
    "name": "Bilal Ahmed",
    "date": "2024-11-25",
    "value": 65,
    "milestone": "Flooring Completed",
    "budgetSpent": 230000,
    "tasksCompleted": 220,
    "teamSize": 120
  },
  {
    "name": "Omar Saeed",
    "date": "2024-11-30",
    "value": 80,
    "milestone": "Inspection Passed",
    "budgetSpent": 235000,
    "tasksCompleted": 225,
    "teamSize": 122
  }

  ]


const memoizedAllData = useMemo(() => allData,[]);


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


function downloadCSV (dataToDownload, fileName) {
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

function toggleDownloadMenu () {
  setDownloadMenuVisible((prevState) => !prevState);
};


  function CustomDot ({ cx, cy, payload }) {
    const colors = ['#ff6347', '#ffa500', '#1e90ff', '#32cd32', '#ff4500', '#00ced1', '#9370db'];
    return <Dot cx={cx} cy={cy} r={7} fill={colors[payload.name % colors.length]} />;
  };
  
  function customTooltip ({ active, payload }){
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label text-purple-400">{`Name: ${payload[0].payload.name}`}</p>
          <p className="intro">{`Milestone: ${payload[0].payload.milestone}`}</p>
          <p className="intro">{`Budget: ${payload[0].payload.budgetSpent}`}</p>
          <p className="desc">{`Completion: ${payload[0].payload.tasksCompleted}`}</p>
          <p className="desc">{`Team: ${payload[0].payload.teamSize}`}</p>
          <p className="desc">{`Date: ${payload[0].payload.date}`}</p>
        </div>
      );
    }
    return null;
  };
  function  formatXAxis(tickItem) {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  return (
    <div className="">
       <div className="flex justify-between mb-2">
        <p>LineChart 3</p>
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
              onClick={() => downloadCSV(chartData, `line_chart_3_report_${selectedDate.toISOString().split('T')[0]}.csv`)  }
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
      <ResponsiveContainer width="100%" height={400} >
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
           <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            type="category"
          />
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis   />
          <Tooltip content={customTooltip} />
          <Line 
            type="monotone" 
            dataKey="tasksCompleted" 
            stroke="#f5b041" 
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 8 }}
            
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
    </div>
  );
};

export default LineCharttwo;