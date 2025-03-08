import React, { useContext, useEffect, memo, useState, useRef } from "react";
import ChatInterface from "./ChatInterface";
import { Maximize, Minimize, X, AlertCircle, MessageCircle, Home } from "lucide-react";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";
import { useLocation, useNavigate } from "react-router-dom";

const Chat = memo(({ swapPosition, isSwapped, toggleFullScreen, isFullScreen }) => {
    const { selectedUser, setIsUserSelected, setSelectedUser } = useContext(MedContext);
    const { clearChatHistory, userMessages } = useContext(ChatContext);
    const location = useLocation();
    const navigate = useNavigate();

    // Add a state for transition animation
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Create a ref to track ongoing transitions to prevent overlapping animations
    const transitionTimeoutRef = useRef(null);

    // Store active tabs
    const [activeTabs, setActiveTabs] = useState(() => {
        const storedTabs = localStorage.getItem('activeTabs');
        return storedTabs ? JSON.parse(storedTabs) : [];
    });

    // Current active tab (user ID or 'general')
    const [activeTabId, setActiveTabId] = useState(() => {
        // Initialize with 'general' unless we're on a user route
        return location.pathname.startsWith('/user/') ? location.pathname.split('/')[2] : 'general';
    });

    // Dialog state
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [tabToClose, setTabToClose] = useState(null);

    // Helper function to safely handle transitions and prevent overlapping ones
    const safeTransition = (callback, duration = 300) => {
        if (isTransitioning) return false;

        // Clear any existing timeout
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
        }

        setIsTransitioning(true);

        // Execute callback
        callback();

        // Set timeout to clear transitioning state
        transitionTimeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
            transitionTimeoutRef.current = null;
        }, duration);

        return true;
    };

    // Check URL for user ID on component mount and route changes
    useEffect(() => {
        if (isTransitioning) return; // Skip during transitions to prevent jitter

        const isUserRoute = location.pathname.startsWith('/user/');

        if (isUserRoute) {
            const userId = location.pathname.split('/')[2];

            // If we're on a user route, set the appropriate state
            if (userId) {
                // Find the user in active tabs
                const userTab = activeTabs.find(tab => tab._id === userId);
                if (userTab) {
                    setSelectedUser(userTab);
                    setActiveTabId(userId);
                    setIsUserSelected(true);
                }
            }
        } else if (location.pathname === '/') {
            // If we're on the home route, ensure we're in general chat mode
            setSelectedUser(null);
            setActiveTabId('general');
            setIsUserSelected(false);
        }
    }, [location.pathname, activeTabs, setSelectedUser, setIsUserSelected, isTransitioning]);

    // Effect to track if user is newly selected
    useEffect(() => {
        if (isTransitioning) return; // Skip during transitions

        if (selectedUser && !activeTabs.find(tab => tab._id === selectedUser._id)) {
            // Add new user to tabs without causing a layout shift
            safeTransition(() => {
                setActiveTabs(prev => [...prev, selectedUser]);
                // Set local storage
                localStorage.setItem(`sessionStarted_${selectedUser._id}`, "true");
            });
        }
    }, [selectedUser, activeTabs]);

    // Save active tabs to localStorage with debounce to reduce writes
    useEffect(() => {
        const debounce = setTimeout(() => {
            localStorage.setItem('activeTabs', JSON.stringify(activeTabs));
        }, 300);

        return () => clearTimeout(debounce);
    }, [activeTabs]);

    // Function to directly navigate to general chat without relying on state changes
    const switchToGeneralTab = () => {
        if (activeTabId === 'general') return;

        safeTransition(() => {
            // Batch state updates
            setSelectedUser(null);
            setActiveTabId('general');
            setIsUserSelected(false);

            // Navigate
            navigate('/');
        });
    };

    // Function to switch between tabs with URL navigation
    const switchToTab = (userId) => {
        if (userId === activeTabId) return;

        safeTransition(() => {
            if (userId === 'general') {
                switchToGeneralTab();
            } else {
                const userToSelect = activeTabs.find(tab => tab._id === userId);
                if (userToSelect) {
                    // Batch state updates
                    setSelectedUser(userToSelect);
                    setActiveTabId(userId);
                    setIsUserSelected(true);
                    navigate(`/user/${userId}`);
                }
            }
        });
    };

    // Function to close tab with confirmation
    const handleCloseTab = (e, userId) => {
        e.stopPropagation(); // Prevent tab switching when clicking close button
        setTabToClose(userId);
        setShowConfirmDialog(true);
    };

    // Confirm closing tab with improved tab switching logic
    const confirmCloseTab = () => {
        if (!tabToClose) return;

        safeTransition(() => {
            // Find the index of the tab being closed
            const tabIndex = activeTabs.findIndex(tab => tab._id === tabToClose);

            // Remove from active tabs
            const updatedTabs = activeTabs.filter(tab => tab._id !== tabToClose);

            // Clear localStorage for this user session
            localStorage.removeItem(`promptGiven_${tabToClose}`);
            localStorage.removeItem(`sessionStarted_${tabToClose}`);

            // Clear chat history for this user
            clearChatHistory(tabToClose);

            // If we're closing the active tab, switch to the next available tab or general
            if (activeTabId === tabToClose) {
                if (updatedTabs.length > 0) {
                    let nextTabIndex = tabIndex;
                    if (nextTabIndex >= updatedTabs.length) {
                        nextTabIndex = updatedTabs.length - 1;
                    }

                    const nextTab = updatedTabs[nextTabIndex];
                    // Update state first in a single batch
                    setSelectedUser(nextTab);
                    setActiveTabId(nextTab._id);
                    setIsUserSelected(true);
                    // Then navigate
                    navigate(`/user/${nextTab._id}`);
                } else {
                    // No tabs left, switch to general chat
                    setSelectedUser(null);
                    setActiveTabId('general');
                    setIsUserSelected(false);
                    navigate('/');
                }
            }

            // Update tabs state
            setActiveTabs(updatedTabs);
            setShowConfirmDialog(false);
            setTabToClose(null);
        });
    };

    const cancelCloseTab = () => {
        setShowConfirmDialog(false);
        setTabToClose(null);
    };

    // Determine if a tab has chat history
    const hasHistory = (userId) => {
        if (userId === 'general') {
            return userMessages.general && userMessages.general.length > 1;
        }
        return userMessages[userId] && userMessages[userId].length > 1;
    };

    return (
        <div className="px-3 pt-3 bg-[#ffffffc8] dark:bg-[#00000099] rounded-lg flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
                <h1 className="text-xl text-[#222836] dark:text-white font-semibold mt-4 px-4 mb-2">Chat</h1>
                <div className={`flex space-x-4 items-center mt-2 justify-center  mr-5 `}>
                    <button
                        onClick={() => !isTransitioning && swapPosition(true)}
                        className={`rounded ${isFullScreen ? "hidden" : ""} ${isSwapped ? "opacity-10" : "hover:bg-gray-100"}`}
                        disabled={isSwapped || isTransitioning}
                    >
                        <img src="/right.svg" alt="" className="rotate-180 w-6 h-6 " />
                    </button>
                    <button
                        onClick={() => !isTransitioning && swapPosition(false)}
                        className={` rounded ${isFullScreen ? "hidden" : ""} ${!isSwapped ? "opacity-10" : "hover:bg-gray-100"}`}
                        disabled={!isSwapped || isTransitioning}
                    >
                        <img src="/right.svg" className="w-6 h-6" alt="" />
                    </button>
                    <button
                        onClick={() => !isTransitioning && toggleFullScreen()}
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer ml-auto w-8 h-8 flex items-center justify-center"
                        disabled={isTransitioning}
                    >
                        {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                </div>
            </div>
            {/* Header with tabs and buttons - Fixed heights to prevent jitter */}
            <div className={`px-4 py-2 flex items-center justify-between rounded-xl  ${isFullScreen ? 'bg-[#FFFFFFCC]' : ''} dark:text-white relative`}>
                {/* Tabs Section - Fixed heights and widths to prevent layout shifts */}
                <div className="flex-1 overflow-x-auto scrollbar-hide ">
                    <div className="flex space-x-1 h-full">
                        {/* General Chat Tab - Always present */}
                        <div
                            onClick={switchToGeneralTab}
                            className={`flex items-center gap-2 px-3 py-1 h-full cursor-pointer whitespace-nowrap ${activeTabId === 'general'
                                ? 'bg-white dark:bg-gray-700'
                                : 'bg-white dark:bg-gray-800  dark:hover:bg-gray-600'
                                }`}
                        >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center ">
                                <Home size={20} className="" />
                            </div>

                            {hasHistory('general') && (
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            )}
                        </div>

                        {/* User-specific Tabs */}
                        {activeTabs.map(tab => (
                            <div
                                key={tab._id}
                                onClick={() => switchToTab(tab._id)}
                                className={`flex items-center gap-2 px-3 py-1 h-full cursor-pointer whitespace-nowrap ${activeTabId === tab._id
                                    ? 'bg-white dark:bg-gray-700'
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                                    <img
                                        src={tab.profileImage || "/default-avatar.png"}
                                        alt={tab.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <span className="max-w-32 truncate text-sm">{tab.name}</span>
                                {hasHistory(tab._id) && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                )}
                                <button
                                    onClick={(e) => handleCloseTab(e, tab._id)}
                                    className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                    disabled={isTransitioning}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fullscreen toggle button */}

            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-[#0000008c] flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-red-500" size={24} />
                            <h2 className="text-lg font-semibold dark:text-white">End Session</h2>
                        </div>
                        <p className="mb-6 dark:text-gray-300">
                            Are you sure you want to end the session for{' '}
                            {activeTabs.find(tab => tab._id === tabToClose)?.name}?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelCloseTab}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCloseTab}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                End Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat content area - Fixed and calculated heights to prevent jitter */}
            <div className="flex-grow overflow-y-auto h-[calc(83vh-80px)] transition-opacity duration-300 ease-in-out">
                <ChatInterface
                    isFullScreen={isFullScreen}
                    promptGiven={true}
                    setPromptGiven={() => { }}
                    isGeneralChat={activeTabId === 'general'}
                    isTransitioning={isTransitioning}
                />
            </div>
        </div>
    );
});

export default Chat;