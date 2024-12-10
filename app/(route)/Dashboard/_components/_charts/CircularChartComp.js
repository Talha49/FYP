"use client"
import React, { useEffect, useState } from 'react';
import { getTasks } from '@/lib/Features/TaskSlice';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import DetailsModal from '../_datatable/DetailsModal'; // Import the new modal component

// Color constants for different task categories
const COLORS = {
  nearDeadline: '#FF6B6B',    // Red for urgent tasks
  farFromDeadline: '#4ECDC4', // Teal for tasks with ample time
  completed: '#45B7D1',       // Blue for completed tasks
  overdue: '#FF4136'          // Dark red for overdue tasks
};

const CircularChartComp = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.TaskSlice);
  
  // State for managing selected task category and modal
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    if (session?.user?.userData?.id) {
      dispatch(getTasks(session.user.userData.id));
    }
  }, [dispatch, session?.user?.userData?.id]);

  // Categorize tasks based on due dates
  const categorizeTasks = () => {
    if (!tasks) return [];

    const now = new Date();
    const nearDeadlineTasks = [];
    const farFromDeadlineTasks = [];
    const completedTasks = [];
    const overdueTasks = [];

    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      
      // Completed tasks
      if (task.status === 'Completed') {
        completedTasks.push(task);
        return;
      }

      // Overdue tasks
      if (dueDate < now) {
        overdueTasks.push(task);
        return;
      }

      // Calculate days until deadline
      const daysUntilDeadline = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      // Near deadline (within 7 days)
      if (daysUntilDeadline <= 7) {
        nearDeadlineTasks.push(task);
      } 
      // Far from deadline (more than 7 days away)
      else {
        farFromDeadlineTasks.push(task);
      }
    });

    return [
      { 
        name: 'Near Deadline', 
        value: nearDeadlineTasks.length,
        color: COLORS.nearDeadline,
        tasks: nearDeadlineTasks
      },
      { 
        name: 'Far From Deadline', 
        value: farFromDeadlineTasks.length,
        color: COLORS.farFromDeadline,
        tasks: farFromDeadlineTasks
      },
      { 
        name: 'Completed', 
        value: completedTasks.length,
        color: COLORS.completed,
        tasks: completedTasks
      },
      { 
        name: 'Overdue', 
        value: overdueTasks.length,
        color: COLORS.overdue,
        tasks: overdueTasks
      }
    ];
  };

  // Columns for the task details modal
  const taskColumns = [
    { 
      header: 'Title', 
      key: 'description' 
    },
    { 
      header: 'Due Date', 
      accessor: (task) => new Date(task.dueDate).toLocaleDateString() 
    },
    { 
      header: 'Priority', 
      key: 'priority' 
    },
    { 
      header: 'Assignee', 
      key: 'assignee' 
    }
  ];

  // Prepare chart data
  const chartData = categorizeTasks();

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={5}
            dataKey="value"
            onClick={(data) => {
              setSelectedCategory(data);
              setIsModalOpen(true);
            }}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              value, 
              `${props.payload.name} Tasks`
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>

      <DetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? `${selectedCategory.name} Tasks` : ''}
        columns={taskColumns}
        data={selectedCategory ? selectedCategory.tasks : []}
      />
    </div>
  );
};

export default CircularChartComp;