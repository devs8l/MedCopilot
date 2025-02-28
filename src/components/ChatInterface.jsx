import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCcw, Clipboard, ArrowRight, ThumbsUp, ThumbsDown, ChevronUp, ArrowUp, Paperclip, Lightbulb, Clock10 } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi, I am your copilot!',
      subtext: 'Chat and resolve all your queries',
      para: 'Or try these prompts to get started',
      isInitial: true // Marking the initial message
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
        content: 'temp reply later we will use AI here',
        isInitial: false // Mark as non-initial AI response
      }]);
    }, 1000);

    setInputMessage('');
  };

  const handleRegenerate = (index) => {
    setMessages(prevMessages => {
      return prevMessages.map((msg, i) => {
        if (i === index) {
          return { ...msg, content: 'regenerated temp msg' }; // Modify AI response
        }
        return msg;
      });
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-white dark:bg-[#272626] shadow-lg">
      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto p-4 ${messages.length === 1 ? 'flex items-center justify-center' : ''}`}>
        {messages.length === 1 ? (
          <div className="text-center space-y-1">
            <div className="text-xl font-semibold">{messages[0].content}</div>
            <p className="text-sm text-gray-600">{messages[0].subtext}</p>
            <p className="text-sm text-gray-600 mb-12 mt-15">{messages[0].para}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
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
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                    } max-w-[80%] rounded-xl p-3`}>
                    <p>{message.content}</p>
                  </div>
                </div>

                {/* Action buttons for bot messages (excluding the initial copilot message) */}
                {message.type === 'bot' && !message.isInitial && (
                  <div className="flex justify-start space-x-4 text-gray-500 ml-2 mt-4">
                    <button onClick={() => handleRegenerate(index)} className="hover:text-blue-500">
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
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="py-4 px-0 ">
        <div className="flex flex-col  gap-2 bg-gray-100 overflow-hidden rounded-lg pb-1">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="How can MedCopilot help?"
            className="flex-1 p-4  rounded-lg focus:outline-none bg-gray-100"
          />
          <div className='flex justify-between items-center p-4'>
            <div className='flex '>
              <button
                onClick={handleSendMessage}
                className="p-2 mr-2 border-[#72A8EE]  border text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <Paperclip  color={'#72A8EE'} />
              </button>
              <button
                onClick={handleSendMessage}
                className="p-2 px-4 mr-2 border-[#72A8EE] border text-white flex rounded-full cursor-pointer  transition-colors"
              >
                <Lightbulb  color={'#72A8EE'} size={25} /><span className='text-[#72A8EE]'>Think</span>
              </button>
            </div>
            <div>
              <button
                onClick={handleSendMessage}
                className="p-2 mr-2 border-[#72A8EE] border text-white rounded-full cursor-pointer  transition-colors"
              >
                <Clock10 color={'#72A8EE'} size={25} />
              </button>
              <button
                onClick={handleSendMessage}
                className="p-2 mr-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
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
