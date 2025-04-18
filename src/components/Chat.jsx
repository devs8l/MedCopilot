import React, { memo, useContext, useState } from "react";
import ChatInterface from "./ChatInterface";
import { Maximize, Minimize, AlertCircle, ChevronDown, Repeat, ChartSpline, Droplets } from "lucide-react";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";
import SimpleSpeechRecognition from "./Speech";
import { useChatTabs } from "../context/ChatTabsContext";

const Chat = memo(({ toggleFullScreen, isFullScreen }) => {
    const { selectedUser, isNotesExpanded } = useContext(MedContext);
    const { isSpeechActive } = useContext(ChatContext);
    const { activeTabId, activeTabs, addTab, showConfirmDialog, confirmCloseTab, cancelCloseTab, tabToClose } = useChatTabs();
    
    const [isUserDetailsExpanded, setIsUserDetailsExpanded] = useState(false);

    const toggleUserDetails = () => {
        setIsUserDetailsExpanded(!isUserDetailsExpanded);
    };

    // Add new tab when a user is selected
    React.useEffect(() => {
        if (selectedUser) {
            addTab(selectedUser);
        }
    }, [selectedUser, addTab]);

    return (
        <div className="h-full flex flex-col">
            <div className={`px-2 sm:px-3 sm:pt-3 h-full bg-[#ffffff] dark:bg-[#00000099] rounded-lg flex flex-col overflow-hidden relative`}>
                {isSpeechActive && (
                    <div className="flex items-center animate-fadeInUp justify-center absolute w-full h-full z-100 top-0 left-0 bg-[#ffffff] ">
                        <SimpleSpeechRecognition />
                    </div>
                )}
                
                <div className="flex items-center justify-between">
                    <h1 className="text-lg sm:text-xl text-[#222836] dark:text-white font-semibold mt-2 sm:mt-3 px-2 sm:px-4 mb-1 sm:mb-2">
                        {activeTabId === 'general'
                            ? 'Chat'
                            : `Chat for ${activeTabs.find(tab => tab._id === activeTabId)?.name.split(' ')[0] || ''}`}
                    </h1>
                    
                    {activeTabId !== 'general' && (
                        <div className="flex flex-col items-center absolute animate-fadeInUp transform -translate-x-1/2 top-5 left-1/2 z-10">
                            <div className="relative flex justify-center w-full">
                                <div
                                    onClick={toggleUserDetails}
                                    className={`cursor-pointer bg-white ${isUserDetailsExpanded
                                        ? "w-full rounded-t-3xl border-t border-r border-l border-gray-200"
                                        : "w-auto rounded-full border border-gray-200"
                                        }`}
                                >
                                    <div className={`flex items-center gap-2 px-2 py-1 ${isUserDetailsExpanded ? "justify-center" : "justify-start"}`}>
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                <img src={activeTabs.find(tab => tab._id === activeTabId)?.profileImage || "/api/placeholder/28/28"} alt="" />
                                            </div>
                                        </div>

                                        {!isNotesExpanded && !isUserDetailsExpanded ? (
                                            <div className="flex items-center justify-center gap-1 ml-2 whitespace-nowrap overflow-hidden">
                                                <button className="flex gap-1 text-xs sm:text-sm border border-gray-200 text-gray-500 justify-center items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                                                    <img src="/bp.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">120/80 mmHg</span>
                                                </button>
                                                <button className="flex gap-1 text-xs sm:text-sm border border-gray-200 text-gray-500 justify-center items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                                                    <img src="/glucose.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">95 mg/dL</span>
                                                </button>
                                                <button className="flex gap-1 text-xs sm:text-sm border border-gray-200 text-gray-500 justify-center items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                                                    <img src="/o2.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">98%</span>
                                                </button>
                                                <div className="bg-[#1A73E80D] flex justify-center items-center rounded-full p-1">
                                                    <ChevronDown size={14} color="#1A73E8" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-[#1A73E80D] flex justify-center items-center rounded-full p-1">
                                                <ChevronDown size={14} color="#1A73E8" className="rotate-180 transition-all duration-300" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

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
                </div>

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

                <div className="flex-grow overflow-y-auto transition-opacity duration-300 ease-in-out">
                    <ChatInterface
                        isFullScreen={isFullScreen}
                        isGeneralChat={activeTabId === 'general'}
                    />
                </div>
            </div>
        </div>
    );
});

export default Chat;