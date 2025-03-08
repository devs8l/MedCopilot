import { createContext, useContext, useState, useEffect } from 'react';
import { MedContext } from './MedContext';

export const ChatContext = createContext();

const ChatContextProvider = (props) => {
  const { selectedUser } = useContext(MedContext);

  // Store messages by user ID, including 'general' for non-patient chat
  const [userMessages, setUserMessages] = useState({
    general: [
      {
        type: 'bot',
        content: 'Hi, I am your copilot!',
        subtext: 'Chat and resolve all your queries',
        para: 'Or try these prompts to get started',
        isInitial: true,
      }
    ]
  });

  // Current input message
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isloadingHistory, setIsloadingHistory] = useState(false);

  // Default initial message for new users
  const defaultInitialMessage = {
    type: 'bot',
    content: 'Hi, I am your copilot!',
    subtext: 'Chat and resolve all your queries',
    para: 'Or try these prompts to get started',
    isInitial: true,
  };

  // Get current messages - either selected user or general
  const messages = selectedUser
    ? (userMessages[selectedUser._id] || [defaultInitialMessage])
    : (userMessages.general || [defaultInitialMessage]);

  // Update current messages - either for selected user or general
  const setMessages = (newMessages) => {
    const messageKey = selectedUser ? selectedUser._id : 'general';

    setUserMessages(prevUserMessages => ({
      ...prevUserMessages,
      [messageKey]: typeof newMessages === 'function'
        ? newMessages(prevUserMessages[messageKey] || 
          (messageKey === 'general' ? userMessages.general : [defaultInitialMessage]))
        : newMessages
    }));
  };

  // Load chat history for selected user
  useEffect(() => {
    if (selectedUser && !userMessages[selectedUser._id]) {
      // Initialize this user's messages with default message if no history exists
      setUserMessages(prev => ({
        ...prev,
        [selectedUser._id]: [defaultInitialMessage]
      }));

      // Optionally, you could fetch chat history from an API here
      // fetchChatHistory(selectedUser._id).then(history => {
      //   if (history && history.length > 0) {
      //     setUserMessages(prev => ({
      //       ...prev,
      //       [selectedUser._id]: history
      //     }));
      //   }
      // });
    }
  }, [selectedUser]);

  // Function to handle sending messages
  const sendMessage = async (message, files = []) => {
    setInputMessage('');
    if (!message.trim() && files.length === 0) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        content: message,
        files: files.length > 0 ? files : undefined,
      },
    ]);
    setIsMessageLoading(true);

    try {
      if (selectedUser) {
        // Patient-specific flow
        // First, fetch the patient history
        const historyData = await fetchPatientHistory(selectedUser._id);

        if (!historyData) {
          throw new Error('Failed to fetch patient history');
        }

        // Make API call to get medical analysis with history data
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/medical_analysis/${encodeURIComponent(message)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(historyData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Add bot response to messages
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: data.content || 'No response from medical analysis',
            isInitial: false,
          },
        ]);
      } else {
        // General health chat flow - using a different endpoint without patient data
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/general_health_chat/${encodeURIComponent(message)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: message }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Add bot response to messages
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: data.content || 'No response from general health chat',
            isInitial: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error processing chat:', error);

      // Add error message to messages
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content: 'Sorry, there was an error processing your request.',
          isInitial: false,
        },
      ]);
    } finally {
      setIsMessageLoading(false);
    }

    // Clear input and files after sending
    setUploadedFiles([]);
  };

  // Function to regenerate specific message
  const regenerateMessage = async (index) => {
    // Get the original user message to regenerate the response
    const originalUserMessage = messages[index - 1]?.content;

    if (!originalUserMessage) {
      console.error('Cannot regenerate message: No original message found');
      return;
    }

    try {
      // Remove the current bot message
      setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));

      // Show loading state
      setIsMessageLoading(true);

      if (selectedUser) {
        // Patient-specific regeneration
        // Fetch patient history
        const historyData = await fetchPatientHistory(selectedUser._id);

        if (!historyData) {
          throw new Error('Failed to fetch patient history');
        }

        // Regenerate response using the original message
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/medical_analysis/${encodeURIComponent(originalUserMessage)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(historyData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Add regenerated bot response to messages
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'bot',
            content: data.content || 'No response from medical analysis',
            isInitial: false,
          },
        ]);
      } else {
        // General health chat regeneration
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/general_health_chat/${encodeURIComponent(originalUserMessage)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: originalUserMessage }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Add regenerated bot response to messages
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'bot',
            content: data.content || 'No response from general health chat',
            isInitial: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error regenerating message:', error);

      // Add error message to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          content: 'Sorry, unable to regenerate the response. Please try again.',
          isInitial: false,
        },
      ]);
    } finally {
      setIsMessageLoading(false);
    }
  };

  // Fetch patient history
  const fetchPatientHistory = async (selectedUserId) => {
    try {
      const response = await fetch(
        `https://medicalchat-backend-mongodb.vercel.app/patients/${selectedUserId}/history`
      );
      if (!response.ok) throw new Error('Failed to fetch history');
      const historyData = await response.json();
      return historyData; // Pass this to the next API
    } catch (error) {
      console.error('Error fetching history:', error);
      return null;
    }
  };

  // Handle clock click (fetch and analyze patient history)
  const handleClockClick = async () => {
    // If no user is selected, show a general health tips response
    if (!selectedUser) {
      setIsloadingHistory(true);
      try {
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/general_health_chat/${encodeURIComponent("Provide general health tips and wellness advice")}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: "general health tips" }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to get general health tips');
        }

        const data = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'bot',
            content: data.content || 'Here are some general health tips...',
            isInitial: false,
          },
        ]);
      } catch (error) {
        console.error('Error fetching general health tips:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'bot',
            content: 'Unable to retrieve health tips at this time. Please try again later.',
            isInitial: false,
          },
        ]);
      } finally {
        setIsloadingHistory(false);
      }
      return;
    }

    try {
      setIsloadingHistory(true);

      // Fetch patient history
      const historyData = await fetchPatientHistory(selectedUser._id);

      if (!historyData) {
        throw new Error('No patient history found');
      }

      // Fetch analysis with a more dynamic query
      const analysisResult = await fetch(
        `https://medicalchat-tau.vercel.app/medical_analysis/Provide a comprehensive overview of this patient's medical history`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(historyData),
        }
      );

      if (!analysisResult.ok) {
        throw new Error('Failed to analyze patient history');
      }

      const analysisData = await analysisResult.json();

      // Add bot message with consistent type
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          content: analysisData.content || 'No analysis available',
          isInitial: false,
        },
      ]);
    } catch (error) {
      console.error('Error fetching/analyzing patient history:', error);

      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          content: 'Unable to retrieve patient history. Please try again.',
          isInitial: false,
        },
      ]);
    } finally {
      setIsloadingHistory(false);
    }
  };

  // Option to clear chat history
  const clearChatHistory = (userId = null) => {
    if (userId) {
      // Clear history for specific user
      setUserMessages(prev => ({
        ...prev,
        [userId]: [defaultInitialMessage]
      }));
    } else if (selectedUser) {
      // Clear history for currently selected user
      setUserMessages(prev => ({
        ...prev,
        [selectedUser._id]: [defaultInitialMessage]
      }));
    } else {
      // Clear general chat history
      setUserMessages(prev => ({
        ...prev,
        general: [{
          type: 'bot',
          content: 'Hi, I am your health copilot!',
          subtext: 'Chat and resolve all your general health queries',
          para: 'Or try these prompts to get started',
          isInitial: true,
        }]
      }));
    }
  };

  const value = {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    uploadedFiles,
    setUploadedFiles,
    sendMessage,
    regenerateMessage,
    isMessageLoading,
    isloadingHistory,
    handleClockClick,
    clearChatHistory,
    userMessages
  };

  return <ChatContext.Provider value={value}>{props.children}</ChatContext.Provider>;
};

export default ChatContextProvider;