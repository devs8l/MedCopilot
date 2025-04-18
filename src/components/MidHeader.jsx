import { CalendarMinus2, FileText, User } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { MedContext } from "../context/MedContext";

const MidHeader = () => {
  const location = useLocation();
  const path = location.pathname;
  const { isUserSelected ,setIsContentExpanded,
    isContentExpanded } = useContext(MedContext);

  // Determine the title based on the current path
  const getTitle = () => {
    if (path === "/patients") return "Patients";
    if (path === "/events") return "Events";
    return "Appointments";
  };

  // Check if current path is the root or starts with /user/ (indicating a user was selected from appointments)
  const isAppointmentsActive = path === "/" || (path.startsWith("/user/") && isUserSelected);

  return (
    <div className="w-full mb-2 sm:mb-3 ">
      {/* <h2 className="text-lg sm:text-xl text-[#222836] dark:text-white font-semibold mb-2 sm:mb-4">{getTitle()}</h2> */}

      <div className="flex gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
        <Link
          to="/"
          title="Appointments"
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 ${isAppointmentsActive ? "bg-white dark:bg-black dark:text-white rounded-lg drop-shadow-lg" : "rounded-md bg-[#ffffff49] drop-shadow-lg text-[#22283699] dark:text-gray-300"}`}
        >
          <FileText size={16} className="sm:w-5 sm:h-5" />
          {/* Appointments */}
        </Link>

        <Link
          to="/patients"
          title="Patients"
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 ${path === "/patients" ? "bg-white dark:bg-black dark:text-white rounded-lg drop-shadow-lg" : "rounded-sm bg-[#ffffff49] drop-shadow-lg text-[#22283699] dark:text-gray-300"}`}
        >
          <User size={16} className="sm:w-5 sm:h-5" />
          {/* Patients */}
        </Link>

        <Link
          to="/events"
          title="Events"
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 ${path === "/events" ? "bg-white dark:bg-black dark:text-white rounded-lg drop-shadow-lg" : "rounded-sm bg-[#ffffff49] drop-shadow-lg text-[#22283699] dark:text-gray-300"}`}
        >
          <CalendarMinus2 size={16} className="sm:w-5 sm:h-5" />
          {/* Events */}
        </Link>
        
      </div>
    </div>
  );
};

export default MidHeader;