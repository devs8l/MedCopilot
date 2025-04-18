import { useContext ,useState} from "react";
import { NavLink, Link } from "react-router-dom";
import { MedContext } from "../context/MedContext";
import Calendar from "./Calendar";
import { 
  FileText, 
  User as UserIcon, 
  Calendar as CalendarIcon, 
  Settings, 
  Search, 
  X, 
  CircleHelp, 
  Sun, 
  Moon, 
  LogOut,
  Bell
} from "lucide-react";
import NotificationPopup from "./NotificationPopup";


const Sidebar = ({ isExpanded }) => {
    const { setIsExpanded, isUserSelected, setIsSearchOpen, isSearchOpen } = useContext(MedContext);
    // const { theme, toggleTheme } = useTheme();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    const navItems = [
        { 
            path: "/", 
            icon: <FileText size={20} />, 
            text: "Appointments",
            title: "Appointments"
        },
        { 
            path: "/patients", 
            icon: <UserIcon size={20} />, 
            text: "Patients",
            title: "Patients"
        },
        { 
            path: "/events", 
            icon: <CalendarIcon size={20} />, 
            text: "Events",
            title: "Events"
        },
        { 
            path: "/settings", 
            icon: <Settings size={20} />, 
            text: "Settings",
            title: "Settings"
        },
    ];

    return (
        <div className="h-full bg-[#ffffff75] dark:bg-gray-800 shadow-lg flex flex-col justify-between">
            {/* Main Content */}
            <div>
                {/* Header */}
                <div className="py-5 px-5 flex items-center border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-3 w-full"
                        aria-label="Toggle sidebar"
                    >
                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                            {isExpanded ? (
                                <img src="/ham-c.svg" className="w-5 h-5" alt="Close menu" />
                            ) : (
                                <img src="/ham-e.svg" className="w-5 h-5" alt="Open menu" />
                            )}
                        </div>
                        {isExpanded && (
                            <div className="flex flex-col text-left min-w-[120px]">
                                <h1 className="text-xl font-semibold whitespace-nowrap">MedCopilot</h1>
                                <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                    Product by JNC Tech
                                </p>
                            </div>
                        )}
                    </button>
                </div>

                {/* Calendar - Only shown when expanded */}
                {/* {isExpanded && (
                    <div className="mt-3 mb-2 px-3">
                        <Calendar isExpanded={isExpanded} />
                    </div>
                )} */}

                {/* Navigation */}
                <nav className="mt-2 flex-1 ">
                    <ul className="space-y-1 px-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    title={item.title}
                                    className={({ isActive }) =>
                                        `flex items-center p-3 rounded-lg transition-colors ${isActive
                                            ? "bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`
                                    }
                                >
                                    <div className={`flex items-center ${isExpanded ? "gap-3" : "justify-center w-full"}`}>
                                        {item.icon}
                                        {isExpanded && (
                                            <span>{item.text}</span>
                                        )}
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Bottom Action Icons */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                <ul className="space-y-2">
                    {/* Search */}
                    {!isUserSelected && (
                        <li>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`flex items-center p-3 rounded-lg w-full ${isExpanded ? "justify-start gap-3" : "justify-center"}`}
                                aria-label={isSearchOpen ? "Close search" : "Open search"}
                            >
                                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                                {isExpanded && <span>{isSearchOpen ? "Close Search" : "Search"}</span>}
                            </button>
                        </li>
                    )}

                    {/* Help */}
                    <li>
                        <button 
                            className={`flex items-center p-3 rounded-lg w-full ${isExpanded ? "justify-start gap-3" : "justify-center"}`}
                            title="Help"
                        >
                            <CircleHelp size={20} />
                            {isExpanded && <span>Help</span>}
                        </button>
                    </li>

                    {/* Notifications */}
                    {/* <li>
                        <div className={`flex items-center p-3 rounded-lg ${isExpanded ? "justify-start gap-3" : "justify-center"}`}>
                            <NotificationPopup iconSize={20} />
                            {isExpanded && <span>Notifications</span>}
                        </div>
                    </li> */}

                    {/* Profile Dropdown */}
                    <li>
                        <div className="relative">
                            <button
                                className={`flex items-center p-3 rounded-lg w-full ${isExpanded ? "justify-start gap-3" : "justify-center"}`}
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                aria-label="Toggle profile menu"
                            >
                                <div className="w-6 h-6 rounded-full overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src="/doc-dp.png"
                                        alt="User profile"
                                    />
                                </div>
                                {isExpanded && <span>Profile</span>}
                            </button>

                            {isProfileDropdownOpen && (
                                <div className={`absolute ${isExpanded ? "left-full ml-2" : "left-0"} bottom-0 mb-2 bg-white dark:bg-gray-900 rounded-xl shadow-md p-2 z-50 animate-slideDown w-48`}>
                                    <div className="flex flex-col space-y-2">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <UserIcon size={16} />
                                            <span className="text-sm">Profile</span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <Settings size={16} />
                                            <span className="text-sm">Settings</span>
                                        </Link>
                                        <div
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                                            onClick={() => {
                                                // toggleTheme();
                                                setIsProfileDropdownOpen(false);
                                            }}
                                        >
                                            {theme === "dark" ?
                                                <Sun size={16} /> :
                                                <Moon size={16} />
                                            }
                                            <span className="text-sm">
                                                {/* {theme === "dark" ? "Light Mode" : "Dark Mode"} */}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer text-red-500"
                                            onClick={() => {
                                                // logout();
                                                setIsProfileDropdownOpen(false);
                                            }}
                                        >
                                            <LogOut size={16} />
                                            <span className="text-sm">Logout</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;