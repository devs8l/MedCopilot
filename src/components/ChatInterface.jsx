import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi, I am your copilot!',
      subtext: 'Chat and resolve all your queries',
      para: 'Or try these prompts to get started',
      isInitial: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const suggestionPrompts = [
    'How to get Lorem Ipsum?',
    'How to get Lorem Ipsum?',
    'How to get Lorem Ipsum?',
    'How to get Lorem Ipsum?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);

    // Simulated AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'temp reply later we will use ai here',
      }]);
    }, 1000);

    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-[80vh] w-full mx-auto bg-white shadow-lg overflow-hidden">

      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto p-4 ${messages.length === 1 ? 'flex items-center justify-center' : ''}`}>
        {messages.length === 1 ? (
          // Show initial message and prompts in center when no user messages exist
          <div className="text-center space-y-4">
            <div className="text-xl font-semibold">{messages[0].content}</div>
            <p className="text-sm text-gray-600">{messages[0].subtext}</p>
            <p className="text-sm text-gray-600 mb-12 mt-15">{messages[0].para}</p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {suggestionPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="p-4 text-sm text-blue-500 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
                  onClick={() => setInputMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Normal chat messages
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                } max-w-[80%] rounded-lg p-3`}>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className=" p-4">
        <div className="flex items-center gap-2 bg-gray-100 overflow-hidden rounded-lg">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type Here..."
            className="flex-1 p-4  rounded-lg focus:outline-none bg-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 mr-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Send size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
