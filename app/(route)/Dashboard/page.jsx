import React from 'react';
import { IoSearchOutline } from "react-icons/io5";

const Card = ({ title, children, className }) => (
  <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
    {title && <h2 className="text-sm font-semibold mb-2 text-gray-500">{title}</h2>}
    {children}
  </div>
);

const Calendar = () => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-green-500">January</span>
      <span className="text-gray-400">&lt; &gt;</span>
    </div>
    <div className="grid grid-cols-7 gap-1 text-xs">
      {["S", "M", "T", "W", "T", "F", "S"].map(day => (
        <div key={day} className="text-center font-medium text-gray-400">{day}</div>
      ))}
      {Array.from({ length: 31 }, (_, i) => (
        <div key={i} className={`text-center p-1 ${i + 1 === 14 ? 'bg-green-500 text-white rounded-full' : ''}`}>
          {i + 1}
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Lorem ipsum</h2>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">+12%</span>
          </div>
          <div className="h-24 bg-gray-200 rounded mt-2"></div>
        </Card>
        <Card title="Adipiscing" className="col-span-1">
          <div className="h-24 bg-gray-200 rounded"></div>
        </Card>
        <Card className="col-span-1">
          <Calendar />
        </Card>
        <div className="col-span-1 flex flex-col">
          <div className="mb-2">
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-full shadow-md">
              <input type="text" placeholder="Search..." className="flex-grow outline-none" />
              <IoSearchOutline className="text-gray-400" size={20} />
            </div>
          </div>
          <Card className="flex-grow">
            <div className="flex justify-between items-center h-full">
              <div>
                <span className="text-2xl font-bold">25k</span>
                <div className="w-12 h-1 bg-green-400 mt-1"></div>
              </div>
              <div>
                <span className="text-2xl font-bold">90k</span>
                <div className="w-12 h-1 bg-indigo-400 mt-1"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-1 space-y-4">
          <Card>
            <div className="flex justify-between">
              <div>
                <h3 className="text-2xl font-bold">1205</h3>
                <div className="w-16 h-1 bg-yellow-400 mt-1"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">840</h3>
                <div className="w-16 h-1 bg-green-400 mt-1"></div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex justify-center items-center h-full">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">75%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E6E6E6"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4CC3D9"
                    strokeWidth="3"
                    strokeDasharray="75, 100"
                  />
                </svg>
              </div>
            </div>
            <button className="mt-4 w-full  text-white py-2 rounded-md button">Suscipit</button>
          </Card>
        </div>
        <Card title="Consectetur" className="col-span-1">
          <div className="h-64 bg-gray-200 rounded"></div>
        </Card>
        <Card title="Dolor sit amet" className="col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="h-48 bg-gray-200 rounded"></div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;