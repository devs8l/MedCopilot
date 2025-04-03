import React, { useRef, useEffect, useContext, useState } from 'react';
import { RefreshCcw, Clipboard, ArrowRight, ThumbsUp, ThumbsDown, ArrowUp, Paperclip, Lightbulb, X, Clock, History, Loader2 } from 'lucide-react';
import { MedContext } from '../context/MedContext';
import { ChatContext } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const ChatInterface = ({ isFullScreen, promptGiven, setPromptGiven, isGeneralChat, isTransitioning }) => {
  const { openDocumentPreview, selectedUser } = useContext(MedContext);

  // First, add this formatting function at the top of your ChatInterface component file

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
    formatMedicalResponse
  } = useContext(ChatContext);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  // Different suggestions based on whether a patient is selected
  const patientSuggestionPrompts = [
    "Summarize this<br/> patient's last visit.",
    "Show me recent lab<br/> results and trends.",
    "Does this patient have any allergies or chronic conditions?",
    "Suggest possible causes for the patient's current symptoms."
  ];

  const generalSuggestionPrompts = [
    "Summary of my<br/> patient list for today",
    "Which patients need urgent<br/> attention or follow ups?",
    "What patterns should i be aware in today’s patients?",
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
  const formattedResponse1 = `
 \n### Patient's Primary Health Concern\n\n**Based on the provided medical history, determining the \"primary\" health concern is subjective and depends on the criteria used for prioritization. However, considering the diagnoses, treatments, and notes from the visits, a summary is provided below.**\n\n- Patient Name: Satya\n- Date of Birth: 1990-05-14\n- Gender: Male\n\n### Diagnosis Summary\n\n**The patient has been diagnosed with the following conditions across multiple visits:**\n\n*   **High Blood Pressure**: Diagnosed on 2024-02-24.\n*   **Chronic Migraine**: Diagnosed on 2024-02-26.\n*   **Anxiety Disorder**: Diagnosed on 2024-03-15.\n*   **Asthma**: Diagnosed on 2024-04-10.\n\n### Analysis and Prioritization\n\n**Considering the potential severity and impact on overall health, the conditions can be prioritized as follows:**\n\n*   **Cardiovascular Health**:\n*   **High Blood Pressure**: Requires lifestyle modifications (reduced salt intake, regular exercise) and medication (**Amlodipine**). Uncontrolled hypertension can lead to severe cardiovascular complications.\n*   **Elevated Cholesterol Levels**: Identified in the blood test during the Asthma visit. This further elevates the risk of cardiovascular diseases.\n*   **Respiratory Health**:\n*   **Asthma**: Requires avoiding triggers, using an inhaler, and follow-up lung function tests. Poorly managed asthma can result in acute exacerbations and impact the patient's quality of life.\n*   **Neurological Health**:\n*   **Chronic Migraine**: Requires monitoring stress levels and sleep patterns, and medication (**Sumatriptan**) for pain management. Migraines can significantly affect daily functioning. Mild Inflammation was detected during **MRI**.\n*   **Mental Health**:\n*   **Anxiety Disorder**: Requires relaxation techniques, therapy, and potentially medication. Anxiety can impact various aspects of life and co-exist with other conditions.\n\n### Conclusion\n\n**While the patient has multiple health concerns, **High Blood Pressure** and **Asthma** are potentially the most critical due to their direct impact on cardiovascular and respiratory systems, respectively. Effective management of these conditions is crucial to prevent complications. The patient's **Chronic Migraine** and **Anxiety Disorder** should also be addressed to improve their overall quality of life. Furthermore, **Elevated cholesterol levels** should be closely monitored and managed, considering its influence on cardiovascular health.**\n
`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto shadow-lg  transition-opacity duration-200 ease-in-out"
      style={{ opacity: isTransitioning ? 0.7 : 1 }}>
      {/* Messages Container with fixed minimum height */}
      <div
        ref={messageContainerRef}
        className={`flex-1 overflow-y-auto pb-1 sm:pb-1 md:pb-2 lg:pb-3 xl:pb-4 pr-1 sm:pr-2 md:pr-3 lg:pr-4 xl:pr-4 pl-1 sm:pl-2 md:pl-3 lg:pl-4 xl:pl-4 min-h-[200px] transition-all duration-200 ease-in-out ${messages.length === 1 ? 'flex items-center justify-center' : ''}`}
      >
        {messages.length === 1 ? (
          <div className="text-center space-y-3">
            <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl font-semibold dark:text-white">Good Morning Dr. John!</div>
            <p className="text-xs sm:text-xs  md:text-sm lg:text-sm xl:text-sm text-gray-600">Ask a question or click on the prompts to get started</p>
            {/* <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4 lg:mb-6 xl:mb-8 mt-2 sm:mt-3 md:mt-4 lg:mt-6 xl:mt-8">{messages[0].para}</p> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-4 w-full sm:w-2/3 m-auto">
              {suggestionPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="sm:py-2.5 sm:px-3 flex items-center justify-center text-xs sm:text-xs  text-[#7A7E86] border border-[#D3D4D7] rounded-xs hover:bg-gray-50 transition-colors text-center"
                  onClick={() => setInputMessage(prompt.replace(/<br\/>/g, ' '))} // Remove <br/> tags when setting input
                >
                  <p className='' dangerouslySetInnerHTML={{ __html: prompt }}></p>
                </button>
              ))}
            </div>
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
                      {/* Render formatted content using dangerouslySetInnerHTML */}
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

      {/* Input Area with smooth transitions */}
      <div className={`p-1 sm:py-2 md:py-3 lg:py-3 xl:py-4 px-0 ${isFullScreen ? 'w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3' : 'w-full'} mx-auto transition-all duration-200 ease-in-out`}>
        <div className={`flex ${isInputFocused ? 'border-blue-300 shadow-xs' : 'border-gray-200'} flex-col gap-1 sm:gap-1 md:gap-2 lg:gap-2 xl:gap-2 bg-[#48547004] border  dark:bg-[#27313C] dark:text-white overflow-hidden rounded-lg pb-1`}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isTransitioning && handleSendMessage()}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder={selectedUser ? "How can MedCopilot help with this patient?" : "Get key insights on your patient schedule and priorities for today"}
            className="flex-1 p-1 sm:p-2 md:p-3 lg:p-3 xl:p-3 rounded-lg focus:outline-none bg- dark:bg-[#27313C] dark:text-white"
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
    </div>
  );
};

export default ChatInterface;