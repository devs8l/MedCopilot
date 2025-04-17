import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { MedContext } from "../context/MedContext";
import Calendar from "./Calendar";

const Sidebar = ({ isExpanded }) => {
    const { setIsExpanded } = useContext(MedContext);
    const navItems = [
        { path: "/", icon: '', text: "Home" },
        { path: "/patients", icon: '', text: "Patients" },
        { path: "/events", icon: '', text: "Events" },
        { path: "/user/1", icon: '', text: "Settings" },
    ];

    return (
        <div className="h-full bg-[#ffffff75] dark:bg-gray-800 shadow-lg flex flex-col">
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
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto" : "w-0"}`}>
                        <div className="flex flex-col text-left min-w-[120px]">
                            <h1 className="text-xl font-semibold whitespace-nowrap">MedCopilot</h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                Product by JNC Tech
                            </p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Calendar */}
            <div className={`transition-all duration-300 mt-3 mb-2 overflow-hidden ${isExpanded ? 'max-h-[250px]  animate-fadeInFast px-3' : 'max-h-0 animate-fadeOut px-1'}`}>
                <Calendar isExpanded={isExpanded} />
            </div>

            {/* Navigation */}
            <nav className="mt-2 flex-1 overflow-y-auto">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-lg transition-colors ${isActive
                                        ? "bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    }`
                                }
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                <span className={`ml-3 overflow-hidden transition-all ${isExpanded ? "opacity-100" : "opacity-0 w-0"}`}>
                                    {item.text}
                                </span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;