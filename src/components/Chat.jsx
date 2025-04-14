import React, { useContext, useEffect, memo, useState, useRef } from "react";
import ChatInterface from "./ChatInterface";
import { Maximize, Minimize, X, AlertCircle, MessageCircle, Home, User, ChevronDown, ChevronUp, Repeat, ChartSpline, Droplets } from "lucide-react";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";
import { useLocation, useNavigate } from "react-router-dom";

const Chat = memo(({ swapPosition, isSwapped, toggleFullScreen, isFullScreen }) => {
    const { selectedUser, setIsUserSelected, setSelectedUser } = useContext(MedContext);
    const { clearChatHistory, userMessages, endSession } = useContext(ChatContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [isTransitioning, setIsTransitioning] = useState(false);
    const transitionTimeoutRef = useRef(null);
    const [isUserDetailsExpanded, setIsUserDetailsExpanded] = useState(false);

    const [activeTabs, setActiveTabs] = useState(() => {
        const storedTabs = localStorage.getItem('activeTabs');
        return storedTabs ? JSON.parse(storedTabs) : [];
    });

    const [activeTabId, setActiveTabId] = useState(() => {
        return location.pathname.startsWith('/user/') ? location.pathname.split('/')[2] : 'general';
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [tabToClose, setTabToClose] = useState(null);

    const safeTransition = (callback, duration = 300) => {
        if (isTransitioning) return false;

        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
        }

        setIsTransitioning(true);

        callback();

        transitionTimeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
            transitionTimeoutRef.current = null;
        }, duration);

        return true;
    };

    const toggleUserDetails = () => {
        setIsUserDetailsExpanded(!isUserDetailsExpanded);
    };

    useEffect(() => {
        if (isTransitioning) return;

        const isUserRoute = location.pathname.startsWith('/user/');

        if (isUserRoute) {
            const userId = location.pathname.split('/')[2];
            const userTab = activeTabs.find(tab => tab._id === userId);
            if (userTab) {
                setSelectedUser(userTab);
                setActiveTabId(userId);
                setIsUserSelected(true);
            }
        } else if (location.pathname === '/') {
            setSelectedUser(null);
            setActiveTabId('general');
            setIsUserSelected(false);
        }
    }, [location.pathname, activeTabs, setSelectedUser, setIsUserSelected, isTransitioning]);

    useEffect(() => {
        if (isTransitioning) return;

        if (selectedUser && !activeTabs.find(tab => tab._id === selectedUser._id)) {
            safeTransition(() => {
                setActiveTabs(prev => [...prev, selectedUser]);
                localStorage.setItem(`sessionStarted_${selectedUser._id}`, "true");
            });
        }
    }, [selectedUser, activeTabs]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            localStorage.setItem('activeTabs', JSON.stringify(activeTabs));
        }, 300);

        return () => clearTimeout(debounce);
    }, [activeTabs]);

    const switchToGeneralTab = () => {
        if (activeTabId === 'general') return;

        safeTransition(() => {
            setSelectedUser(null);
            setActiveTabId('general');
            setIsUserSelected(false);
            navigate('/');
            setIsUserDetailsExpanded(false);
        });
    };

    const switchToTab = (userId) => {
        if (userId === activeTabId) return;

        safeTransition(() => {
            if (userId === 'general') {
                switchToGeneralTab();
            } else {
                const userToSelect = activeTabs.find(tab => tab._id === userId);
                if (userToSelect) {
                    setSelectedUser(userToSelect);
                    setActiveTabId(userId);
                    setIsUserSelected(true);
                    navigate(`/user/${userId}`);
                    setIsUserDetailsExpanded(false);
                }
            }
        });
    };

    const handleCloseTab = (e, userId) => {
        e.stopPropagation();
        setTabToClose(userId);
        setShowConfirmDialog(true);
    };

    const confirmCloseTab = () => {
        if (!tabToClose) return;

        safeTransition(() => {
            const tabIndex = activeTabs.findIndex(tab => tab._id === tabToClose);
            const updatedTabs = activeTabs.filter(tab => tab._id !== tabToClose);

            localStorage.removeItem(`promptGiven_${tabToClose}`);
            localStorage.removeItem(`sessionStarted_${tabToClose}`);
            clearChatHistory(tabToClose);
            endSession(tabToClose);

            if (activeTabId === tabToClose) {
                if (updatedTabs.length > 0) {
                    let nextTabIndex = tabIndex;
                    if (nextTabIndex >= updatedTabs.length) {
                        nextTabIndex = updatedTabs.length - 1;
                    }

                    const nextTab = updatedTabs[nextTabIndex];
                    setSelectedUser(nextTab);
                    setActiveTabId(nextTab._id);
                    setIsUserSelected(true);
                    navigate(`/user/${nextTab._id}`);
                } else {
                    setSelectedUser(null);
                    setActiveTabId('general');
                    setIsUserSelected(false);
                    navigate('/');
                }
            }

            setActiveTabs(updatedTabs);
            setShowConfirmDialog(false);
            setTabToClose(null);
            setIsUserDetailsExpanded(false);
        });
    };

    const cancelCloseTab = () => {
        setShowConfirmDialog(false);
        setTabToClose(null);
    };

    const hasHistory = (userId) => {
        if (userId === 'general') {
            return userMessages.general && userMessages.general.length > 1;
        }
        return userMessages[userId] && userMessages[userId].length > 1;
    };

    return (
        <div>
            <div className={`flex items-center justify-between rounded-xl ${isFullScreen ? '' : ''} dark:text-white relative`}>
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <div className="flex h-full gap-2">
                        {/* General Chat Tab */}
                        <div
                            onClick={switchToGeneralTab}
                            className={`flex items-center gap-1 sm:gap-2 pt-2 pb-2 rounded-t-md px-2 sm:px-3 py-1 h-full cursor-pointer whitespace-nowrap ${activeTabId === 'general'
                                ? 'bg-white dark:bg-gray-700 pb-4'
                                : 'bg-[#FFFFFF33] dark:bg-gray-800 dark:hover:bg-gray-600 rounded-md text-gray-400'
                                }`}
                        >
                            <div className="w-4 sm:w-6 h-4 sm:h-6 rounded-full flex items-center justify-center">
                                <img
                                    src="/home.svg"
                                    className={`${activeTabId === 'general' ? '' : 'opacity-50'}`}
                                    alt=""
                                />
                            </div>
                            <span className="max-w-20 sm:max-w-32 truncate text-xs sm:text-sm">MedCopilot Chat</span>
                            {hasHistory('general') && (
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            )}
                        </div>

                        {/* User-specific Tabs */}
                        {activeTabs.map(tab => (
                            <div
                                key={tab._id}
                                onClick={() => switchToTab(tab._id)}
                                className={`flex items-center gap-1 sm:gap-2 rounded-t-md pt-2 pb-2 px-2 sm:px-3 h-full py-1 cursor-pointer whitespace-nowrap ${activeTabId === tab._id
                                    ? 'bg-white dark:bg-gray-700 pb-4'
                                    : 'bg-[#FFFFFF33] dark:bg-gray-800 dark:hover:bg-gray-600 rounded-md text-gray-400'
                                    }`}
                            >
                                <div className="w-4 sm:w-6 h-4 sm:h-6 rounded-full flex items-center justify-center overflow-hidden">
                                    <User size={17} />
                                </div>
                                <span className="max-w-20 sm:max-w-32 truncate text-xs sm:text-sm">{tab.name}</span>
                                {hasHistory(tab._id) && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                )}
                                <button
                                    onClick={(e) => handleCloseTab(e, tab._id)}
                                    className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                    disabled={isTransitioning}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`px-2 sm:px-3 sm:pt-3 bg-[#ffffff] dark:bg-[#00000099] ${activeTabId === 'general' ? "rounded-r-lg rounded-b-lg" : "rounded-lg"
                } flex flex-col overflow-hidden relative`}>

                <div className="flex items-center justify-between">
                    <h1 className="text-lg sm:text-xl text-[#222836] dark:text-white font-semibold mt-2 sm:mt-4 px-2 sm:px-4 mb-1 sm:mb-2">
                        {activeTabId === 'general'
                            ? 'Chat'
                            : `Chat for ${activeTabs.find(tab => tab._id === activeTabId)?.name || ''}`}
                    </h1>
                    {hasHistory(activeTabId) && activeTabId !== 'general' && (
                        <div className="flex flex-col  items-center absolute animate-fadeInUp transform -translate-x-1/2 top-5 left-1/2 z-10">
                            {/* Centered User profile capsule - grows from center */}
                            <div className="relative flex justify-center w-full">
                                <div 
                                    onClick={toggleUserDetails} 
                                    className={`cursor-pointer transition-all duration-300 ease-in-out bg-white   ${
                                        isUserDetailsExpanded ? "w-full rounded-t-3xl border-t border-r border-l border-gray-200" : "w-auto rounded-full border  border-gray-200"
                                    }`}
                                    style={{
                                        transformOrigin: 'center',
                                        transition: 'width 0.3s ease-in-out'
                                    }}
                                >
                                    <div className={`flex items-center px-2 py-1 ${isUserDetailsExpanded ? "justify-center" : "justify-center"}`}>
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img src={activeTabs.find(tab => tab._id === activeTabId)?.profileImage || "/api/placeholder/28/28"} alt="" />
                                        </div>
                                        <div className="flex items-center ml-2">
                                            <h3 className="font-medium text-gray-800 text-xs whitespace-nowrap">
                                                {activeTabs.find(tab => tab._id === activeTabId)?.name}
                                            </h3>
                                            <div className="ml-1">
                                                {isUserDetailsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded details panel - shown when toggled with no gap */}
                            {isUserDetailsExpanded && (
                                <div className="w-full">
                                    <div className="border-x border-b animate-fadeInUp border-gray-200 bg-white rounded-b-2xl p-4 transition-all duration-300 ease-in-out shadow-xl">
                                        <div className="flex flex-col items-start">
                                            <h3 className="text-md text-gray-600 text-left">
                                                Feeling fatigued quite often. I also have acute body pain. It is hampering my daily routine. I wonder what could be the reason? Lately, I've noticed my appetite has decreased significantly. I've been experiencing headaches in the morning and difficulty sleeping at night. My blood pressure readings have been slightly elevated compared to my normal range.
                                                <br /><br />
                                                Previous conditions: Mild hypertension (diagnosed 2019), Seasonal allergies
                                                <br />
                                                Medications: Lisinopril 10mg daily, Loratadine as needed
                                                <br />
                                                Last visit: 3 months ago for routine checkup
                                            </h3>
                                        </div>
                                        <div className="flex flex-col gap-2 mt-2 text-left">
                                            <h4 className="text-sm sm:text-md font-medium text-gray-800">Visiting for</h4>
                                            <div className="flex flex-wrap gap-2">
                                                <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                                                    <Repeat size={12} /> Routine Checkup
                                                </button>
                                                <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                                                    <ChartSpline size={12} /> Blood Pressure Checkup
                                                </button>
                                                <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                                                    <Droplets size={12} /> Sugar Checkup
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`flex space-x-2 sm:space-x-4 items-center mt-1 sm:mt-2 justify-center mr-2 sm:mr-5`}>
                        <button
                            title="Place in left"
                            onClick={() => !isTransitioning && swapPosition(true)}
                            className={`rounded ${isFullScreen ? "hidden" : ""} ${isSwapped ? "opacity-10" : "hover:bg-gray-100"}`}
                            disabled={isSwapped || isTransitioning}
                        >
                            <img src="/right.svg" alt="" className="rotate-180 w-4 sm:w-6 h-4 sm:h-6" />
                        </button>
                        <button
                            title="Place in right"
                            onClick={() => !isTransitioning && swapPosition(false)}
                            className={`rounded ${isFullScreen ? "hidden" : ""} ${!isSwapped ? "opacity-10" : "hover:bg-gray-100"}`}
                            disabled={!isSwapped || isTransitioning}
                        >
                            <img src="/right.svg" className="w-4 sm:w-6 h-4 sm:h-6" alt="" />
                        </button>
                        <button
                            title="Fullscreen"
                            onClick={() => !isTransitioning && toggleFullScreen()}
                            className="p-1 rounded hover:bg-gray-100 cursor-pointer ml-auto w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center"
                            disabled={isTransitioning}
                        >
                            {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
                        </button>
                    </div>
                </div>

                {/* Confirmation Dialog */}
                {showConfirmDialog && (
                    <div className="fixed inset-0 bg-[#0000008c] flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="text-red-500" size={20} />
                                <h2 className="text-lg font-semibold dark:text-white">End Chat</h2>
                            </div>
                            <p className="mb-6 dark:text-gray-300">
                                Are you sure you want to end the chat for{' '}
                                {activeTabs.find(tab => tab._id === tabToClose)?.name}?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelCloseTab}
                                    className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmCloseTab}
                                    className="px-3 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    End Chat
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat content area */}
                <div className="flex-grow overflow-y-auto h-[calc(80vh-80px)] sm:h-[calc(83vh-80px)] transition-opacity duration-300 ease-in-out">
                    <ChatInterface
                        isFullScreen={isFullScreen}
                        isGeneralChat={activeTabId === 'general'}
                        isTransitioning={isTransitioning}
                    />
                </div>
            </div>
        </div>
    );
});

export default Chat;