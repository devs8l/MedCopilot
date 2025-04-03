import React, { useContext } from 'react';
import { MedContext } from '../context/MedContext';
import { ChevronDown } from 'lucide-react';

const DateSort = () => {
  const { filterBasis, setFilterBasis } = useContext(MedContext);

  return (
    <div className="inline-block py-1 sm:py-2 relative">
      <div className="relative">
        <select
          value={filterBasis}
          onChange={(e) => setFilterBasis(e.target.value)}
          className="px-2 sm:px-4 py-1 sm:py-2 bg-[#ffffff96] rounded-md text-xs sm:text-sm dark:bg-[#22283666] dark:text-white text-[#000000b2] focus:outline-none appearance-none pr-6 sm:pr-8"
        >
          <option value="schedule">Schedule View</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <div className="absolute inset-y-0 right-1 flex items-center pr-1 sm:pr-2 pointer-events-none dark:text-white">
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </div>
    </div>
  );
};

export default DateSort;