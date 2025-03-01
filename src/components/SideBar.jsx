import { BookOpenCheck, ChevronDown, ChevronLeft, Menu, User } from 'lucide-react';
import React, { use, useContext } from 'react';
import Calendar from './Calendar';
import { Link } from 'react-router-dom';
import { MedContext } from '../context/MedContext';

const SideBar = () => {
    const {isExpanded, setIsExpanded} =useContext(MedContext); ;
    return (
        <div className={`bg-primary dark:bg-[#161616] flex flex-col gap-3 justify-between transition-all min-h-[80vh] duration-300 ${isExpanded ? 'w-[320px]' : ''}`}>
            {/* Sidebar Top Section */}
            <div className="flex flex-col  items-start overflow-hidden justify-between h-[90%] dark:bg-[#272626] rounded-2xl drop-shadow-md transition-all duration-300">

                {/* Toggle Button */}
                {/* <button
                    className={`px-4 py-1 mt-3 rounded-md cursor-pointer relative z-100 self-start`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                <Menu />
                </button> */}

                {/* Calendar Section */}
                <div className={`transition-all duration-300 mt-3  z-3 mb-2 overflow-auto ${isExpanded ? 'opacity-100' : 'hidden opacity-0'}`}>
                    <Calendar />
                </div>
                <div className={`flex flex-col items-center min-w-[300px] justify-between w-[90%] mt-[-15px] px-4 gap-4 py-3 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    <button className="w-full bg-white cursor-pointer text-sm gap-2 text-center px-3 py-3 flex items-center justify-center rounded-md border border-gray-300">
                        Create Event <ChevronDown size={20} />
                    </button>
                    <button className="w-full bg-action-btn cursor-pointer text-white text-sm px-3 py-3 rounded-md">
                        + Add Appointment
                    </button>
                </div>

                {/* Buttons Section */}
            </div>

            {/* Sidebar Navigation */}
            
            {/* <div className="flex flex-col transition-all p-2 flex-grow duration-300 gap-1 items-center justify-around bg-white dark:bg-[#272626] rounded-2xl drop-shadow-md w-full">

                
                <button className={`flex cursor-pointer items-center ${isExpanded ? 'p-4' : 'p-2'} gap-3 text-sm rounded-md w-full mt-2 text-center hover:bg-gray-50 transition-all duration-300`}>
                    <span className={"flex-shrink-0"}><BookOpenCheck /></span>
                    <span className={`whitespace-nowrap transition-all duration-300 ease-in ${isExpanded ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                        Make an Appointment
                    </span>
                </button>

                <Link className='w-full' to={`/`}>
                    <button className={`flex cursor-pointer items-center ${isExpanded ? 'p-4' : 'p-2'} gap-3 text-sm rounded-md w-full mt-2 text-center hover:bg-gray-50 transition-all duration-300`}>
                        <span className="flex-shrink-0"><User /></span>
                        <span className={`whitespace-nowrap transition-all duration-300 ease-in ${isExpanded ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                            My Patients
                        </span>
                    </button>
                </Link>
            </div> */}
        </div>
    );
};

export default SideBar;