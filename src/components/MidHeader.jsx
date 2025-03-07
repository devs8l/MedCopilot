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
    <div className="w-full mb-4 p-5 overflow-auto">
      <h2 className="text-xl text-[#222836] font-semibold mb-4">{getTitle()}</h2>
      
      <div className="flex gap-3 flex-wrap text-sm">
        <Link 
          to="/"
          className={`flex items-center gap-2 px-4 py-2 ${path === "/"? "bg-white rounded-sm drop-shadow-lg" : "  rounded-sm drop-shadow-lg dark:text-gray-300"}`}
        >
          <FileText size={20}/>
          Appointments
        </Link>
        
        <Link 
          to="/patients"
          className={`flex items-center gap-2 px-4 py-2 ${path === "/patients" ? "bg-white rounded-sm drop-shadow-lg" : "  rounded-sm drop-shadow-lg dark:text-gray-300"}`}
        >
          <User size={20}/>
          Patients
        </Link>
        
        <Link 
          to="/events"
          className={`flex items-center gap-2 px-4 py-2 ${path === "/events" ? "bg-white rounded-sm drop-shadow-lg" : "  rounded-sm drop-shadow-lg dark:text-gray-300"}`}
        >
          <CalendarMinus2 size={20}/>
          Events
        </Link>
      </div>
    </div>
  );
};

export default MidHeader;