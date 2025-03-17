import React, { useRef, useEffect, useContext } from 'react';
import { RefreshCcw, Clipboard, ArrowRight, ThumbsUp, ThumbsDown, ArrowUp, X, Loader2 } from 'lucide-react';
import { MedContext } from '../context/MedContext';
import { ChatContext } from '../context/ChatContext';

const ChatInterface = ({ isFullScreen, promptGiven, setPromptGiven, isGeneralChat, isTransitioning }) => {
  const { openDocumentPreview, selectedUser } = useContext(MedContext);

  const {
    messages,
    inputMessage,
    setInputMessage,
    uploadedFiles,
    setUploadedFiles,
    sendMessage,
    regenerateMessage,
    isMessageLoading,
    isloadingHistory,
    isSessionActive,
    activeSessionUserId
  } = useContext(ChatContext);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  // Different suggestions based on whether a patient is selected
  const patientSuggestions = [
    "Summarize her BP medication for me",
    "Mention touchpoints from her last visit",
    "Update me on her recent lab reports"
  ];

  const generalSuggestionPrompts = [
    "What are the symptoms of seasonal allergies?",
    "How can I improve my sleep quality?",
    "What foods are good for heart health?",
    "How much exercise is recommended per week?"
  ];

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

  // Initial scroll on component mount
  useEffect(() => {
    debouncedScrollToBottom();
  }, []);

  // Save the previous scroll position before transition
  useEffect(() => {
    if (isTransitioning && messageContainerRef.current) {
      messageContainerRef.current.dataset.scrollTop = messageContainerRef.current.scrollTop;
    } else if (!isTransitioning && messageContainerRef.current && messageContainerRef.current.dataset.scrollTop) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.dataset.scrollTop;
    }
  }, [isTransitioning]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;
    
    sendMessage(inputMessage, uploadedFiles);
    setPromptGiven(true);
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

  // Check if it's the initial message state (welcome message)
  const isInitialState = messages.length === 1 && messages[0].isInitial;
  const isActiveSessionUser = selectedUser && selectedUser._id === activeSessionUserId; 
  const isPatientSession = !!selectedUser;

  return (
    <div className="flex flex-col h-full w-full mx-auto shadow-lg transition-opacity duration-200 ease-in-out" 
         style={{ opacity: isTransitioning ? 0.7 : 1 }}>
      {/* Messages Container with fixed minimum height */}
      <div 
        ref={messageContainerRef}
        className={`flex-1 overflow-y-auto ${isSessionActive && isActiveSessionUser  ? 'justify-start items-end':''} pb-4 pr-4 pl-4 min-h-[200px] transition-all duration-200 ease-in-out ${isInitialState ? 'flex items-center justify-center' : ''}`}
      >
        {isInitialState ? (
          <>
            {/* Show patient welcome message if session is active and patient is selected */}
            {isSessionActive && isActiveSessionUser  ? (
              <div className="w-[50%] p-4 flex flex-col gap-2 rounded-lg">
                <div className="text-center mb-4">
                  <p className="text-md text-left font-medium text-gray-700">Chat session started for {selectedUser.name || 'Patient'}! Ask a question or use these prompts to get started</p>
                </div>
                <div className="flex flex-col space-y-2">
                  {patientSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="py-1 text-blue-500  border w-[80%] border-blue-200 rounded-full hover:bg-blue-50 transition-colors text-center"
                      onClick={() => setInputMessage(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Show general welcome message if no session is active or no patient is selected */
              <div className="text-center space-y-1">
                <div className="text-xl font-semibold dark:text-white">{messages[0].content}</div>
                <p className="text-sm text-gray-600">{messages[0].subtext}</p>
                <p className="text-sm text-gray-600 mb-10 mt-10">{messages[0].para}</p>

                <div className="grid grid-cols-2 gap-4 w-2/3 m-auto">
                  {generalSuggestionPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="p-4 text-sm text-[#52A1FF] border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
                      onClick={() => setInputMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className="space-y-1">
                {/* User messages always render normally */}
                {message.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white max-w-[80%] rounded-lg p-3">
                      <p>{message.content}</p>

                      {/* Display files for user messages if they exist */}
                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.files.map((file, fileIndex) => (
                            <div
                              key={fileIndex}
                              className="p-2 rounded flex justify-between items-center cursor-pointer hover:bg-opacity-30"
                              onClick={() => handleDocumentClick(file)}
                            >
                              <div className="flex items-center">
                                <img src="/doc.svg" className="w-3 h-3 mr-1" alt="" />
                                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
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
                    <div className="bg-white text-gray-800 max-w-[80%] rounded-lg p-3">
                      <p>{message.content}</p>

                      {/* Action buttons for bot messages */}
                      <div className="flex justify-start space-x-4 text-gray-500 ml-2 mt-4">
                        <button onClick={() => regenerateMessage(index)} className="hover:text-blue-500">
                          <RefreshCcw size={18} />
                        </button>
                        <button onClick={() => handleCopy(message.content)} className="hover:text-green-500">
                          <Clipboard size={18} />
                        </button>
                        <button onClick={() => console.log('Forward')} className="hover:text-yellow-500">
                          <ArrowRight size={18} />
                        </button>
                        <button onClick={() => console.log('Liked')} className="hover:text-blue-500">
                          <ThumbsUp size={18} />
                        </button>
                        <button onClick={() => console.log('Disliked')} className="hover:text-red-500">
                          <ThumbsDown size={18} />
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
                <div className="bg-gray-100 text-gray-800 max-w-[80%] rounded-xl p-3 flex items-center space-x-2">
                  <Loader2 className="animate-spin text-gray-500" size={20} />
                  <span className="text-sm text-gray-500">
                    {selectedUser ? "MedCopilot is preparing a detailed response..." : "Health Copilot is preparing a response..."}
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
      <div className="max-h-[100px] transition-all duration-200 ease-in-out">
        {uploadedFiles.length > 0 && (
          <div className="px-3 py-2">
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                  <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                    disabled={isTransitioning}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area with smooth transitions */}
      <div className={`p-4 px-0 ${isFullScreen ? 'w-1/3' : 'w-full'} mx-auto transition-all duration-200 ease-in-out`}>
        <div className="flex flex-col gap-2 bg-white dark:bg-[#27313C] dark:text-white overflow-hidden rounded-lg pb-1">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isTransitioning && handleSendMessage()}
            placeholder={selectedUser ? "How can MedCopilot help with this patient?" : "Ask Health Copilot any general health questions"}
            className="flex-1 p-4 rounded-lg focus:outline-none dark:bg-[#27313C] dark:text-white"
            disabled={isTransitioning}
          />
          <div className='flex justify-between items-center p-4'>
            <div className='flex'>
              <button
                onClick={triggerFileUpload}
                className="p-3 mr-2 border-[#9B9EA2] border text-white rounded-full cursor-pointer transition-colors"
                disabled={isTransitioning}
              >
                <img src="/doc.svg" className='w-4 h-4' alt="" />
              </button>
            </div>
            <div className='flex'>
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                disabled={isTransitioning}
              >
                <ArrowUp size={25} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;