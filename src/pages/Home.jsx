import { useContext, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Chat from "../components/Chat";
import { MedContext } from "../context/MedContext";
import MidHeader from "../components/MidHeader";
import DatePicker from "../components/DatePicker";
import DateSort from "../components/DateSort";
import Notes from "../components/Notes";

const Home = () => {
  const {
    isSearchOpen,
    isUserSelected,
    isNotesExpanded,
    isContentExpanded,
    setIsContentExpanded
  } = useContext(MedContext);
  const containerRef = useRef(null);
  const location = useLocation();

  // Base widths when nothing is expanded
  const baseContentWidth = isUserSelected ? 'w-[20%]' : 'w-[7%]';
  const baseChatWidth = isUserSelected ? 'w-[75%]' :'w-[88%]';
  const baseNotesWidth = 'w-[5%]';

  // Expanded widths
  const expandedContentWidth = 'w-[35%]';
  const expandedNotesWidth = 'w-[25%]';

  // Calculate chat width based on expansions
  const getChatWidth = () => {
    if (isContentExpanded && isNotesExpanded) {
      // Both expanded: 100% - 35% (content) - 25% (notes) = 40%
      return 'w-[40%]';
    }
    if (isContentExpanded) {
      // Only content expanded: 100% - 35% (content) - 5% (notes) = 60%
      return 'w-[60%]';
    }
    if (isNotesExpanded) {
      // Only notes expanded: 100% - 5% (content) - 25% (notes) = 70%
      return isUserSelected ? 'w-[55%]' :'w-[68%]';
    }
    // Default case: neither expanded
    return baseChatWidth;
  };

  return (
    <div ref={containerRef} className="flex h-[87vh] w-full">
      <div className="flex flex-col md:flex-row w-full h-full gap-4">
        {/* Content section */}
        <div className={`${isContentExpanded ? expandedContentWidth : baseContentWidth} overflow-hidden flex flex-col transition-all duration-300`}>
          {/* <MidHeader /> */}
          <div className="bg-[#FFFFFF66] dark:bg-[#00000099] h-full rounded-lg p-1.5">
            <div className={`flex gap-3 ${isContentExpanded ? '': 'hidden'} ${isUserSelected ? 'animate-fadeOut w-0':'animate-fadeInFast w-full'}  items-center w-full px-3 mb-3 justify-between ${location.pathname.includes('/patients') ? 'hidden' : ''} ${isUserSelected ? 'hidden' : ''} ${isSearchOpen ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
              <DatePicker />
              <DateSort />
            </div>
            <Outlet />
          </div>
        </div>

        {/* Chat section - adjusts based on other sections' expansion */}
        <div className={`${getChatWidth()} h-full flex-shrink-0 transition-all duration-300`}>
          <Chat />
        </div>

        {/* Notes section - independent expansion */}
        <div className={`${isNotesExpanded ? expandedNotesWidth : baseNotesWidth} flex-shrink-0 transition-all duration-300`}>
          <Notes />
        </div>
      </div>
    </div>
  );
};

export default Home;