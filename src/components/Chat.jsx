import React, { useContext, useEffect, memo, useState } from "react";
import ChatInterface from "./ChatInterface";
import { Maximize, Minimize, X, AlertCircle } from "lucide-react";
import { MedContext } from "../context/MedContext";

const Chat = memo(({ swapPosition, isSwapped, toggleFullScreen, isFullScreen }) => {
    const { selectedUser,setIsUserSelected } = useContext(MedContext);
    const [promptGiven, setPromptGiven] = useState(() => {
        // Initialize from local storage if available
        const storedPromptGiven = localStorage.getItem(`promptGiven_${selectedUser?.id}`);
        return storedPromptGiven ? JSON.parse(storedPromptGiven) : false;
    });
    const [showSessionStarted, setShowSessionStarted] = useState(false);
    const [showSessionHeader, setShowSessionHeader] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [sessionActive, setSessionActive] = useState(false);

    // Handle user change and session notifications
    useEffect(() => {
        if (selectedUser) {
            // Check if this user already has a prompt given
            const storedPromptGiven = localStorage.getItem(`promptGiven_${selectedUser.id}`);
            const isPromptGiven = storedPromptGiven ? JSON.parse(storedPromptGiven) : false;
            setPromptGiven(isPromptGiven);
            
            // Set session active state
            setSessionActive(true);
            
            // Show session started notification when user is selected
            setShowSessionStarted(true);
            setShowSessionHeader(false);
            
            // After 2 seconds, show the session header with fade-in animation
            const headerTimer = setTimeout(() => {
                setShowSessionHeader(true);
            }, 2000);
            
            // Auto-hide notification after 5 seconds
            const notificationTimer = setTimeout(() => {
                setShowSessionStarted(false);
            }, 3000);
            
            return () => {
                clearTimeout(headerTimer);
                clearTimeout(notificationTimer);
            };
        }
    }, [selectedUser]);

    // Update local storage when promptGiven changes
    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem(`promptGiven_${selectedUser.id}`, JSON.stringify(promptGiven));
        }
    }, [promptGiven, selectedUser]);

    const handleEndSessionClick = () => {
        setShowConfirmDialog(true);
    };

    const confirmEndSession = () => {
        // Clear the prompt given state
        setPromptGiven(false);
        localStorage.removeItem(`promptGiven_${selectedUser?.id}`);
        setShowConfirmDialog(false);
        setShowSessionHeader(false);
        setSessionActive(false);
        
        
        // Don't show the header again after ending the session
        // The timeout that was here has been removed
    };

    const cancelEndSession = () => {
        setShowConfirmDialog(false);
    };

    return (
        <div className="drop-shadow-lg px-3 pt-3 bg-white dark:bg-[#272626] rounded-2xl flex flex-col overflow-hidden">
            {/* Header with buttons */}
            <div className={`p-4 flex items-center justify-between rounded-xl ${isFullScreen ? 'bg-white' : ''} dark:text-white dark:bg-[#272626] relative`}>
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

                {/* Middle Section */}
                <div className="w-full flex items-center px-5 justify-between">
                    {/* Session header with fade-in animation */}
                    <h1 
                        className={`transition-opacity duration-500 text-[#00000091] ${
                            showSessionHeader && sessionActive ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        {selectedUser && showSessionHeader && sessionActive ? `Session for ${selectedUser.name}` : ""}
                    </h1>
                    
                    {/* Session Started Notification - appears at same position as End Session */}
                    {showSessionStarted && (
                        <div className="transition-opacity duration-300 ease-in-out bg-blue-500 text-white p-3 mt-[-30px] rounded-lg font-medium flex items-center gap-1 ml-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6  rounded-full  flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={selectedUser?.profileImage || "/default-avatar.png"} 
                                        alt={selectedUser?.name} 
                                        className=" object-cover"
                                    />
                                </div>
                                <span>Session Set for {selectedUser?.name}</span>
                            </div>
                        </div>
                    )}
                    
                    {/* End Session button */}
                    {promptGiven && !showSessionStarted ? (
                        <button 
                            onClick={handleEndSessionClick}
                            className="text-red-500 font-medium flex items-center gap-1 hover:bg-red-50 py-1 px-2 rounded transition-colors ml-auto"
                        >
                            <X size={18} /> End Session
                        </button>
                    ) : null}
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
                    <div className="bg-white rounded-lg p-4 max-w-md w-full shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-red-500" size={24} />
                            <h2 className="text-lg font-semibold">End Session</h2>
                        </div>
                        <p className="mb-6">Are you sure you want to end the session for {selectedUser?.name}?</p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={cancelEndSession}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmEndSession}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                End Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat content area */}
            <div className={`flex-grow overflow-y-auto ${isFullScreen ? 'h-[calc(80vh-73px)]' : 'h-[calc(80vh-80px)]'} `}>
                <ChatInterface 
                    isFullScreen={isFullScreen} 
                    promptGiven={promptGiven} 
                    setPromptGiven={setPromptGiven} 
                />
            </div>
        </div>
    );
});

export default Chat;