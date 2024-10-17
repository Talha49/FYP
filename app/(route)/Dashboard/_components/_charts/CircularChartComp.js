import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Purple', value: 60 },
  { name: 'Cyan', value: 25 },
  { name: 'Yellow', value: 15 },
];

const COLORS = ['#8B5CF6', '#22D3EE', '#FBBF24'];

function  CircularChartComp () {
  return (
    <div>
      <div >
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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip/>
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CircularChartComp;