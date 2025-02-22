import React, { useContext } from 'react'
import { MedContext } from '../context/MedContext';

const DateSort = () => {
    const { filterBasis, setFilterBasis } = useContext(MedContext);

    return (
        <div className="inline-block py-2">
            <select
                value={filterBasis}
                onChange={(e) => setFilterBasis(e.target.value)}
                className="px-3 py-2 border-1 border-gray-300 rounded-lg  focus:outline-none "
            >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
            </select>
        </div>
    );
}

export default DateSort