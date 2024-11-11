import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ initialPercentage = 75 }) => {
  const [percentage, setPercentage] = useState(initialPercentage);

  useEffect(() => {
    // Simulate dynamic updates (remove this in production and update percentage as needed)
    const interval = setInterval(() => {
      setPercentage(prev => (prev + 1) % 101);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const data = [
    { name: 'Progress', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];

  const COLORS = ['#00CCBB', '#F3F4F6'];

  return (
    
      <div >
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Progress</h2>
          <p className="text-gray-600">Lorem ipsum dolor sit amet</p>
        </div>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">{`${percentage}%`}</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
            onClick={() => setPercentage(Math.floor(Math.random() * 101))}
          >
            Update Progress
          </button>
        </div>
      </div>
   
  );
};

export default ProgressChart;