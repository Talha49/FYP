"use client"

import { getTasks } from '@/lib/Features/TaskSlice';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User
} from 'lucide-react';

const TaskTable = ({ data: initialData, className, loading, noDataMessage, title }) => {
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (key === 'createdAt' || key === 'dueDate') {
        return direction === 'asc'
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }

      if (key === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return direction === 'asc'
          ? priorityOrder[a[key].toLowerCase()] - priorityOrder[b[key].toLowerCase()]
          : priorityOrder[b[key].toLowerCase()] - priorityOrder[a[key].toLowerCase()];
      }

      return direction === 'asc'
        ? String(a[key]).localeCompare(String(b[key]))
        : String(b[key]).localeCompare(String(a[key]));
    });

    setData(sortedData);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnter = (e, index) => {
    setDragOverItem(index);
    e.currentTarget.style.transform = 'translateY(2px)';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'none';
    
    if (draggedItem !== null && dragOverItem !== null) {
      const newData = [...data];
      const draggedRow = newData[draggedItem];
      newData.splice(draggedItem, 1);
      newData.splice(dragOverItem, 0, draggedRow);
      setData(newData);
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3" /> 
      : <ArrowDown className="w-3 h-3" />;
  };

  const columns = [
    { key: 'index', label: 'No.', sortable: false },
    { key: 'createdAt', label: 'Created At', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
  ];
 
  const generatePDF = useCallback(() => {
    const printWindow = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Inspection & Job Monitoring - Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; }
            .header { text-align: center; margin-bottom: 30px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Smart Inspection & Job Monitoring</h1>
            <h2>${title}</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Records: ${data.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Created At</th>
                <th>Username</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(note => `
                <tr>
                  <td>${note._id}</td>
                  <td>${new Date(note.createdAt).toLocaleDateString()}</td>
                  <td>${note.username}</td>
                  <td>${note.status}</td>
                  <td>${note.priority}</td>
                  <td>${new Date(note.dueDate).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Smart Inspection & Job Monitoring. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }, [data, title]);
  

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden .custom-scrollbars ${className}`}>
      <div className="border border-gray-200 rounded-xl">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            {title}
            <span className="ml-2 text-sm font-medium text-gray-500">
              ({data.length} tasks)
            </span>
          </h3>
           <button onClick={generatePDF} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
>Genrerate Report</button>
        </div>

        <div className="overflow-auto .custom-scrollbars" style={{ maxHeight: '600px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p>{noDataMessage}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="border-b border-gray-200">
                  {columns.map((column) => (
                    <th 
                      key={column.key}
                      className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        className="flex items-center gap-2 hover:text-gray-700 focus:outline-none"
                        onClick={() => column.sortable && handleSort(column.key)}
                        disabled={!column.sortable}
                      >
                        {column.label}
                        {column.sortable && getSortIcon(column.key)}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((note, index) => (
                  <tr
                    key={note._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    className="hover:bg-gray-50 transition-colors duration-200 cursor-move"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {note.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(note.status)}
                        <span className="text-sm text-gray-900">{note.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
                        {note.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(note.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const Taskdata = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.TaskSlice);
  const [completedNotes, setCompletedNotes] = useState([]);
  const [pendingNotes, setPendingNotes] = useState([]);

  useEffect(() => {
    if (session?.user?.userData?.id) {
      dispatch(getTasks(session.user.userData.id));
    }
  }, [dispatch, session?.user?.userData?.id]);

  useEffect(() => {
    setCompletedNotes(tasks.filter((note) => note.status === 'Completed'));
    setPendingNotes(tasks.filter((note) => note.status !== 'Completed'));
  }, [tasks]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TaskTable
          data={completedNotes}
          loading={loading}
          noDataMessage="No completed tasks"
          title='Completed Tasks'
        />
        <TaskTable
          data={pendingNotes}
          loading={loading}
          noDataMessage="No pending or in-progress tasks"
          title='Pending Tasks'
        />
      </div>
    </div>
  );
};

export default Taskdata;