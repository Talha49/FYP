"use client";

import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import {
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import LineChartComp from "./_charts/LineChart";
import CalendarComp from "./_charts/Calendar";
import DualLines from "./_charts/DualLines";
import LineCharttwo from "./_charts/LineCharttwo";
import CircularChartComp from "./_charts/CircularChartComp";
import DualAreaChart from "./_charts/AreaChart";
import BarChartComp from "./_charts/BarChart";
import BarGraphtwo from "./_charts/BarGraphtwo";
import Taskdata from "./_datatable/taskdata";

function Card({ icon: Icon, value, description, color, className, children }) {
  return (
    <div
      className={`bg-white border rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="p-6 flex flex-col h-full">
        {Icon && value ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${color}`}>
                <Icon size={24} color="white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
            </div>
            <p className="text-xs text-gray-500 mt-auto">{description}</p>
          </>
        ) : (
          <>{children}</>
        )}
      </div>
    </div>
  );
}

function DashboardComp() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  function handleDateChange(date) {
    console.log("Date changed:", date);
    setSelectedDate(date);
  }

  return (
    <div className="p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">Reports & Analytics System</div>
        
      </div>

      <div className="flex flex-col space-y-4">
        {/* Quantity Cards */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          <Card
            title="Total RFIs"
            icon={FaFileAlt}
            value="45"
            description="Open requests for information"
            color="bg-blue-500"
            className="hover:scale-105"
          />
          <Card
            title="Completed RFIs"
            icon={FaCheckCircle}
            value="32"
            description="Resolved and closed requests"
            color="bg-green-500"
            className="hover:scale-105"
          />
          <Card
            title="Pending RFIs"
            icon={FaExclamationTriangle}
            value="8"
            description="Awaiting response or action"
            color="bg-yellow-500"
            className="hover:scale-105"
          />
          <Card
            title="Average Response Time"
            icon={FaClock}
            value="2.5 days"
            description="Time to resolve requests"
            color="bg-purple-500"
            className="hover:scale-105"
          />
        </div>

        {/* First row */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 ">
          <Card className="h-[300px]">
            <LineChartComp selectedDate={selectedDate} />
          </Card>
          <Card className=" h-[300px] overflow-y-auto" title="Calendar">
            <div className="flex-grow flex items-center justify-center ">
              <CalendarComp value={selectedDate} onChange={handleDateChange} />
            </div>
          </Card>
          <Card title="Dual Lines" className="h-[300px]">
            <DualLines selectedDate={selectedDate} />
          </Card>
        </div>

        {/* Second row */}
        <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
          <Card className="h-[540px]">
            <LineCharttwo selectedDate={selectedDate} />
          </Card>

          <div className="flex flex-col gap-4">
            <Card title="Circular Chart Comp">
              <CircularChartComp />
            </Card>
            <Card>
              <DualAreaChart selectedDate={selectedDate} />
            </Card>
          </div>
        </div>

        {/* Third row */}
        {/* <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <Card title="BarChartComp" className="h-full">
            <BarChartComp selectedDate={selectedDate} />
          </Card>
          <Card title="BarGraphtwo" className="h-full">
            <BarGraphtwo selectedDate={selectedDate} />
          </Card>
        </div> */}
     
      </div>


      <div>
        <Taskdata />
      </div>
    </div>
  );
}

export default DashboardComp;
