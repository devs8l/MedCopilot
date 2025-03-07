import React, { useContext, useEffect, memo, useState } from "react";
import ChatInterface from "./ChatInterface";
import { Maximize, Minimize, X, AlertCircle, Plus } from "lucide-react";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";

const Chat = memo(({ swapPosition, isSwapped, toggleFullScreen, isFullScreen }) => {
    const { selectedUser, setIsUserSelected, setSelectedUser } = useContext(MedContext);
    const { clearChatHistory, userMessages } = useContext(ChatContext);
    
    // Store active tabs
    const [activeTabs, setActiveTabs] = useState(() => {
        const storedTabs = localStorage.getItem('activeTabs');
        return storedTabs ? JSON.parse(storedTabs) : [];
    });
    
    // Current active tab (user ID)
    const [activeTabId, setActiveTabId] = useState(null);
    
    // Dialog state
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [tabToClose, setTabToClose] = useState(null);

    // Effect to track if user is newly selected
    useEffect(() => {
        if (selectedUser && !activeTabs.find(tab => tab._id === selectedUser._id)) {
            // Add new user to tabs
            setActiveTabs(prev => [...prev, selectedUser]);
            
            // Set local storage
            localStorage.setItem(`sessionStarted_${selectedUser._id}`, "true");
            
            // Show notification for new session (could be implemented as needed)
        }
        
        // Set active tab to selected user
        if (selectedUser) {
            setActiveTabId(selectedUser._id);
        }
    }, [selectedUser]);

    // Save active tabs to localStorage
    useEffect(() => {
        localStorage.setItem('activeTabs', JSON.stringify(activeTabs));
    }, [activeTabs]);

    // Function to switch between tabs
    const switchToTab = (userId) => {
        const userToSelect = activeTabs.find(tab => tab._id === userId);
        if (userToSelect) {
            setSelectedUser(userToSelect);
            setActiveTabId(userId);
        }
    };

    // Function to close tab with confirmation
    const handleCloseTab = (e, userId) => {
        e.stopPropagation(); // Prevent tab switching when clicking close button
        setTabToClose(userId);
        setShowConfirmDialog(true);
    };

    // Confirm closing tab
    const confirmCloseTab = () => {
        if (tabToClose) {
            // Remove from active tabs
            const updatedTabs = activeTabs.filter(tab => tab._id !== tabToClose);
            setActiveTabs(updatedTabs);
            
            // Clear localStorage for this user session
            localStorage.removeItem(`promptGiven_${tabToClose}`);
            localStorage.removeItem(`sessionStarted_${tabToClose}`);
            
            // Clear chat history for this user
            clearChatHistory(tabToClose);
            
            // If we're closing the active tab, switch to another tab if available
            if (activeTabId === tabToClose) {
                if (updatedTabs.length > 0) {
                    setSelectedUser(updatedTabs[0]);
                    setActiveTabId(updatedTabs[0]._id);
                } else {
                    setSelectedUser(null);
                    setActiveTabId(null);
                    setIsUserSelected(true);
                }
            }
            
            setShowConfirmDialog(false);
            setTabToClose(null);
        }
    };
    
    const cancelCloseTab = () => {
        setShowConfirmDialog(false);
        setTabToClose(null);
    };

    // Determine if a tab has chat history
    const hasHistory = (userId) => {
        return userMessages[userId] && userMessages[userId].length > 1;
    };

    return (
        <div className="px-3 pt-3 bg-[#ffffffc8] dark:bg-[#272626] rounded-lg flex flex-col overflow-hidden">
            {/* Header with tabs and buttons */}
            <div className={`p-4 flex items-center justify-between rounded-xl ${isFullScreen ? 'bg-[#FFFFFFCC]' : ''} dark:text-white dark:bg-[#272626] relative`}>
                {/* Left side - swap position buttons */}
                <div className={`flex space-x-2 ${isFullScreen ? "hidden" : ""}`}>
                    <button
                        onClick={() => swapPosition(true)}
                        className={`p-1 rounded ${isSwapped ? "opacity-10" : "hover:bg-gray-100"}`}
                        disabled={isSwapped}
                    >
                        <img src="/right.svg" alt="" className="rotate-180 w-7 h-7" />
                    </button>
                    <button
                        onClick={() => swapPosition(false)}
                        className={`p-1 rounded ${!isSwapped ? "opacity-10" : "hover:bg-gray-100"}`}
                        disabled={!isSwapped}
                    >
                        <img src="/right.svg" className="w-7 h-7" alt="" />
                    </button>
                </div>

                {/* Tabs Section */}
                <div className="flex-1 overflow-x-auto pl-4 pr-2">
                    <div className="flex space-x-1">
                        {activeTabs.map(tab => (
                            <div 
                                key={tab._id}
                                onClick={() => switchToTab(tab._id)}
                                className={`flex items-center gap-2 px-3 py-2  cursor-pointer transition-colors ${
                                    activeTabId === tab._id 
                                        ? 'bg-white dark:bg-gray-700 ' 
                                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={tab.profileImage || "/default-avatar.png"} 
                                        alt={tab.name} 
                                        className="object-cover"
                                    />
                                </div>
                                <span className="max-w-32 truncate">{tab.name}</span>
                                {hasHistory(tab._id) && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                )}
                                <button 
                                    onClick={(e) => handleCloseTab(e, tab._id)}
                                    className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fullscreen toggle button */}
                <button
                    onClick={toggleFullScreen}
                    className="p-1 rounded hover:bg-gray-100 cursor-pointer ml-auto"
                >
                    {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="absolute inset-0 bg-[#0000008c] bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-[#FFFFFFCC] rounded-lg p-4 max-w-md w-full shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-red-500" size={24} />
                            <h2 className="text-lg font-semibold">End Session</h2>
                        </div>
                        <p className="mb-6">
                            Are you sure you want to end the session for 
                            {activeTabs.find(tab => tab._id === tabToClose)?.name}?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={cancelCloseTab}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
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

            {/* Chat content area */}
            <div className={`flex-grow overflow-y-auto ${isFullScreen ? 'h-[calc(85vh-73px)]' : 'h-[calc(85vh-80px)]'} `}>
            <ChatInterface 
                        isFullScreen={isFullScreen} 
                        promptGiven={true}
                        setPromptGiven={() => {}}
                    />
            </div>
        </div>
    );
});

export default Chat;