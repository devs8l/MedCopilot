import { Menu, Moon, Sun, Search, CircleHelp, ChevronLeft, X, LogOut } from 'lucide-react';
import React, { useState, useEffect, useContext } from 'react';
import DatePicker from './DatePicker';
import DateSort from './DateSort';
import { Link } from 'react-router-dom';
import { MedContext } from '../context/MedContext'; // Import context

const Navbar = () => {
    const { searchQuery, setSearchQuery, isUserSelected, setIsUserSelected, logout, isExpanded, setIsExpanded, setSelectedUser } = useContext(MedContext);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    return (
        <>
            <div className="flex flex-col w-full">
                {/* Main Navbar */}
                <div className="dark:text-white dark:bg-[#00000099] bg-[#FFFFFF66] rounded-xl px-3 sm:px-5 py-2 m-2 shadow-sm">
                    <div className="flex items-center justify-between">
                        {/* Left Section - Logo and Toggle */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)} 
                                className="rounded-md cursor-pointer w-8 h-8 flex items-center justify-center"
                                aria-label="Toggle sidebar"
                            >
                                {isExpanded ? 
                                    <img src="/ham-c.svg" className='w-5 h-5' alt="Close menu" /> :
                                    <img src="/ham-e.svg" className='w-5 h-5' alt="Open menu" />
                                }
                            </button>

                            <div className="my-1">
                                <h1 className="text-lg sm:text-xl font-semibold">MedCopilot</h1>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Product by JNC Tech</p>
                            </div>
                        </div>

                        {/* Center Section - Search bar on medium+ screens */}
                        <div className="hidden md:flex items-center justify-center flex-1 mx-4">
                            {!isUserSelected && (
                                <div className={`w-full max-w-md transition-opacity duration-300 ease-in-out ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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

                        {/* Right Section - Date and Actions */}
                        <div className='flex items-center gap-2 sm:gap-4'>
                            <h1 className='text-xs sm:text-sm md:text-md hidden sm:inline whitespace-nowrap truncate'>
                                {new Date().toLocaleDateString('en-US', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    weekday: window.innerWidth > 640 ? 'long' : 'short'
                                })} | {' '}
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </h1>

                            {/* Mobile date display */}
                            <h1 className='text-xs sm:hidden whitespace-nowrap'>
                                {new Date().toLocaleDateString('en-US', { 
                                    day: 'numeric', 
                                    month: 'short'
                                })} | {' '}
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </h1>

                            {/* Search toggle button - visible on all screens */}
                            {!isUserSelected && (
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="w-8 h-8 flex items-center justify-center"
                                    aria-label={isSearchOpen ? "Close search" : "Open search"}
                                >
                                    {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                                </button>
                            )}
                            
                            {/* Mobile menu toggle button */}
                            <button 
                                className="md:hidden w-8 h-8 flex items-center justify-center" 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle mobile menu"
                            >
                                {isMobileMenuOpen ? 
                                    <X className="w-5 h-5" /> : 
                                    <Menu className="w-5 h-5" />
                                }
                            </button>
                            
                            {/* Desktop additional buttons */}
                            <div className="hidden md:flex items-center gap-4">
                                {/* Uncomment these if you want to show them on desktop
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <CircleHelp className="w-5 h-5" />
                                </div>
                                
                                <button onClick={toggleTheme} className="p-2 rounded-full flex items-center justify-center">
                                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-gray-800" />}
                                </button>
                                */}
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Search - visible when open on small screens */}
                    <div className="md:hidden mt-2">
                        {!isUserSelected && isSearchOpen && (
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
                </div>
                
                {/* Mobile Menu - slide down panel */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-900 m-2 mt-0 rounded-xl shadow-md p-4 animate-slideDown">
                        <div className="flex flex-col space-y-4">
                            {/* Uncomment if needed
                            <div className="flex items-center gap-2">
                                <CircleHelp className="w-5 h-5" />
                                <span>Help</span>
                            </div>
                            
                            <div className="flex items-center gap-2" onClick={toggleTheme}>
                                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                            </div>
                            */}
                            
                            {/* Add other mobile menu options here */}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Add slide-down animation */}
            <style jsx>{`
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default Navbar;