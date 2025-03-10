import React, { useContext } from 'react'
import { MedContext } from '../context/MedContext';
import { ChevronDown } from 'lucide-react'; // If you're using lucide-react for icons

const DateSort = () => {
    const { filterBasis, setFilterBasis } = useContext(MedContext);

    return (
        <div className="inline-block py-2 relative">
            <div className="relative">
                <select
                    value={filterBasis}
                    onChange={(e) => setFilterBasis(e.target.value)}
                    className="px-4 py-2 bg-[#ffffff96]  rounded-md  text-sm dark:bg-[#22283666] dark:text-white text-[#000000b2] focus:outline-none appearance-none pr-8"
                >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
                <div className="absolute inset-y-0 right-1 flex items-center pr-2 pointer-events-none dark:text-white">
                    <ChevronDown className="h-4 w-4 " />
                </div>
            </div>
        </div>
    );
}

export default DateSort