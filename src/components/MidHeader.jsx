import { CalendarMinus2, FileText, User } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const MidHeader = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Determine the title based on the current path
  const getTitle = () => {
    if (path === "/patients") return "Patients";
    if (path === "/events") return "Events";
    return "Appointments";
  };
  
  return (
    <div className="w-full mb-2 sm:mb-4 p-3 sm:p-5 overflow-auto">
      <h2 className="text-lg sm:text-xl text-[#222836] dark:text-white font-semibold mb-2 sm:mb-4">{getTitle()}</h2>
      
      <div className="flex gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
        <Link 
          to="/"
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 ${path === "/"? "bg-white dark:bg-black dark:text-white rounded-xs drop-shadow-lg" : "  rounded-sm drop-shadow-lg text-[#22283699] dark:text-gray-300"}`}
        >
          <FileText size={16} className="sm:w-5 sm:h-5"/>
          Appointments
        </Link>
        
        <Link 
          to="/patients"
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 ${path === "/patients" ? "bg-white dark:bg-black dark:text-white rounded-xs drop-shadow-lg" : "  rounded-sm drop-shadow-lg text-[#22283699] dark:text-gray-300"}`}
        >
          <User size={16} className="sm:w-5 sm:h-5"/>
          Patients
        </Link>
        
        <Link 
          to="/events"
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 ${path === "/events" ? "bg-white dark:bg-black dark:text-white rounded-xs drop-shadow-lg" : "  rounded-sm drop-shadow-lg text-[#22283699] dark:text-gray-300"}`}
        >
          <CalendarMinus2 size={16} className="sm:w-5 sm:h-5"/>
          Events
        </Link>
      </div>
    </div>
  );
};

export default MidHeader;