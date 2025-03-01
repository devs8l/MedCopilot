import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Chat from "../components/Chat";
import { MedContext } from "../context/MedContext";

const Home = () => {
    const {isExpanded, setIsExpanded} = useContext(MedContext);
    const [isSwapped, setIsSwapped] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleSwapPosition = (swapTo) => {
        setIsSwapped(swapTo);
        // Exit fullscreen mode when swapping positions
        if (isFullScreen) setIsFullScreen(false);
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    // Fixed width for chat in normal mode
    const chatWidth = "800px";
    
    // Dynamic width calculation for fullscreen mode based on sidebar state
    const getFullScreenWidth = () => {
        return isExpanded ? 'calc(100% - 350px)' : 'calc(100% - 10px)';
    };

    return (
        <div className="flex h-full ">
            {isSwapped ? (
                // Swapped layout
                <div className="w-full flex h-[80vh] flex-col sm:flex-row">
                    {/* Sidebar */}
                    <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                    
                    {/* Chat in middle with conditional width */}
                    <div 
                        className="transition-all duration-100 mx-3" 
                        style={{ 
                            width: isFullScreen ? getFullScreenWidth() : chatWidth, 
                            flexShrink: 0 
                        }}
                    >
                        <Chat 
                            swapPosition={handleSwapPosition} 
                            isSwapped={isSwapped} 
                            toggleFullScreen={toggleFullScreen}
                            isFullScreen={isFullScreen}
                        />
                    </div>
                    
                    {/* Content taking remaining space - hidden in fullscreen mode */}
                    {!isFullScreen && (
                        <div className="flex-grow drop-shadow-lg bg-white dark:bg-[#272626]  rounded-2xl transition-all duration-100  p-2">
                            <Outlet />
                        </div>
                    )}
                </div>
            ) : (
                // Original layout
                <div className="w-full flex h-[80vh] flex-col sm:flex-row">
                    {/* Sidebar */}
                    <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                    
                    {/* Middle Section - hidden in fullscreen mode */}
                    {!isFullScreen && (
                        <div className="flex-grow drop-shadow-lg bg-white dark:bg-[#272626] rounded-2xl transition-all duration-100  p-2 mx-3">
                            <Outlet />
                        </div>
                    )}
                    
                    {/* Chat Section with conditional width */}
                    <div 
                        className="transition-all duration-400 " 
                        style={{ 
                            width: isFullScreen ? getFullScreenWidth() : chatWidth,
                            marginLeft: isFullScreen ? '12px' : '0', 
                            flexShrink: 0 
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