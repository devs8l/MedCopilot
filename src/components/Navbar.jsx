import React, { useState, useEffect, useContext } from 'react';
import DatePicker from './DatePicker';
import { Moon, Sun, Search, CircleHelp, ChevronLeft, X, LogOut } from 'lucide-react';
import DateSort from './DateSort';
import { Link } from 'react-router-dom';
import { MedContext } from '../context/MedContext'; // Import context

const Navbar = () => {
    const { searchQuery, setSearchQuery, isUserSelected, setIsUserSelected, logout } = useContext(MedContext);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    // Dark mode state
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || 
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
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
        <div className={`grid dark:text-white grid-cols-[2fr_1fr] ${isSearchOpen ? 'sm:grid-cols-[1fr_4fr_1fr]' : 'sm:grid-cols-[1fr_3fr_1fr]'} gap-4 py-3 px-5`}>
            <div className='py-3'>
                <h1 className='text-3xl font-semibold'>MedCopilot</h1>
                <p className='text-md text-gray-600'>Product by JNC Tech</p>
            </div>
            <div className={`hidden sm:grid md:grid lg:grid py-2 items-center ${isSearchOpen ? "grid-cols-[0.4fr_5.5fr_1fr]" : "grid-cols-[0.2fr_1.6fr_1.5fr] lg:grid-cols[0.4fr_1.5fr_1.5fr] "} justify-start`}>
                <Link to={'/'} onClick={() => { setIsUserSelected(false); setSearchQuery(''); }}>
                    <ChevronLeft />
                </Link>
                <div className={`flex items-center w-full ${isUserSelected ? 'hidden' : ''}`}>
                    <div className={`flex gap-3 items-center w-full justify-center transition-all duration-300 ease-in-out`}>
                        <DatePicker />
                        <DateSort />
                    </div>
                    {!isSearchOpen ? (
                        <div></div>
                    ) : (
                        <div className='flex items-center w-full mr-4 ml-1 transition-all duration-500 ease-in-out'>
                            <input
                                type="text"
                                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg px-4 py-2 w-full focus:outline-none"
                                placeholder="Search..."
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <div className='flex gap-6 items-center'>
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className={`transition-all duration-200 ease-in-out ${isUserSelected ? 'hidden' : ''} hover:scale-110`}
                        aria-label={isSearchOpen ? "Close search" : "Open search"}
                        disabled={isUserSelected === true}
                    >
                        {isSearchOpen ? <X /> : <Search />}
                    </button>
                    <CircleHelp />
                </div>
            </div>
            <div className='flex justify-center items-center gap-2 py-3'>
                <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
                    {theme === "dark" ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-gray-800" />}
                </button>
                <h1 className='text-xl'>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h1>
                <LogOut className='cursor-pointer' onClick={() => logout()} />
            </div>
        </div>
    );
};

export default Navbar;
