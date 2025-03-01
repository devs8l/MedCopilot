import React, { useState } from "react";
import ChatInterface from "./ChatInterface";
import { Maximize, Minimize } from "lucide-react";

const Chat = ({ swapPosition, isSwapped, toggleFullScreen, isFullScreen }) => {
    return (
        <div className="drop-shadow-md px-3 pt-3 bg-white dark:bg-[#272626] rounded-2xl flex flex-col overflow-hidden">
            {/* Header with buttons */}
            <div className={`p-4  flex items-center justify-between bg-[#f7f7f7] rounded-xl ${isFullScreen ? 'bg-white':''} `}>
                {/* Left side - swap position buttons */}
                <div className={`flex  space-x-2 ${isFullScreen ? "hidden" : ""}`}>
                    <button
                        onClick={() => swapPosition(true)}
                        className={`p-1 rounded ${isSwapped ? "opacity-10" : "hover:bg-gray-100"}`}
                        disabled={isSwapped}
                    >
                        <img src="/right.svg" alt="" className="rotate-180 w-6 h-6" />
                    </button>
                    <button
                        onClick={() => swapPosition(false)}
                        className={`p-1 rounded ${!isSwapped ? "opacity-10" : "hover:bg-gray-100"}`}
                        disabled={!isSwapped}
                    >
                        <img src="/right.svg" className="w-6 h-6" alt="" />
                    </button>
                </div>

                {/* Fullscreen toggle button - Ensure it stays on the right */}
                <button
                    onClick={() => toggleFullScreen()}
                    className="p-1 rounded hover:bg-gray-100 cursor-pointer ml-auto"
                >
                    {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
            </div>

            {/* Chat content area */}
            <div className={`flex-grow overflow-y-auto ${isFullScreen ? 'h-[calc(80vh-73px)]':'h-[calc(80vh-75px)]'} `}>
                <ChatInterface />
            </div>
        </div>
    );
};

export default Chat;
