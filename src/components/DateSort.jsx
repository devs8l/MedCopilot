import React, { useContext, useState } from 'react';
import { MedContext } from '../context/MedContext';
import { ChevronDown, ContactRound, Calendar, Clock, Sun, Moon } from 'lucide-react';

const DateSort = () => {
  const { filterBasis, setFilterBasis } = useContext(MedContext);
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'schedule', label: 'Default', icon: '/date-sort.svg' },
    { value: 'day', label: 'Day', icon: '' },
    { value: 'week', label: 'Week', icon: '' },
    { value: 'month', label: 'Month', icon: '' },
    { value: 'year', label: 'Year', icon: ''},
  ];

  const selectedOption = options.find(opt => opt.value === filterBasis) || options[0];

  const handleSelect = (value) => {
    setFilterBasis(value);
    setIsOpen(false);
  };

  return (
    <div className="inline-block py-1 sm:py-2 relative">
      <div 
        className="px-2 sm:px-2 py-1 sm:py-2 border border-gray-500 rounded-sm text-xs sm:text-sm dark:bg-[#22283666] dark:text-white text-[#000000b2] focus:outline-none flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={selectedOption.icon} alt="" className='opacity-80' />
        {selectedOption.value !== 'schedule' && <span>{selectedOption.label}</span>}
        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
      </div>

      {isOpen && (
        <div className="absolute right-0.5 mt-1 w-[140%] z-100 bg-white dark:bg-[#222836] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 text-xs sm:text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                filterBasis === option.value ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateSort;