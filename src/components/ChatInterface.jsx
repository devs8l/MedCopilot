import React, { useRef, useEffect, useContext } from 'react';
import { RefreshCcw, Clipboard, ArrowRight, ThumbsUp, ThumbsDown, ArrowUp, Paperclip, Lightbulb, X, Clock, History, Loader2 } from 'lucide-react';
import { MedContext } from '../context/MedContext';

const ChatInterface = ({ isFullScreen, promptGiven, setPromptGiven }) => {
  const {
    openDocumentPreview,
    messages,
    inputMessage,
    setInputMessage,
    uploadedFiles,
    setUploadedFiles,
    sendMessage,
    regenerateMessage,
    selectedUser,
    handleClockClick,
    isloadingHistory,
    isMessageLoading
  } = useContext(MedContext);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const suggestionPrompts = [
    "Summarize this patient's last visit.",
    "Show me recent lab results and trends.",
    "Does this patient have any allergies or chronic conditions?",
    "Suggest possible causes for the patient's current symptoms."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMessageLoading]);

  const handleSendMessage = () => {
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
    // Use the openDocumentPreview function from context
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

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-white dark:bg-[#272626] shadow-lg">
      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto p-4 ${messages.length === 1 ? 'flex items-center justify-center' : ''}`}>
        {messages.length === 1 ? (
          <div className="text-center space-y-1">
            <div className="text-xl font-semibold dark:text-white">{messages[0].content}</div>
            <p className="text-sm text-gray-600 ">{messages[0].subtext}</p>
            <p className="text-sm text-gray-600 mb-10 mt-10">{messages[0].para}</p>

            <div className="grid grid-cols-2 gap-4 w-2/3 m-auto">
              {suggestionPrompts.map((prompt, index) => (
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
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className="space-y-1">
                {/* User messages always render normally */}
                {message.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white max-w-[80%] rounded-xl p-3">
                      <p>{message.content}</p>

                      {/* Display files for user messages if they exist */}
                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.files.map((file, fileIndex) => (
                            <div
                              key={fileIndex}
                              className="p-2 bg-white bg-opacity-20 rounded flex justify-between items-center cursor-pointer hover:bg-opacity-30"
                              onClick={() => handleDocumentClick(file)}
                            >
                              <div className="flex items-center">
                                <img src="/doc.svg" className='w-3 h-3 mr-1' alt="" />
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
                    <div className="bg-gray-100 text-gray-800 max-w-[80%] rounded-xl p-3">
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
                  <span className="text-sm text-gray-500">MedCopilot is preparing a detailed response...</span>
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

      {/* Display uploaded files before sending */}
      {uploadedFiles.length > 0 && (
        <div className="px-3 py-2">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={`py-4 px-0 ${isFullScreen ? 'w-1/3' : 'w-full'} mx-auto`}>
        <div className="flex flex-col gap-2 bg-gray-100 dark:bg-[#171616] dark:text-white overflow-hidden rounded-lg pb-1">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="How can MedCopilot help?"
            className="flex-1 p-4 rounded-lg focus:outline-none dark:bg-[#171616] dark:text-white"
          />
          <div className='flex justify-between items-center p-4'>
            <div className='flex'>
              <button
                onClick={triggerFileUpload}
                className="p-3 mr-2 border-[#9B9EA2] border text-white rounded-full cursor-pointer transition-colors"
              >
                <img src="/doc.svg" className='w-4 h-4' alt="" />
              </button>
              <button
                onClick={handleSendMessage}
                className="p-2 px-4 mr-2 border-[#9B9EA2] border text-white flex rounded-full cursor-pointer gap-2 items-center transition-colors"
              >
                <Lightbulb color={'#9B9EA2'} size={20} /><span className='text-[#9B9EA2]'>Think</span>
              </button>
            </div>
            <div className='flex'>
              <button
                onClick={() => handleClockClick(selectedUser._id)}
                className="p-3 mr-2 border-[#9B9EA2] border text-white flex rounded-full cursor-pointer gap-2 items-center transition-colors"
              >
                {isloadingHistory ? (
                  <Loader2 className="animate-spin" color={'#9B9EA2'} size={20} />
                ) : (
                  <History color={'#9B9EA2'} size={20} />
                )}
              </button>
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
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