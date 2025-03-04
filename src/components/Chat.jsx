import React, { useContext, useEffect, memo, useState } from "react";
import ChatInterface from "./ChatInterface";
import { Maximize, Minimize, X, AlertCircle } from "lucide-react";
import { MedContext } from "../context/MedContext";

const Chat = memo(({ swapPosition, isSwapped, toggleFullScreen, isFullScreen }) => {
    const { selectedUser, setIsUserSelected,setMessages } = useContext(MedContext);
    const [promptGiven, setPromptGiven] = useState(() => {
        const storedPromptGiven = localStorage.getItem(`promptGiven_${selectedUser?.id}`);
        return storedPromptGiven ? JSON.parse(storedPromptGiven) : false;
    });

    const [showSessionStarted, setShowSessionStarted] = useState(() => {
        return selectedUser
            ? !localStorage.getItem(`sessionStarted_${selectedUser.id}`)
            : false;
    });

    const [showSessionHeader, setShowSessionHeader] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [sessionActive, setSessionActive] = useState(false);

    useEffect(() => {
        if (selectedUser) {
            const storedPromptGiven = localStorage.getItem(`promptGiven_${selectedUser.id}`);
            setPromptGiven(storedPromptGiven ? JSON.parse(storedPromptGiven) : false);
            setSessionActive(true);

            // Ensure session start notification only shows ONCE per user
            if (!localStorage.getItem(`sessionStarted_${selectedUser.id}`)) {
                setShowSessionStarted(true);
                localStorage.setItem(`sessionStarted_${selectedUser.id}`, "true");

                // Auto-hide after 3 sec
                setTimeout(() => {
                    setShowSessionStarted(false);
                }, 3000);
            }

            // Delay session header appearance
            const headerTimer = setTimeout(() => {
                setShowSessionHeader(true);
            }, 300);

            return () => clearTimeout(headerTimer);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem(`promptGiven_${selectedUser.id}`, JSON.stringify(promptGiven));
        }
    }, [promptGiven, selectedUser]);

    const handleEndSessionClick = () => {
        setShowConfirmDialog(true);
    };

    const confirmEndSession = () => {
        setPromptGiven(false);
        localStorage.removeItem(`promptGiven_${selectedUser?.id}`);
        localStorage.removeItem(`sessionStarted_${selectedUser?.id}`);
        setShowConfirmDialog(false);
        setShowSessionHeader(false);
        setSessionActive(false);
        
        // Clear chat messages
        setMessages([
            {
                type: 'bot',
                content: 'Hi, I am your copilot!',
                subtext: 'Chat and resolve all your queries',
                para: 'Or try these prompts to get started',
                isInitial: true
            }
        ]);
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
                    <h1 className={`transition-opacity duration-500 text-[#00000091] ${
                        showSessionHeader && sessionActive ? "opacity-100" : "opacity-0"
                    }`}>
                        {selectedUser && showSessionHeader && sessionActive ? `Session for ${selectedUser.name}` : ""}
                    </h1>

                    {/* Session Started Notification */}
                    {showSessionStarted && (
                        <div className="transition-opacity duration-300 ease-in-out bg-blue-500 text-white p-3 mt-[-30px] rounded-lg font-medium flex items-center gap-1 ml-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={selectedUser?.profileImage || "/default-avatar.png"} 
                                        alt={selectedUser?.name} 
                                        className="object-cover"
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
