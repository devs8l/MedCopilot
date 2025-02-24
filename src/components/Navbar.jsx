import React, { useState, useContext } from 'react';
import DatePicker from './DatePicker';
import { Moon, Search, CircleHelp, ChevronLeft, X } from 'lucide-react';
import DateSort from './DateSort';
import { Link } from 'react-router-dom';
import { MedContext } from '../context/MedContext'; // Import context

const Navbar = () => {
    const { searchQuery, setSearchQuery } = useContext(MedContext); // Access context
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className={`grid grid-cols-[2fr_1fr] ${isSearchOpen ? 'sm:grid-cols-[1fr_3fr_1fr]' : 'sm:grid-cols-[1fr_2fr_1fr]'} gap-4 py-3 px-5`}>
            <div className='py-3'>
                <h1 className='text-3xl font-semibold'>MedCopilot</h1>
                <p className='text-md text-gray-600'>Product by JNC Tech</p>
            </div>
            <div className={`hidden sm:grid md:grid lg:grid py-2 items-center ${isSearchOpen ? "grid-cols-[0.4fr_5.5fr_1fr]" : "grid-cols-[0.2fr_1.6fr_1.5fr] lg:grid-cols[0.4fr_1.5fr_1.5fr] "} justify-start`}>
                <Link to={'/'}><ChevronLeft /></Link>
                <div className='flex items-center w-full'>
                    <div className='flex gap-3 items-center w-full justify-center transition-all duration-300 ease-in-out'>
                        <DatePicker />
                        <DateSort />
                    </div>
                    {!isSearchOpen ? (
                        <div></div>
                    ) : (
                        <div className='flex items-center w-full mr-4 ml-1 transition-all duration-500 ease-in-out'>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none"
                                placeholder="Search..."
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                            />
                        </div>
                    )}
                </div>
                <div className='flex gap-6 items-center'>
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="transition-all duration-200 ease-in-out hover:scale-110"
                        aria-label={isSearchOpen ? "Close search" : "Open search"}
                    >
                        {isSearchOpen ? <X /> : <Search />}
                    </button>
                    <CircleHelp className='' />
                </div>
            </div>
            <div className='flex justify-center items-center gap-2 py-3'>
                <Moon className='h-6 w-6' />
                <h1 className='text-xl'>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h1>
            </div>
        </div>
    );
};

export default Navbar;
