import { useContext, useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Chat from "../components/Chat";
import { MedContext } from "../context/MedContext";

// Resizer with direct mouse tracking
const Resizer = ({ onResize, orientation = "vertical", className = "" }) => {
  const resizerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Track starting positions for precise calculations
  const dragInfo = useRef({
    startX: 0,
    startChatWidth: 0,
    containerLeft: 0,
    sidebarWidth: 0
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      // Direct mouse position tracking for exact positioning
      onResize(e.clientX, dragInfo.current);
      e.preventDefault();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = orientation === "vertical" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onResize, orientation]);

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
        ${orientation === "vertical" ? "w-2 cursor-col-resize mx-1" : "h-2 cursor-row-resize my-1"}
        ${isDragging ? "" : hovered ? "" : " bg-opacity-50"}
        transition-colors duration-150 ease-in-out rounded-full flex items-center justify-center
        ${className}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Handle dots for visual feedback */}
      <div className={`flex ${orientation === "vertical" ? "flex-col" : "flex-row"} gap-1`}>
        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
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
  const layoutRef = useRef({ lastChatWidth: 800 });

  // Calculate and set panel widths with constraints
  const calculatePanelWidths = (newChatWidth) => {
    if (containerRef.current) {
      const totalWidth = containerRef.current.offsetWidth;
      const sidebarWidth = isExpanded ? 350 : 70;
      const availableWidth = totalWidth - sidebarWidth - 10; // 10px for margins and resizer

      // Set minimum and maximum widths for chat
      const minChatWidth = Math.min(300, availableWidth * 0.3);
      const maxChatWidth = Math.min(1200, availableWidth * 0.7);
      const constrainedChatWidth = Math.max(minChatWidth, Math.min(newChatWidth || chatWidth, maxChatWidth));

      // Calculate content width based on available space
      const newContentWidth = availableWidth - constrainedChatWidth - 10;

      setChatWidth(constrainedChatWidth);
      setContentWidth(newContentWidth);
    }
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
      const handleResize = () => {
          setWindowWidth(window.innerWidth); // Trigger a re-render
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  useEffect(() => {
      if (!isFullScreen) {
          calculatePanelWidths(); // Ensure correct width calculation
      }
  }, [windowWidth, isExpanded, isFullScreen]); // Trigger recalculation on resize
  

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
    <div ref={containerRef} className={`flex h-full ${isFullScreen ? 'px-0' : 'px-2'} w-full `}>
      {isSwapped ? (
        // Swapped layout
        <div className="w-full flex h-[80vh] justify-between  flex-col sm:flex-row">
          {/* Sidebar */}
          <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

          {/* Chat with no transition for direct response */}
          <div
            style={{
              width: isFullScreen ? getFullScreenWidth() : `${chatWidth}px`,
              flexShrink: 0,
              marginLeft: isFullScreen ? '0' : '12px',

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
            />
          )}

          {/* Content area with no transition for direct response */}
          {!isFullScreen && (
            <div
              className="drop-shadow-lg bg-white dark:bg-[#272626] rounded-2xl p-2"
              style={{ width: `${contentWidth}px` }}
            >
              <Outlet />
            </div>
          )}
        </div>
      ) : (
        // Original layout
        <div className="w-full flex h-[80vh] flex-col justify-between sm:flex-row">
          {/* Sidebar */}
          <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

          {/* Content area with no transition for direct response */}
          {!isFullScreen && (
            <div
              className="drop-shadow-lg bg-white dark:bg-[#272626] rounded-2xl p-2 mx-1"
              style={{ width: `${contentWidth}px` }}
            >
              <Outlet />
            </div>
          )}

          {/* Resizer - only visible when not in fullscreen */}
          {!isFullScreen && (
            <Resizer
              onResize={handleChatResize}
              className="h-full self-stretch"
            />
          )}

          {/* Chat with no transition for direct response */}
          <div
            style={{
              width: isFullScreen ? getFullScreenWidth() : `${chatWidth}px`,
              maxWidth: '100vw',  // Prevent overflow
              flexShrink: 0,
              marginLeft: isFullScreen ? '0' : '12px',
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