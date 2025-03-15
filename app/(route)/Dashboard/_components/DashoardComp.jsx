"use client"
import React, { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";
import LineChartComp from "./_charts/LineChart";
import CalendarComp from "./_charts/Calendar";
import DualLines from "./_charts/DualLines";
import CircularChartComp from "./_charts/CircularChartComp";
import DualAreaChart from "./_charts/AreaChart";
import BarChartComp from "./_charts/BarChart";
import Taskdata from "./_datatable/taskdata";
import { getTasks } from "@/lib/Features/TaskSlice";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { ImSpinner8 } from "react-icons/im";
import { useRouter } from "next/navigation";
import { setDefaultOptions } from "date-fns";

function Card({ icon: Icon, value, description, color, className, children }) {
  const renderContent = () => {
    if (Icon) {
      return (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${color}`}>
              <Icon size={24} color="white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {value !== null && value !== undefined ? value : 'N/A'}
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-auto">{description}</p>
        </>
      );
    }
    return children || <div className="text-center text-gray-500">No data available</div>;
  };

  return (
    <div
      className={`bg-white border rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="p-6 flex flex-col h-full">
        {renderContent()}
      </div>
    </div>
  );
}

function DashboardComp() {
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.TaskSlice);

  useEffect(() => {
    if (session?.user?.userData?._id) {
      dispatch(getTasks(session.user.userData?._id));
    }
  }, [dispatch, session?.user?.userData?._id]);

  // Helper function to safely parse MongoDB dates
  const parseMongoDate = (dateString) => {
    if (!dateString) return null;
    // Handle both date objects and string formats
    const date = dateString.$date ? new Date(dateString.$date) : new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Derived stats for the dashboard cards
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === "Completed").length || 0;
  const pendingTasks = tasks?.filter(task => task.status === "In Progress" || task.status === "Pending").length || 0;

  const upcomingDeadlines = tasks?.filter(task => {
    const dueDate = parseMongoDate(task.dueDate);
    if (!dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    
    return daysDiff >= 0 && daysDiff <= 7;
  }).length || 0;

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  if (status === "loading") {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <ImSpinner8 className="text-2xl animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
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
            icon={FaFileAlt}
            value={totalTasks}
            description="Total Tasks"
            color="bg-blue-500"
            className="hover:scale-105"
          />
          <Card
            icon={FaCheckCircle}
            value={completedTasks}
            description="Completed Tasks"
            color="bg-green-500"
            className="hover:scale-105"
          />
          <Card
            icon={FaExclamationTriangle}
            value={pendingTasks}
            description="Pending Tasks"
            color="bg-yellow-500"
            className="hover:scale-105"
          />
          <Card
            icon={FaCalendarAlt}
            value={upcomingDeadlines}
            description="Tasks Due in the Next 7 Days"
            color="bg-red-500"
            className="hover:scale-105"
          />
        </div>

        {/* Charts sections remain unchanged */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          <Card className="h-[400px]">
            <LineChartComp selectedDate={selectedDate} />
          </Card>
          <Card className="h-[400px] overflow-y-auto">
            <div className="flex-grow flex items-center justify-center">
              <CalendarComp value={selectedDate} onChange={handleDateChange} />
            </div>
          </Card>
          <Card className="h-[400px]">
            <DualLines selectedDate={selectedDate} />
          </Card>
        </div>

        <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
          <Card className="h-[930px]">
            <BarChartComp selectedDate={selectedDate} />
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CircularChartComp />
            </Card>
            <Card>
              <DualAreaChart selectedDate={selectedDate} />
            </Card>
          </div>
        </div>
      </div>

      <div>
        <Taskdata />
      </div>
    </div>
  );
}

export default DashboardComp;