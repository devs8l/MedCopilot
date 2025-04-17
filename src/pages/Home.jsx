import { useContext, useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import Chat from "../components/Chat";
import { MedContext } from "../context/MedContext";
import MidHeader from "../components/MidHeader";
import DatePicker from "../components/DatePicker";
import DateSort from "../components/DateSort";
import Notes from "../components/Notes";
// import { DndContext } from "@dnd-kit/core";

const Home = () => {
  const { isExpanded, setIsExpanded, isSearchOpen, isUserSelected, isNotesExpanded } = useContext(MedContext);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [isMeasuring, setIsMeasuring] = useState(true);
  const location = useLocation();

  const isUserDetailView = location.pathname.includes('/user/');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setIsMeasuring(false);
    }
  }, [containerRef.current]);

  const getPanelWidths = () => {
    if (!containerRef.current || isMeasuring) {
      return { contentWidth: '35%', chatWidth: '65%', notesWidth: '0%' };
    }

    const totalWidth = containerRef.current.offsetWidth;
    const sidebarWidth = isExpanded ? 380 : 70;
    const availableWidth = totalWidth - sidebarWidth;

    // Fixed content width - always 35% of available space
    const fixedContentWidth = Math.floor(availableWidth * 0.35);

    // Notes width - either collapsed (40px) or expanded (25% of available)
    const notesWidth = isNotesExpanded ? Math.floor(availableWidth * 0.25) : 50;

    // Chat gets the remaining width
    const chatWidth = availableWidth - fixedContentWidth - notesWidth;

    return {
      contentWidth: fixedContentWidth,
      chatWidth: chatWidth,
      notesWidth: notesWidth
    };
  };

  const toggleMobileView = (view) => {
    setActiveTab(view);
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const renderMobileTabs = () => {
    return (
      <div className="flex h-14 dark:bg-gray-800 z-20">
        <button
          className={`flex-1 flex items-center justify-center ${activeTab === 'content' ? 'text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 dark:border-blue-400' : 'text-gray-500'}`}
          onClick={() => toggleMobileView('content')}
        >
          <span>Patients</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center ${activeTab === 'chat' ? 'text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 dark:border-blue-400' : 'text-gray-500'}`}
          onClick={() => toggleMobileView('chat')}
        >
          <span>Chat</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center ${activeTab === 'notes' ? 'text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 dark:border-blue-400' : 'text-gray-500'}`}
          onClick={() => toggleMobileView('notes')}
        >
          <span>Notes</span>
        </button>
      </div>
    );
  };

  const renderMobileSidebar = () => {
    return (
      <div className={`fixed inset-0 z-50 bg-[#ffffff34] bg-opacity-50 transition-opacity ${showMobileSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMobileSidebar}>
        <div className={`absolute top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 transform transition-transform duration-300 ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="p-4 flex justify-end">
            <button onClick={toggleMobileSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto h-full pb-16">
            <SideBar isExpanded={true} setIsExpanded={setIsExpanded} />
          </div>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <div ref={containerRef} className="flex flex-col h-full w-full">
        {/* Mobile Sidebar Overlay */}
        {renderMobileSidebar()}

        {/* Mobile Tabs */}
        {renderMobileTabs()}

        {/* Content View */}
        <div className={`h-full w-full pb-16 transition-opacity duration-300 ${activeTab === 'content' ? 'opacity-100 z-10' : 'opacity-0 z-0 hidden'}`}>
          <div className="bg-[#FFFFFF66] dark:bg-[#00000099] rounded-lg p-1.5 h-full">
            <MidHeader />
            <div className={`flex gap-3 items-center w-full mx-5 mb-3 justify-start ${isUserSelected ? 'hidden' : ''} ${isSearchOpen ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
              <DatePicker />
              <DateSort />
            </div>
            <Outlet />
          </div>
        </div>

        {/* Chat View */}
        <div className={`h-full w-full pb-16 transition-opacity duration-300 ${activeTab === 'chat' ? 'opacity-100 z-10' : 'opacity-0 z-0 hidden'}`}>
          <Chat isMobile={true} />
        </div>

        {/* Notes View - Mobile */}
        <div className={`h-full w-full pb-16 transition-opacity duration-300 ${activeTab === 'notes' ? 'opacity-100 z-10' : 'opacity-0 z-0 hidden'}`}>
          <Notes />
        </div>
      </div>
    );
  }

  const { contentWidth, chatWidth, notesWidth } = getPanelWidths();

  return (
    <div
      ref={containerRef}
      className="flex h-full px-1 w-full"
      style={{ visibility: isMeasuring ? 'hidden' : 'visible' }}
    >
      <div className="w-full flex h-[87vh] flex-col  md:flex-row gap-4">
        <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

        {/* Content section - fixed width */}
        <div className="flex flex-col" style={{ width: `${contentWidth}px`, flexShrink: 0 }}>
          <MidHeader />
          <div className="bg-[#FFFFFF66] dark:bg-[#00000099] h-full rounded-lg p-1.5">
            <div className={`flex gap-3 items-center w-full px-3 mb-3 justify-between ${location.pathname.includes('/patients') ? 'hidden' : ''} ${isUserSelected ? 'hidden' : ''} ${isSearchOpen ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
              <DatePicker />
              <DateSort />
            </div>
            <Outlet />
          </div>
        </div>

        {/* Chat section - adjusts width based on notes */}
        <div
          style={{
            width: `${chatWidth}px`,
            flexShrink: 0,
            transition: 'width 0.3s ease'
          }}
          className="relative"
        >
          <Chat />
        </div>

        {/* Notes section - collapsible with slim mode when collapsed */}
        <div
          className="rounded-lg overflow-hidden mt-12 transition-all duration-300 ease-in-out"
          style={{
            width: `${notesWidth}px`,
            flexShrink: 0,
            transition: 'width 0.3s ease'
          }}
        >
          <Notes />
        </div>
      </div>
    </div>

  );
};

export default Home;