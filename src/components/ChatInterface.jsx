import React, { useRef, useEffect, useContext, useState } from 'react';
import { RefreshCcw, Clipboard, ArrowRight, ThumbsUp, ThumbsDown, ArrowUp, Paperclip, Lightbulb, X, Clock, History, Loader2, Droplets, ChartSpline, Repeat, ChevronDown, ChevronUp, Mic } from 'lucide-react';
import { MedContext } from '../context/MedContext';
import { ChatContext } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatInterface = ({ isFullScreen, isGeneralChat, isTransitioning }) => {
  const { openDocumentPreview, selectedUser, isNotesExpanded } = useContext(MedContext);
  const {
    messages,
    inputMessage,
    setInputMessage,
    uploadedFiles,
    setUploadedFiles,
    sendMessage,
    regenerateMessage,
    isMessageLoading,
    handleClockClick,
    isloadingHistory,
    formatMedicalResponse,
    isSpeechActive,
    setIsSpeechActive
  } = useContext(ChatContext);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localPromptGiven, setLocalPromptGiven] = useState(false);
  const [hasFocusedInput, setHasFocusedInput] = useState(false);
  const [hasAnimatedInput, setHasAnimatedInput] = useState(false);
  const [showBoxClass, setShowBoxClass] = useState(false);
  const [isUserDetailsExpanded, setIsUserDetailsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Different suggestions based on whether a patient is selected
  const patientSuggestionPrompts = [
    "Summarize this patient's last visit",
    "Show me recent lab results and trends",
    "Does this patient have any allergies or chronic conditions?",
    "Suggest possible causes for the patient's current symptoms"
  ];

  const generalSuggestionPrompts = [
    "Summary of my patient list for today",
    "Which patients need urgent attention or follow ups?",
    "What patterns should I be aware of in today's patients?",
    "Any missed appointments or cancellations today?"
  ];

  // Choose which prompts to display based on patient selection
  const suggestionPrompts = selectedUser ? patientSuggestionPrompts : generalSuggestionPrompts;

  // Debounced scroll to prevent jitter
  const debouncedScrollToBottom = () => {
    if (isTransitioning) return; // Skip scrolling during transitions

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  useEffect(() => {
    if (!isTransitioning) {
      debouncedScrollToBottom();
    }
  }, [messages, isMessageLoading, isTransitioning]);

  // Reset suggestions when chat changes
  useEffect(() => {
    setLocalPromptGiven(false);
    setShowSuggestions(false);
    setHasFocusedInput(false);
    setHasAnimatedInput(false);
    setShowBoxClass(false);
    setIsUserDetailsExpanded(false);
  }, [selectedUser, isGeneralChat]);

  // Save the previous scroll position before transition
  useEffect(() => {
    if (isTransitioning && messageContainerRef.current) {
      messageContainerRef.current.dataset.scrollTop = messageContainerRef.current.scrollTop;
    } else if (!isTransitioning && messageContainerRef.current && messageContainerRef.current.dataset.scrollTop) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.dataset.scrollTop;
    }
  }, [isTransitioning]);

  // Effect to handle the box class removal after 1 second
  useEffect(() => {
    let timer;
    if (showBoxClass) {
      timer = setTimeout(() => {
        setShowBoxClass(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showBoxClass]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    sendMessage(inputMessage, uploadedFiles);
    setLocalPromptGiven(true);
    setShowSuggestions(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Process each file
    const newFiles = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      data: URL.createObjectURL(file),
      file: file // Store the actual file object
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentClick = (file) => {
    // Use the openDocumentPreview function from MedContext
    openDocumentPreview({
      title: file.name,
      url: file.data,
      type: file.type
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSuggestionClick = (prompt) => {
    setInputMessage(prompt);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setHasFocusedInput(true);
    if (!hasAnimatedInput) {
      setShowBoxClass(true); // Show the box class when input is focused
    }

    // Show suggestions with animation after a short delay
    if (!showSuggestions && !localPromptGiven && !isUserDetailsExpanded) {
      setShowSuggestions(true);
    }

    // Trigger border animation only once when input is focused for the first time
    if (!hasAnimatedInput) {
      setHasAnimatedInput(true);
    }
  };

  const toggleUserDetails = () => {
    setIsAnimating(true);
    setIsUserDetailsExpanded(!isUserDetailsExpanded);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Match this with your transition duration
  };

  // Check if we should show the initial state (empty chat)
  const showInitialState = messages.length <= 1 && !localPromptGiven;

  return (
    <div className="flex flex-col h-full w-full mx-auto shadow-lg transition-opacity duration-200 ease-in-out"
      style={{ opacity: isTransitioning ? 0.7 : 1 }}>

      {/* Messages Container with fixed minimum height */}
      <div
        ref={messageContainerRef}
        className={`flex-1 overflow-y-auto pb-1 sm:pb-1 md:pb-2 pr-1 sm:pr-2 md:pr-3 lg:pr-4 xl:pr-4 pl-1 sm:pl-2 md:pl-3 lg:pl-4 xl:pl-4 min-h-[200px] transition-all duration-200 ease-in-out ${showInitialState ? 'flex justify-center' : ''} `}
      >

        {showInitialState ? (
          <div className={`w-full mt-4  max-w-3xl mx-auto flex  flex-col text-center space-y-3 ${selectedUser ? 'items-end' : 'items-center'} px-4`}>
            {selectedUser ? (
              <div className="flex flex-col items-center w-full ease-in">
                <div className={`relative flex w-full gap-7 ${isUserDetailsExpanded ? 'mb-4' : ''}`}>
                  <div className="relative">
                    <img
                      src={selectedUser.profileImage || '/default-user.png'}
                      alt="Patient"
                      className="w-12 h-12 rounded-full object-cover mt-2"
                    />
                  </div>
                  <div className={`flex-1 border border-gray-200 rounded-2xl p-4 transition-all duration-300 ease-in-out ${isUserDetailsExpanded ? 'h-auto animate-fadeInDown' : 'overflow-hidden animate-fadeInUp'}`}>
                    <div className="flex flex-col items-start">
                      <h3 className="text-md text-gray-600 text-left">
                        {isUserDetailsExpanded ? (
                          <>
                            Feeling fatigued quite often. I also have acute body pain. It is hampering my daily routine. I wonder what could be the reason? Lately, I've noticed my appetite has decreased significantly. I've been experiencing headaches in the morning and difficulty sleeping at night. My blood pressure readings have been slightly elevated compared to my normal range.
                            <br /><br />
                            Previous conditions: Mild hypertension (diagnosed 2019), Seasonal allergies
                            <br />
                            Medications: Lisinopril 10mg daily, Loratadine as needed
                            <br />
                            Last visit: 3 months ago for routine checkup
                          </>
                        ) : (
                          "Feeling fatigued quite often. I also have acute body pain. It is hampering my daily routine. I wonder what could be the reason?"
                        )}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 text-left">
                      <h4 className="text-sm sm:text-md font-medium text-gray-800">Visiting for</h4>
                      <div className="flex flex-wrap gap-2">
                        <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                          <Repeat size={12} /><span className="animate-fadeInUp">Routine Checkup</span> 
                        </button>
                        <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                          <ChartSpline size={12} /><span className="animate-fadeInUp">Blood Pressure Checkup</span> 
                        </button>
                        <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                          <Droplets size={12} /><span className="animate-fadeInUp">Sugar Checkup</span>
                        </button>
                      </div>
                    </div>

                    {/* Additional content that only shows when expanded */}
                    {isUserDetailsExpanded && (
                      <>
                        <div className="flex flex-col gap-2 mt-6 text-left">
                          <h4 className="text-sm sm:text-md font-medium text-gray-800">Medical History</h4>
                          <div className="flex flex-wrap gap-2">
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                              <Repeat size={12} /><span className="animate-fadeInUp">Hypertension</span> 
                            </button>
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                              <ChartSpline size={12} /><span className="animate-fadeInUp">Seasonal Allergies</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-6 text-left">
                          <h4 className="text-sm sm:text-md font-medium text-gray-800">Demographics</h4>
                          <div className="flex flex-wrap gap-2">
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                              <img src="/bp.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">120/80 mmHg</span>
                            </button>
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                              <img src="/glucose.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">95 mg/dL</span>
                            </button>
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                              <img src="/o2.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">98%</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    <button
                      onClick={toggleUserDetails}
                      className={`absolute right-4 bottom-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 ${isUserDetailsExpanded ? 'transform rotate-180' : ''}`}
                    >
                      {isUserDetailsExpanded ? <ChevronDown size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-2xl font-semibold text-gray-800 p-5 dark:text-white">
                Good Morning Dr. John!
              </div>
            )}
            <p className={`text-sm text-gray-600 dark:text-gray-400 ${selectedUser ? '':'mb-15'}`}>
              {selectedUser ? "" : "Ask a question to get started"}
            </p>

            {/* Unified UI for both general and patient chat */}
            <div className={`w-[90%] transition-all duration-300 ease-in-out ${isUserDetailsExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
              <div className={`relative flex flex-col gap-2 bg-white border-[0.15rem] shadow-md border-gray-50 overflow-hidden rounded-2xl px-3 py-4 transition-all duration-300 ${showBoxClass ? 'box' : ''} ${isInputFocused ? 'shadow-xl' : ''}`}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isTransitioning && handleSendMessage()}
                  onFocus={handleInputFocus}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder={selectedUser ? "How can MedCopilot help with this patient?" : "Get key insights on your patient schedule"}
                  className="flex-1 p-3 rounded-lg text-sm focus:outline-none bg-white dark:bg-[#27313C] dark:text-white relative z-10"
                  disabled={isTransitioning}
                />
                <div className='flex justify-between items-center p-2 relative z-10'>
                  <div className='flex'>
                    <button
                      onClick={triggerFileUpload}
                      className="p-2 mr-2 border border-gray-300 text-gray-700 dark:text-white rounded-full cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={isTransitioning}
                    >
                      <Paperclip size={16} />
                    </button>
                    <button
                      onClick={()=>setIsSpeechActive(true)}
                      className={`p-2 border ${hasFocusedInput ? 'bg-blue-500 text-white' : ' border-blue-500 text-blue-500'} transition-all ease-in duration-400 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white`}
                      disabled={isTransitioning}
                    >
                      <Mic size={16} />
                    </button>
                  </div>
                  <div className='flex'>
                    <button
                      onClick={handleSendMessage}
                      className={`p-2 border ${hasFocusedInput ? 'bg-blue-500 text-white' : ' border-blue-500 text-blue-500'} transition-all ease-in duration-400 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white`}
                      disabled={isTransitioning}
                    >
                      <ArrowUp size={16} />
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Suggestions List - Only show after input is focused */}
            {showSuggestions && hasFocusedInput && !isUserDetailsExpanded && (
              <div className={`w-[90%] mt-6 transition-all duration-300 ease-in-out ${isUserDetailsExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                <ul className="space-y-1">
                  {suggestionPrompts.map((prompt, index) => (
                    <li
                      key={index}
                      className={`opacity-0 transform -translate-y-2 animate-fadeInUp`}
                      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                    >
                      <button
                        className="w-full p-3 text-left text-gray-500 text-xs transition-all duration-200 rounded-lg cursor-pointer "
                        onClick={() => handleSuggestionClick(prompt)}
                      >
                        {prompt}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6">
            {messages.map((message, index) => (
              <div key={index} className="space-y-1">
                {/* User messages always render normally */}
                {message.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="bg-[#c8ddef80] text-gray-700 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[80%] xl:max-w-[80%] rounded-lg p-1 sm:p-2 md:p-3 lg:p-3 xl:p-3">
                      <p className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base">{message.content}</p>

                      {/* Display files for user messages if they exist */}
                      {message.files && message.files.length > 0 && (
                        <div className="mt-1 sm:mt-1 md:mt-2 lg:mt-2 xl:mt-2 space-y-1 sm:space-y-1 md:space-y-2 lg:space-y-2 xl:space-y-2">
                          {message.files.map((file, fileIndex) => (
                            <div
                              key={fileIndex}
                              className="p-1 sm:p-1 md:p-2 lg:p-2 xl:p-2 rounded flex justify-between items-center cursor-pointer hover:bg-opacity-30"
                              onClick={() => handleDocumentClick(file)}
                            >
                              <div className="flex items-center">
                                <img src="/doc.svg" className='w-3 h-3 mr-1' alt="" />
                                <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px] xl:max-w-[200px]">{file.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* For bot messages, check loading state */}
                {message.type === 'bot' && !message.isInitial && (
                  <div className="flex justify-start">
                    <div className="text-gray-800 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[80%] xl:max-w-[80%] rounded-lg p-1 sm:p-2 md:p-3 lg:p-3 xl:p-3">
                      <div className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-black" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-3 text-black" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-2 text-black" {...props} />,
                            h4: ({ node, ...props }) => <h4 className="text-lg font-medium mb-2 text-black" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      {/* Action buttons for bot messages */}
                      <div className="flex justify-start space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-4 text-gray-500 sm:mt-2 md:mt-3 lg:mt-4 xl:mt-4">
                        <button onClick={() => regenerateMessage(index)} className="hover:text-blue-500">
                          <RefreshCcw size={15} />
                        </button>
                        <button onClick={() => handleCopy(message.content)} className="hover:text-green-500">
                          <Clipboard size={15} />
                        </button>
                        <button onClick={() => console.log('Forward')} className="hover:text-yellow-500">
                          <ArrowRight size={15} />
                        </button>
                        <button onClick={() => console.log('Liked')} className="hover:text-blue-500">
                          <ThumbsUp size={15} />
                        </button>
                        <button onClick={() => console.log('Disliked')} className="hover:text-red-500">
                          <ThumbsDown size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Separate loader div that appears only when loading */}
            {isMessageLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[80%] xl:max-w-[80%] rounded-xl p-1 sm:p-2 md:p-3 lg:p-3 xl:p-3 flex items-center space-x-1 sm:space-x-1 md:space-x-2 lg:space-x-2 xl:space-x-2">
                  <Loader2 className="animate-spin text-gray-500" size={12} sm:size={14} md:size={16} lg:size={18} xl:size={18} />
                  <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm text-gray-500">
                    {selectedUser ? "MedCopilot is preparing a detailed response..." : "MedCopilot is preparing a response..."}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* File Upload Input (hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Display uploaded files before sending - fixed height to prevent layout shifts */}
      <div className="max-h-[10px] transition-all duration-200 ease-in-out">
        {uploadedFiles.length > 0 && (
          <div className="px-1 sm:px-2 md:px-3 lg:px-3 xl:px-3 py-1 sm:py-1 md:py-2 lg:py-2 xl:py-2">
            <div className="flex flex-wrap gap-1 sm:gap-1 md:gap-2 lg:gap-2 xl:gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-1 sm:px-2 md:px-3 lg:px-3 xl:px-3 py-1">
                  <span className="text-xs truncate max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px] xl:max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="ml-1 sm:ml-1 md:ml-2 lg:ml-2 xl:ml-2 text-gray-500 hover:text-red-500"
                    disabled={isTransitioning}
                  >
                    <X size={10} sm:size={12} md:size={14} lg:size={14} xl:size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Input Area - Only show at bottom when not in initial state */}
      {!showInitialState && (
        <div className={`p-1 sm:py-2 px-0 ${isFullScreen ? 'w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3' : 'w-3/4'} mx-auto transition-all duration-200 ease-in-out`}>
          <div className={`flex p-1 ${isInputFocused ? 'border-gray-100 drop-shadow-sm' : 'border-gray-200'} flex-col gap-1 sm:gap-1 md:gap-2 lg:gap-2 xl:gap-2 bg-[#ffffff] border dark:bg-[#27313C] dark:text-white overflow-hidden rounded-2xl pb-1`}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isTransitioning && handleSendMessage()}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={selectedUser ? "How can MedCopilot help with this patient?" : "Get key insights on your patient schedule and priorities for today"}
              className="flex-1 p-1 sm:p-2 md:p-3 lg:p-3 xl:p-3 rounded-lg text-sm focus:outline-none dark:bg-[#27313C] dark:text-white"
              disabled={isTransitioning}
            />
            <div className='flex justify-between items-center p-1 sm:p-2 md:p-3 lg:p-3 xl:p-3'>
              <div className='flex'>
                <button
                  onClick={triggerFileUpload}
                  className="p-1 sm:p-1 md:p-2 lg:p-2 xl:p-2 mr-1 sm:mr-1 md:mr-2 lg:mr-2 xl:mr-2 border-[#9B9EA2] border text-white rounded-full cursor-pointer transition-colors"
                  disabled={isTransitioning}
                >
                  <img src="/doc.svg" className='w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4' alt="" />
                </button>
              </div>
              <div className='flex'>
                <button
                  onClick={handleSendMessage}
                  className="p-1 sm:p-1 md:p-2 lg:p-2 xl:p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                  disabled={isTransitioning}
                >
                  <ArrowUp size={14} sm:size={16} md:size={18} lg:size={18} xl:size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;