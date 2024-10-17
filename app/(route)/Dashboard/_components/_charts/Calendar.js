import React, { useState, useCallback, useMemo } from 'react';
import { FaChevronRight, FaChevronLeft, FaAngleDoubleLeft, FaAngleDoubleRight, FaCalendarAlt } from "react-icons/fa";

function CalendarComp ({ onChange, value }){
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'

  const days = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);
  const months = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], []);

  const daysInMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(), [currentDate]);
  const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(), [currentDate]);

  const navigateMonth = useCallback((delta) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + delta, 1));
  }, []);

  const navigateYear = useCallback((delta) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear() + delta, prevDate.getMonth(), 1));
  }, []);

  const resetToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onChange(today);
    setViewMode('days');
  }, [onChange]);

  const isToday = useCallback((day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  }, [currentDate]);

  const isSelected = useCallback((day) => {
    return day === selectedDate.getDate() && 
           currentDate.getMonth() === selectedDate.getMonth() && 
           currentDate.getFullYear() === selectedDate.getFullYear();
  }, [currentDate, selectedDate]);

  const handleDateClick = useCallback((day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onChange(newDate);
  }, [currentDate, onChange]);

  const handleMonthClick = useCallback((month) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), month, 1));
    setViewMode('days');
  }, []);

  const handleYearClick = useCallback((year) => {
    setCurrentDate(prevDate => new Date(year, prevDate.getMonth(), 1));
    setViewMode('months');
  }, []);

  function renderDays() {
    return (
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="h-6"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handleDateClick(i + 1)}
            className={`h-6 w-6 flex items-center justify-center rounded-full text-xs transition-all duration-200 ${
              isToday(i + 1)
                ? 'bg-indigo-600 text-white font-bold'
                : isSelected(i + 1)
                ? 'bg-purple-300 text-indigo-800 font-bold'
                : 'hover:bg-indigo-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  }

  function renderMonths() {
    return (
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthClick(index)}
            className="p-2 rounded-md hover:bg-indigo-100 transition-colors duration-200"
          >
            {month}
          </button>
        ))}
      </div>
    );
  }

  function renderYears() {
    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);
    return (
      <div className="grid grid-cols-3 gap-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearClick(year)}
            className="p-2 rounded-md hover:bg-indigo-100 transition-colors duration-200"
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm overflow-hidden ">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 text-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-1">
            <button onClick={() => navigateYear(-1)} className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200">
              <FaAngleDoubleLeft size={12} />
            </button>
            <button onClick={() => navigateMonth(-1)} className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200">
              <FaChevronLeft size={12} />
            </button>
          </div>
          <button 
            onClick={() => setViewMode(viewMode === 'days' ? 'months' : viewMode === 'months' ? 'years' : 'days')}
            className="text-sm font-semibold hover:underline"
          >
            {viewMode === 'days' ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}` :
             viewMode === 'months' ? currentDate.getFullYear() :
             `${currentDate.getFullYear() - 5} - ${currentDate.getFullYear() + 6}`}
          </button>
          <div className="flex space-x-1">
            <button onClick={() => navigateMonth(1)} className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200">
              <FaChevronRight size={12} />
            </button>
            <button onClick={() => navigateYear(1)} className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200">
              <FaAngleDoubleRight size={12} />
            </button>
          </div>
        </div>
        {viewMode === 'days' && (
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map(day => (
              <div key={day} className="text-[10px] font-medium">{day}</div>
            ))}
          </div>
        )}
      </div>
      <div className="p-2">
        {viewMode === 'days' && renderDays()}
        {viewMode === 'months' && renderMonths()}
        {viewMode === 'years' && renderYears()}
      </div>
      <div className="flex justify-center pb-2">
        <button
          onClick={resetToToday}
          className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
        >
          <FaCalendarAlt size={12} />
          <span>Today</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarComp;