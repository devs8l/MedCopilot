import { Menu, Moon, Sun, Search, CircleHelp, ChevronLeft, X, LogOut } from 'lucide-react';
import React, { useState, useEffect, useContext } from 'react';
import DatePicker from './DatePicker';
import DateSort from './DateSort';
import { Link } from 'react-router-dom';
import { MedContext } from '../context/MedContext'; // Import context

const Navbar = () => {
    const { searchQuery, setSearchQuery, isUserSelected, setIsUserSelected, logout, isExpanded, setIsExpanded, setSelectedUser } = useContext(MedContext);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Dark mode state
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light" // Default to "light" instead of checking system preference
    );

    // Apply theme on mount & when theme state changes
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Toggle dark mode
    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <div className="grid dark:text-white dark:bg-[#00000099] grid-cols-[2fr_1fr] ml-2 bg-[#FFFFFF66] rounded-xl sm:grid-cols-[1fr_2fr_2fr] gap-4 mb-2 mt-2 px-5 h-16">
            <div className="flex items-center gap-10">
                {/* Sidebar Toggle Button */}
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="rounded-md cursor-pointer mr-1 w-8 h-8 flex items-center justify-center"
                >
                    {isExpanded ? <img src="/ham-c.svg" className='w-5 h-5' alt="" /> :<img src="/ham-e.svg" className='w-5 h-5' alt="" />  }
                    
                </button>

                <div className="my-2">
                    <h1 className="text-xl font-semibold">MedCopilot</h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Product by JNC Tech</p>
                </div>
            </div>

            <div className="hidden sm:flex md:flex lg:flex items-center justify-between h-full">
                {/* <div className="w-8 h-8 flex items-center justify-center">
                    {isUserSelected && (
                        <Link 
                            to={'/'} 
                            className="transition-opacity duration-300 ease-in-out opacity-100 flex items-center justify-center w-full h-full" 
                            onClick={() => { setIsUserSelected(false); setSelectedUser(null); setSearchQuery(''); }}
                        >
                            <ChevronLeft />
                        </Link>
                    )}
                </div> */}
                
                <div className="flex-1 flex items-center justify-center relative px-4">
                    {!isUserSelected && (
                        <div className={`w-full transition-opacity duration-300 ease-in-out ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            {isSearchOpen && (
                                <input
                                    type="text"
                                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg px-4 py-2 w-full focus:outline-none"
                                    placeholder="Search..."
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            )}
                        </div>
                    )}
                </div>
                
                <div className="w-8 h-8">
                    {/* Empty space for alignment */}
                </div>
            </div>
            
            <div className='flex justify-end items-center gap-8 py-2'>
                <h1 className='text-md whitespace-nowrap'>
                    {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', weekday: 'long' })} | {' '}
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h1>

                {!isUserSelected && (
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="w-8 h-8 flex items-center justify-center"
                        aria-label={isSearchOpen ? "Close search" : "Open search"}
                    >
                        {isSearchOpen ? <X /> : <Search />}
                    </button>
                )}
                
                <div className="w-8 h-8 flex items-center justify-center">
                    <CircleHelp />
                </div>
                
                <button onClick={toggleTheme} className="p-2 rounded-full flex items-center justify-center">
                    {theme === "dark" ? <Sun className="" /> : <Moon className=" text-gray-800" />}
                </button>
            </div>
        </div>
    );
};

export default Navbar;