import { Menu, Moon, Sun, Search, CircleHelp, ChevronLeft, X, LogOut, User, CircleCheck, UserX, ClockAlert, Bell, Bolt } from 'lucide-react';
import React, { useState, useEffect, useContext, useRef } from 'react';
import DatePicker from './DatePicker';
import DateSort from './DateSort';
import { Link } from 'react-router-dom';
import { MedContext } from '../context/MedContext'; // Import context
import NotificationPopup from './NotificationPopup';

const Navbar = () => {
    const { searchQuery, setSearchQuery, isUserSelected, setIsUserSelected, logout, isExpanded, setIsExpanded, setSelectedUser } = useContext(MedContext);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const searchInputRef = useRef(null);
    const mobileMenuRef = useRef(null);

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

    // Focus search input when search is opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
                !event.target.closest('[data-menu-toggle]')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle escape key press to close menus
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                if (isSearchOpen) setIsSearchOpen(false);
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isSearchOpen, isMobileMenuOpen]);

    // Format date for different screen sizes
    const formatDate = () => {
        const now = new Date();
        const isSmallScreen = window.innerWidth < 640;
        const dateOptions = { 
            day: 'numeric', 
            month: isSmallScreen ? 'short' : 'long', 
            weekday: isSmallScreen ? undefined : 'long'
        };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        
        return {
            date: now.toLocaleDateString('en-US', dateOptions),
            time: now.toLocaleTimeString([], timeOptions)
        };
    };

    const { date, time } = formatDate();

    return (
        <>
            <div className="flex flex-col w-full">
                {/* Main Navbar */}
                <div className="dark:text-white rounded-xl py-2 px-2 sm:px-3 m-2">
                    <div className="flex items-center justify-between">
                        {/* Left Section - Logo and Toggle */}
                        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)} 
                                className="rounded-md cursor-pointer w-8 h-8 flex items-center justify-center"
                                aria-label="Toggle sidebar"
                            >
                                {isExpanded ? 
                                    <img src="/ham-c.svg" className="w-4 h-4 sm:w-5 sm:h-5" alt="Close menu" /> :
                                    <img src="/ham-e.svg" className="w-4 h-4 sm:w-5 sm:h-5" alt="Open menu" />
                                }
                            </button>

                            <div className="my-1">
                                <h1 className="text-base sm:text-lg md:text-xl font-semibold">MedCopilot</h1>
                                <p className="text-xs text-gray-600 dark:text-gray-400 hidden xs:block">Product by JNC Tech</p>
                            </div>

                            <div className="flex gap-1 sm:gap-2 md:gap-4 px-2 sm:px-4 md:px-8 overflow-x-auto no-scrollbar">
                                <button className="py-1 bg-[#7c797925] rounded-xs flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 whitespace-nowrap">
                                    <User size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5"/>
                                    <h1 className="text-xs sm:text-sm">15</h1>
                                </button>
                                <button className="py-1 bg-[#7c797925] rounded-xs flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 whitespace-nowrap">
                                    <ClockAlert size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5"/> 
                                    <h1 className="text-xs sm:text-sm">1</h1>
                                </button>
                                <button className="py-1 bg-[#7c797925] rounded-xs flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 whitespace-nowrap">
                                    <CircleCheck size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5"/>
                                    <h1 className="text-xs sm:text-sm">3</h1>
                                </button>
                            </div>
                        </div>

                        {/* Center Section - Search bar on medium+ screens */}
                        <div className="hidden md:flex items-center justify-center flex-1 mx-4">
                            {!isUserSelected && (
                                <div className={`w-full max-w-md transition-opacity duration-300 ease-in-out ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                    {isSearchOpen && (
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg px-4 py-2 w-full focus:outline-none"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Section - Date and Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                            {/* Date/Time display - responsive versions */}
                            <div className="hidden sm:block text-xs sm:text-sm md:text-md whitespace-nowrap truncate">
                                {date} | {time}
                            </div>

                            {/* Mobile date display */}
                            <div className="sm:hidden text-xs whitespace-nowrap truncate max-w-20">
                                {date} | {time}
                            </div>

                            {/* Search toggle button */}
                            {!isUserSelected && (
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="w-8 h-8 flex items-center justify-center"
                                    aria-label={isSearchOpen ? "Close search" : "Open search"}
                                    data-menu-toggle
                                >
                                    {isSearchOpen ? 
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                                    }
                                </button>
                            )}
                            
                            {/* Action icons - responsive sizing */}
                            <CircleHelp className="w-4 h-4 sm:w-5 sm:h-5" />
                            <NotificationPopup />
                            <Bolt className="w-4 h-4 sm:w-5 sm:h-5" />
                            
                            {/* Mobile menu toggle button */}
                            <button 
                                className="md:hidden w-8 h-8 flex items-center justify-center" 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle mobile menu"
                                data-menu-toggle
                            >
                                {isMobileMenuOpen ? 
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                                    <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                                }
                            </button>
                            
                            {/* Desktop theme toggle - hidden for now as per original */}
                            <div className="hidden md:flex items-center gap-4">
                                {/* Uncomment if needed
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
                                ref={searchInputRef}
                                type="text"
                                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg px-4 py-2 w-full focus:outline-none"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        )}
                    </div>
                </div>
                
                {/* Mobile Menu - slide down panel */}
                {isMobileMenuOpen && (
                    <div 
                        ref={mobileMenuRef}
                        className="md:hidden bg-white dark:bg-gray-900 m-2 mt-0 rounded-xl shadow-md p-4 animate-slideDown z-40"
                    >
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center gap-2" onClick={toggleTheme}>
                                {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                                <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <CircleHelp className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm">Help Center</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm">Profile</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm">Logout</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Add slide-down animation */}
            <style jsx="true">{`
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                @media (max-width: 400px) {
                    .xs\\:block {
                        display: block;
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;