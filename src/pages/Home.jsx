import { useContext, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Chat from "../components/Chat";
import { MedContext } from "../context/MedContext";
import MidHeader from "../components/MidHeader";
import DatePicker from "../components/DatePicker";
import DateSort from "../components/DateSort";
import Notes from "../components/Notes";

const Home = () => {
  const { isSearchOpen, isUserSelected, isNotesExpanded } = useContext(MedContext);
  const containerRef = useRef(null);
  const location = useLocation();

  return (
    <div ref={containerRef} className="flex h-[87vh] w-full">
      <div className="flex flex-col md:flex-row w-full h-full gap-4">
        {/* Content section */}
        <div className="flex-1 min-w-0 flex flex-col">
          <MidHeader />
          <div className="bg-[#FFFFFF66] dark:bg-[#00000099] h-full rounded-lg p-1.5">
            <div className={`flex gap-3 items-center w-full px-3 mb-3 justify-between ${
              location.pathname.includes('/patients') ? 'hidden' : ''} ${
              isUserSelected ? 'hidden' : ''} ${
              isSearchOpen ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
              <DatePicker />
              <DateSort />
            </div>
            <Outlet />
          </div>
        </div>

        {/* Chat section */}
        <div className={`${isNotesExpanded ? 'w-[45%]' : 'w-3/5'} h-full flex-shrink-0 transition-all duration-300`}>
          <Chat />
        </div>

        {/* Notes section */}
        <div className={`${isNotesExpanded ? 'w-[20%]' : 'w-[4%] '} mt-12  flex-shrink-0 transition-all duration-200`}>
          <Notes />
        </div>
      </div>
    </div>
  );
};

export default Home;