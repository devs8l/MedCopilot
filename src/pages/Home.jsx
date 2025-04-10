import { useContext, useState, useEffect,useRef } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Chat from "../components/Chat";
import { MedContext } from "../context/MedContext";
import MidHeader from "../components/MidHeader";
import DatePicker from "../components/DatePicker";
import DateSort from "../components/DateSort";

const Home = () => {
  const { isExpanded, setIsExpanded } = useContext(MedContext);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef(null);
  const { isSearchOpen, isUserSelected } = useContext(MedContext);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'chat'
  const isUserDetailView = location.pathname.includes('/user/');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 768); // 768px is typical md breakpoint
    };

    // Call once on mount to set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate panel widths based on 70-30 ratio
  const getPanelWidths = () => {
    if (!containerRef.current) return { contentWidth: 0, chatWidth: 0 };

    const totalWidth = containerRef.current.offsetWidth;
    const sidebarWidth = isExpanded ? 350 : 70;
    const availableWidth = totalWidth - sidebarWidth;

    // Maintain 70-30 ratio (content-chat) by default
    const contentWidth = availableWidth * 0.35;
    const chatWidth = availableWidth * 0.65;

    return {
      contentWidth,
      chatWidth
    };
  };

  const handleSwapPosition = (swapTo) => {
    setIsSwapped(swapTo);
    if (isFullScreen) setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Dynamic width calculation for fullscreen mode based on sidebar state
  const getFullScreenWidth = () => {
    if (!containerRef.current) return '100%';

    if (isMobile) {
      return '100%';
    }

    const totalWidth = containerRef.current.offsetWidth;
    const sidebarWidth = isExpanded ? 350 : 70;
    return `${totalWidth - sidebarWidth}px`;
  };

  // Toggle between content and chat views on mobile
  const toggleMobileView = (view) => {
    setActiveTab(view);
  };

  // Toggle mobile sidebar visibility
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Render mobile navigation tabs
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
      </div>
    );
  };

  // Render mobile sidebar overlay
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
          <Chat
            swapPosition={handleSwapPosition}
            isSwapped={false}
            toggleFullScreen={toggleFullScreen}
            isFullScreen={true}
            isMobile={true}
          />
        </div>
      </div>
    );
  }

  // Get the calculated widths for desktop view
  const { contentWidth, chatWidth } = getPanelWidths();

  return (
    <div ref={containerRef} className={`flex h-full ${isFullScreen ? 'px-0' : 'px-1'} w-full`}>
      {isSwapped ? (
        // Swapped layout (chat on left, content on right)
        <div className="w-full flex h-[86vh] justify-between flex-col md:flex-row gap-3">
          {/* Sidebar */}
          <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

          {/* Chat */}
          <div
            style={{
              width: isFullScreen ? getFullScreenWidth() : `${chatWidth}px`,
              flexShrink: 0,
              marginLeft: isFullScreen ? '0' : '0px',
              left: isFullScreen ? (isExpanded ? '350px' : '70px') : null,
              position: isFullScreen ? 'absolute' : 'relative',
            }}
            className={isFullScreen ? 'w-full' : ''}
          >
            <Chat
              swapPosition={handleSwapPosition}
              isSwapped={isSwapped}
              toggleFullScreen={toggleFullScreen}
              isFullScreen={isFullScreen}
            />
          </div>

          {/* Content area */}
          {!isFullScreen && (
            <div className="flex flex-col flex-1" style={{ width: `${contentWidth}px` }}>
              <MidHeader />
              <div
                className="bg-[#FFFFFF66] dark:bg-[#00000099] h-full rounded-lg p-1.5"
                
              >
                <div className={`flex gap-3 items-center w-full mx-5 mb-3 justify-start ${location.pathname.includes('/patients') ? 'hidden' : ''} ${isUserSelected ? 'hidden' : ''} ${isSearchOpen ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
                  <DatePicker />
                  <DateSort />
                </div>
                <Outlet />
              </div>
            </div>
          )}
        </div>
      ) : (
        // Original layout (content on left, chat on right)
        <div className="w-full flex h-[86vh] flex-col justify-between md:flex-row gap-3">
          {/* Sidebar */}
          <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

          {/* Content area */}
          {!isFullScreen && (
            <div className="flex flex-col flex-1 " style={{ width: `${contentWidth}px` }}>
              <MidHeader />
              <div
                className="bg-[#FFFFFF66] dark:bg-[#00000099] h-full rounded-lg p-1.5"
                
              >
                <div className={`flex gap-3 items-center w-full mx-5 mb-3 justify-start ${location.pathname.includes('/patients') ? 'hidden' : ''} ${isUserSelected ? 'hidden' : ''} ${isSearchOpen ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
                  <DatePicker />
                  <DateSort />
                </div>
                <Outlet />
              </div>
            </div>
          )}

          {/* Chat */}
          <div
            style={{
              width: isFullScreen ? getFullScreenWidth() : `${chatWidth}px`,
              maxWidth: '100vw',  // Prevent overflow
              flexShrink: 0,
              marginLeft: isFullScreen ? '0' : '0px',
              left: isFullScreen ? (isExpanded ? '350px' : '70px') : null,
              position: isFullScreen ? 'absolute' : 'relative',
            }}
            className={isFullScreen ? 'w-full' : ''}
          >
            <Chat
              swapPosition={handleSwapPosition}
              isSwapped={isSwapped}
              toggleFullScreen={toggleFullScreen}
              isFullScreen={isFullScreen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;