import React, { useContext, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MedContext } from '../context/MedContext';

const DatePicker = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { selectedDate, setSelectedDate, isUserSelected, setIsUserSelected } = useContext(MedContext);

  const formatDate = (date) => {
    const options = {
      day: 'numeric',
      month: 'short',
      weekday: 'short',
      year: 'numeric',
    };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const changeDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const handleMonthChange = (e) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(parseInt(e.target.value));
    setSelectedDate(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(parseInt(e.target.value));
    setSelectedDate(newDate);
  };

  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<td key={`empty-${i}`} className="p-1 sm:p-2"></td>);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      const isSelected = i === selectedDate.getDate();
      days.push(
        <td
          key={i}
          onClick={() => {
            const newDate = new Date(year, month, i);
            newDate.setHours(12, 0, 0, 0); // Ensures no timezone shift
            setSelectedDate(newDate);
            setIsCalendarOpen(false);
          }}
          className={`p-1 sm:p-2 text-center cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
          }`}
        >
          {i}
        </td>
      );
    }

    const weeks = [];
    let week = [];
    days.forEach((day, i) => {
      week.push(day);
      if ((i + 1) % 7 === 0 || i === days.length - 1) {
        weeks.push(<tr key={`week-${weeks.length}`}>{week}</tr>);
        week = [];
      }
    });

    return weeks;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 sm:gap-4 border border-gray-500 text-xs sm:text-sm text-[#000000b2]   rounded-md px-1 sm:px-2">
        <button
          onClick={() => changeDate(-1)}
          className={`p-1 rounded ${isUserSelected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={isUserSelected === true}
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={`py-1 sm:py-2 text-center ${isUserSelected ? 'cursor-not-allowed' : 'cursor-pointer'} rounded`}
          disabled={isUserSelected === true}
        >
          {formatDate(selectedDate)}
        </button>

        <button
          onClick={() => changeDate(1)}
          className={`p-1 rounded ${isUserSelected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={isUserSelected === true}
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>

      {isCalendarOpen && (
        <div className="absolute top-full mt-2 bg-white border-1 border-gray-100 rounded-2xl shadow-lg p-2 sm:p-4 z-20">
          <div className="flex items-center gap-2 mb-2 sm:mb-4 justify-between">
            <select
              value={selectedDate.getMonth()}
              onChange={handleMonthChange}
              className="px-2 sm:px-3 py-1 border-1 border-gray-100 rounded text-xs sm:text-sm"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedDate.getFullYear()}
              onChange={handleYearChange}
              className="px-2 sm:px-3 py-1 border-1 border-gray-100 rounded text-xs sm:text-sm"
            >
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full">
            <thead>
              <tr>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <th key={day} className="p-1 sm:p-2 text-gray-600 text-xs sm:text-sm">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{generateCalendar()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DatePicker;