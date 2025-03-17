import { useContext, useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Chat from "../components/Chat";
import { MedContext } from "../context/MedContext";
import MidHeader from "../components/MidHeader";
import DatePicker from "../components/DatePicker";
import DateSort from "../components/DateSort";


// Improved Resizer with better event handling and throttling
const Resizer = ({ onResize, orientation = "vertical", className = "", isExpanded }) => {
  const resizerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lastResizeTime = useRef(0);

  // Track starting positions for precise calculations
  const dragInfo = useRef({
    startX: 0,
    startChatWidth: 0,
    containerLeft: 0,
    sidebarWidth: 0
  });

  // Throttle resize events to improve performance
  const throttledResize = (e, dragInfoData) => {
    const now = Date.now();
    if (now - lastResizeTime.current > 16) { // ~60fps throttle
      onResize(e.clientX, dragInfoData);
      lastResizeTime.current = now;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      // Throttle resize for performance
      throttledResize(e, dragInfo.current);
      e.preventDefault();
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    // Add event listeners when dragging starts
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = orientation === "vertical" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
    }

    // Clean up on unmount or when dragging stops
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onResize, orientation]);

  // Force cleanup if component unmounts during drag
  useEffect(() => {
    return () => {
      if (isDragging) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    e.stopPropagation();

    // Store all initial values needed for precise calculations
    dragInfo.current.startX = e.clientX;

    // These will be set by the parent component
    dragInfo.current.startChatWidth = 0;
    dragInfo.current.containerLeft = 0;
    dragInfo.current.sidebarWidth = 0;

    setIsDragging(true);
  };

  return (
    <div
      ref={resizerRef}
      className={`
        ${orientation === "vertical" ? "w-1 cursor-col-resize" : "h-2 cursor-row-resize my-1"}
        transition-colors duration-150 ease-in-out rounded-full flex items-center justify-center
        ${isExpanded ? 'mx-0.5' : 'mx-0'}
        ${className}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Handle dots for visual feedback - improved visibility */}
      <div className={`flex ${orientation === "vertical" ? "flex-col" : "flex-row"} gap-0.5`}>
        <div className={`w-1 h-1 ${isDragging || hovered ? "bg-gray-700" : "bg-gray-500"} rounded-full`}></div>
        <div className={`w-1 h-1 ${isDragging || hovered ? "bg-gray-700" : "bg-gray-500"} rounded-full`}></div>
        <div className={`w-1 h-1 ${isDragging || hovered ? "bg-gray-700" : "bg-gray-500"} rounded-full`}></div>
      </div>
    </div>
  );
};

const Home = () => {
  const { isExpanded, setIsExpanded } = useContext(MedContext);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatWidth, setChatWidth] = useState(800);
  const [contentWidth, setContentWidth] = useState(0);
  const containerRef = useRef(null);
  const layoutRef = useRef({ lastChatWidth: 1100 });
  const {isSearchOpen,isUserSelected} = useContext(MedContext);
  const isUserDetailView = location.pathname.includes('/user/');
  // Calculate and set panel widths with constraints
  const calculatePanelWidths = (newChatWidth) => {
    if (containerRef.current) {
      const totalWidth = containerRef.current.offsetWidth;
      const sidebarWidth = isExpanded ? 350 : 20; // Match with SideBar component's width
      const availableWidth = totalWidth - sidebarWidth; // Reduced margin for tighter spacing

      // Set minimum and maximum widths for chat
      const minChatWidth = Math.min(700, availableWidth * 0.3);
      const maxChatWidth = Math.min(isUserDetailView ? 950 : 950, availableWidth * 0.7);

      // When toggling sidebar, maintain proportions rather than fixed widths
      let constrainedChatWidth;
      if (newChatWidth === undefined) {
        // When sidebar toggled, maintain the same proportion for chat
        constrainedChatWidth = Math.max(minChatWidth,
          Math.min(chatWidth * availableWidth / (totalWidth - (isExpanded ? 70 : 350) - 5), maxChatWidth));
      } else {
        constrainedChatWidth = Math.max(minChatWidth, Math.min(newChatWidth, maxChatWidth));
      }

      // Calculate content width based on available space
      const newContentWidth = availableWidth - constrainedChatWidth - 5;

      setChatWidth(constrainedChatWidth);
      setContentWidth(newContentWidth);
    }
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Recalculate when sidebar state changes
  useEffect(() => {
    if (!isFullScreen) {
      calculatePanelWidths();
    }
  }, [windowWidth, isExpanded, isFullScreen,location.pathname]);

  useEffect(() => {
    // Save chat width when going fullscreen
    if (isFullScreen) {
      layoutRef.current.lastChatWidth = chatWidth;
    } else {
      // Restore previous width when exiting fullscreen
      calculatePanelWidths(layoutRef.current.lastChatWidth);
    }
  }, [isFullScreen]);

  const handleSwapPosition = (swapTo) => {
    setIsSwapped(swapTo);
    if (isFullScreen) setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Dynamic width calculation for fullscreen mode based on sidebar state
  const getFullScreenWidth = () => {
    if (!containerRef.current) return '100vw';
    const totalWidth = containerRef.current.offsetWidth;
    const sidebarWidth = isExpanded ? 350 : 70;
    return `min(100vw, ${totalWidth - sidebarWidth}px)`;
  };

  // Precise resizing function that directly translates mouse position to panel width
  const handleChatResize = (mouseX, dragInfo) => {
    if (!containerRef.current) return;

    // On first call, initialize the drag info with current values
    if (dragInfo.startChatWidth === 0) {
      dragInfo.startChatWidth = chatWidth;
      dragInfo.containerLeft = containerRef.current.getBoundingClientRect().left;
      dragInfo.sidebarWidth = isExpanded ? 350 : 70;
    }

    let newChatWidth;

    if (isSwapped) {
      // When swapped, chat is on left side after sidebar
      // Calculate based on absolute position (sidebar width + desired chat width = mouse position)
      newChatWidth = mouseX - dragInfo.containerLeft - dragInfo.sidebarWidth;
    } else {
      // When not swapped, chat is on right side
      // Calculate from right edge of container
      const containerRight = dragInfo.containerLeft + containerRef.current.offsetWidth;
      newChatWidth = containerRight - mouseX;
    }

    calculatePanelWidths(newChatWidth);
  };

  return (
    <div ref={containerRef} className={`flex h-full ${isFullScreen ? 'px-0' : 'px-1'} w-full`}>
      {isSwapped ? (
        // Swapped layout
        <div className="w-full flex h-[86vh] justify-between flex-col sm:flex-row">
          {/* Sidebar */}
          <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

          {/* Chat with no transition for direct response */}
          <div
            style={{
              width: isFullScreen ? getFullScreenWidth() : `${chatWidth}px`,
              flexShrink: 0,
              marginLeft: isFullScreen ? '0' : '0px',
            }}
          >
            <Chat
              swapPosition={handleSwapPosition}
              isSwapped={isSwapped}
              toggleFullScreen={toggleFullScreen}
              isFullScreen={isFullScreen}
            />
          </div>

          {/* Resizer - only visible when not in fullscreen */}
          {!isFullScreen && (
            <Resizer
              onResize={handleChatResize}
              className="h-full self-stretch"
              isExpanded={isExpanded}
            />
          )}

          {/* Content area with no transition for direct response */}
          {!isFullScreen && (
            <div
              className="bg-[#FFFFFF66] dark:bg-[#00000099] rounded-lg p-1.5"
              style={{ width: `${contentWidth}px` }}
            >
              <MidHeader />
              <div className={`flex gap-3 items-center w-full mx-5 mb-3 justify-start ${isUserSelected ? 'hidden' : ''} ${isSearchOpen ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
                <DatePicker />
                <DateSort />
              </div>
              <Outlet />
            </div>
          )}
        </div>
      ) : (
        // Original layout
        <div className="w-full flex h-[86vh] flex-col justify-between sm:flex-row">
          {/* Sidebar */}
          <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

          {/* Content area with no transition for direct response */}
          {!isFullScreen && (
            <div
              className="bg-[#ffffff66] dark:bg-[#00000099] rounded-lg p-1.5 overflow-hidden"
              style={{ width: `${contentWidth}px` }}
            >
              <MidHeader />
              <div className={`flex gap-3 items-center w-full mx-5 mb-3  ${isUserSelected ? 'hidden' : ''} justify-start ${isSearchOpen ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
                <DatePicker />
                <DateSort />
              </div>
              <Outlet />
            </div>
          )}

          {/* Resizer - only visible when not in fullscreen */}
          {!isFullScreen && (
            <Resizer
              onResize={handleChatResize}
              className="h-full self-stretch"
              isExpanded={isExpanded}
            />
          )}

          {/* Chat with no transition for direct response */}
          <div
            style={{
              width: isFullScreen ? getFullScreenWidth() : `${chatWidth}px`,
              maxWidth: '100vw',  // Prevent overflow
              flexShrink: 0,
              marginLeft: isFullScreen ? '0' : '0px',
            }}
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