import React, { memo, useContext } from "react";
import { X, User } from "lucide-react";
import { MedContext } from "../context/MedContext";
import { useChatTabs } from "../context/ChatTabsContext";
import { useNavigate } from "react-router-dom";

const ChatTabs = memo(() => {
    const { 
        activeTabId,
        activeTabs,
        isTransitioning,
        hasHistory,
        switchToGeneralTab,
        switchToTab,
        handleCloseTab
    } = useChatTabs();
    
    const { isTransitioning: isMedTransitioning } = useContext(MedContext);
    const navigate = useNavigate();

    return (
        <div className={`flex items-center justify-between rounded-xl dark:text-white relative`}>
            <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2">
                    <div
                        onClick={switchToGeneralTab}
                        className={`flex items-center gap-1 sm:gap-2 mt-1 rounded-md px-2 sm:px-3 py-1 h-full cursor-pointer whitespace-nowrap ${
                            activeTabId === 'general'
                                ? 'bg-white dark:bg-gray-700 mb-3'
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
                        
                        {hasHistory('general') && (
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        )}
                    </div>

                    {activeTabs.map(tab => (
                        <div
                            key={tab._id}
                            onClick={() => switchToTab(tab._id)}
                            className={`flex items-center gap-1 sm:gap-2 rounded-lg mt-1 px-2 sm:px-3 h-full py-1 cursor-pointer whitespace-nowrap ${
                                activeTabId === tab._id
                                    ? 'bg-white dark:bg-gray-700 mb-3'
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
                                disabled={isTransitioning || isMedTransitioning}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default ChatTabs;