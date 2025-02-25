import React from "react";
import ChatInterface from "./ChatInterface";

const Chat = () => {
    return (
        <div className="drop-shadow-md bg-white  rounded-2xl flex flex-col overflow-hidden">
            {/* Make this wrapper full height and ensure child can scroll */}
            <div className="flex-grow overflow-y-auto h-[80vh] ">
                <ChatInterface />
            </div>
        </div>
    );
};

export default Chat;
