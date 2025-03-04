import { createContext, useEffect, useState } from 'react';

export const MedContext = createContext();

const MedContextProvider = (props) => {
  const [isUserSelected, setIsUserSelected] = useState(
    localStorage.getItem("isUserSelected") === "true"
  );
  const [filterBasis, setFilterBasis] = useState("day");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);


  const [isloadingHistory, setIsloadingHistory] = useState(false);

  // Chat state management
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
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Initialize users state
  const [users, setUsers] = useState([]);

  // Fetch patient data from API
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://medicalchat-backend-mongodb.vercel.app/patients/all");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Initialize selectedUser from localStorage or set to null
  const [selectedUser, setSelectedUser] = useState(() => {
    const savedUserJSON = localStorage.getItem("selectedUser");
    if (savedUserJSON) {
      try {
        const savedUser = JSON.parse(savedUserJSON);
        return savedUser;
      } catch (error) {
        console.error("Error parsing saved user from localStorage:", error);
      }
    }
    return null;
  });

  // Verify selectedUser still exists in users array after fetching
  useEffect(() => {
    if (selectedUser && users.length > 0) {
      // Use _id for comparison since that's the MongoDB identifier
      const userStillExists = users.some(user => user._id === selectedUser._id);
      if (!userStillExists) {
        setSelectedUser(null);
        localStorage.removeItem("selectedUser");
        localStorage.setItem("isUserSelected", "false");
      }
    }
  }, [users, selectedUser]);

  // Update localStorage when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
      localStorage.setItem("isUserSelected", "true");
    } else {
      localStorage.removeItem("selectedUser");
      localStorage.setItem("isUserSelected", "false");
    }
  }, [selectedUser]);

  const openDocumentPreview = (doc) => {
    setPreviewDoc(doc);
    setIsPreviewVisible(true);
  };

  const closeDocumentPreview = () => {
    setPreviewDoc(null);
    setIsPreviewVisible(false);
  };

  // Function to handle sending messages
  const sendMessage = async (message, files = []) => {
    setInputMessage('');
    if (!message.trim() && files.length === 0) return;

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: message,
      files: files.length > 0 ? files : undefined
    }]);
    setIsMessageLoading(true);

    try {
      // First, fetch the patient history
      if (!selectedUser) {
        throw new Error("No patient selected");
      }

      const historyData = await fetchPatientHistory(selectedUser._id);

      if (!historyData) {
        throw new Error("Failed to fetch patient history");
      }

      // Make API call to get medical analysis with history data
      const response = await fetch(
        `https://medicalchat-tau.vercel.app/medical_analysis/${encodeURIComponent(message)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(historyData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Add bot response to messages
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.content || 'No response from medical analysis',
        isInitial: false
      }]);
    } catch (error) {
      console.error('Error processing medical analysis:', error);

      // Add error message to messages
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, there was an error processing your request.',
        isInitial: false
      }]);
    }
    finally {
      setIsMessageLoading(false);
    }

    // Clear input and files after sending

    setUploadedFiles([]);
  };

  // Function to regenerate specific message
  const regenerateMessage = async (index) => {
    // Get the original user message to regenerate the response
    const originalUserMessage = messages[index - 1]?.content;

    if (!originalUserMessage || !selectedUser) {
      console.error("Cannot regenerate message: No original message or selected user");
      return;
    }

    try {
      // Remove the current bot message
      setMessages(prevMessages =>
        prevMessages.filter((_, i) => i !== index)
      );

      // Show loading state
      setIsMessageLoading(true);

      // Fetch patient history
      const historyData = await fetchPatientHistory(selectedUser._id);

      if (!historyData) {
        throw new Error("Failed to fetch patient history");
      }

      // Regenerate response using the original message
      const response = await fetch(
        `https://medicalchat-tau.vercel.app/medical_analysis/${encodeURIComponent(originalUserMessage)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(historyData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Add regenerated bot response to messages
      setMessages(prevMessages => [
        ...prevMessages,
        {
          type: 'bot',
          content: data.content || 'No response from medical analysis',
          isInitial: false
        }
      ]);

    } catch (error) {
      console.error('Error regenerating message:', error);

      // Add error message to messages
      setMessages(prevMessages => [
        ...prevMessages,
        {
          type: 'bot',
          content: 'Sorry, unable to regenerate the response. Please try again.',
          isInitial: false
        }
      ]);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication handlers
  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  // Enhanced setSelectedUser function that also updates isUserSelected
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsUserSelected(!!user);
  };

  // Format dates consistently for comparison
  const formatDateForComparison = (date) => {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return new Date(date).toISOString().split('T')[0];
  };

  // Helper function to get the week bounds for a given date
  const getWeekBounds = (date) => {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();

    // Calculate start of week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  };

  // Get formatted selected date for comparison
  const formattedSelectedDate = formatDateForComparison(selectedDate);

  // If there's a search query, ignore date filtering and return search results
  const filteredUsers = searchQuery
    ? users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : users.filter(user => {
      if (!user.appointmentDate) return false;

      const userDateFormatted = formatDateForComparison(user.appointmentDate);
      const userDate = new Date(user.appointmentDate);

      if (filterBasis === "day") {
        return userDateFormatted === formattedSelectedDate;
      } else if (filterBasis === "week") {
        // Get the bounds of the week containing the selected date
        const { startOfWeek, endOfWeek } = getWeekBounds(selectedDate);

        // Check if the user date is within the range
        return userDate >= startOfWeek && userDate <= endOfWeek;
      } else if (filterBasis === "month") {
        return (
          userDate.getFullYear() === selectedDate.getFullYear() &&
          userDate.getMonth() === selectedDate.getMonth()
        );
      } else if (filterBasis === "year") {
        return userDate.getFullYear() === selectedDate.getFullYear();
      }

      return false;
    });

  // Get week bounds for the context to use in components
  const weekBounds = getWeekBounds(selectedDate);

  // Separate search filtered users
  const searchFilteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchPatientHistory = async (selectedUserId) => {
    try {
      const response = await fetch(
        `https://medicalchat-backend-mongodb.vercel.app/patients/${selectedUserId}/history`
      );
      if (!response.ok) throw new Error("Failed to fetch history");
      const historyData = await response.json();
      return historyData; // Pass this to the next API
    } catch (error) {
      console.error("Error fetching history:", error);
      return null;
    }
  };

  const analyzePatientHistory = async (historyData) => {
    try {
      const response = await fetch(
        `https://medicalchat-tau.vercel.app/medical_analysis/what was my patient suffer most`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(historyData), // Sending history as body
        }
      );
      if (!response.ok) throw new Error("Analysis failed");
      const analysisResult = await response.json();
      return analysisResult;
    } catch (error) {
      console.error("Error analyzing history:", error);
      return null;
    }
  };
  const handleClockClick = async (selectedUserId) => {
    // Ensure a user is selected
    if (!selectedUserId) {
      console.error("No patient selected");
      return;
    }

    try {
      setIsloadingHistory(true);

      // Fetch patient history
      const historyData = await fetchPatientHistory(selectedUserId);

      if (!historyData) {
        throw new Error("No patient history found");
      }

      // Fetch analysis with a more dynamic query
      const analysisResult = await fetch(
        `https://medicalchat-tau.vercel.app/medical_analysis/Provide a comprehensive overview of this patient's medical history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(historyData),
        }
      );

      if (!analysisResult.ok) {
        throw new Error("Failed to analyze patient history");
      }

      const analysisData = await analysisResult.json();

      // Add bot message with consistent type
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          content: analysisData.content || 'No analysis available',
          isInitial: false
        },
      ]);

    } catch (error) {
      console.error("Error fetching/analyzing patient history:", error);

      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          content: 'Unable to retrieve patient history. Please try again.',
          isInitial: false
        },
      ]);
    } finally {
      setIsloadingHistory(false);
    }
  };





  const value = {
    isAuthenticated,
    login,
    logout,
    selectedDate,
    setSelectedDate,
    users,
    filteredUsers,
    setUsers,
    searchQuery,
    setSearchQuery,
    isUserSelected,
    setIsUserSelected,
    filterBasis,
    setFilterBasis,
    isExpanded,
    setIsExpanded,
    searchFilteredUsers,
    weekBounds,
    previewDoc,
    isPreviewVisible,
    openDocumentPreview,
    closeDocumentPreview,
    // Chat-related state and functions
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    uploadedFiles,
    setUploadedFiles,
    sendMessage,
    regenerateMessage,
    // User selection with local storage support
    selectedUser,
    setSelectedUser: handleSelectUser,
    // Loading and error states
    isLoading,
    error,
    //history
    fetchPatientHistory,
    analyzePatientHistory,
    handleClockClick,
    isloadingHistory,
    // Message loading state
    isMessageLoading
  };

  return (
    <MedContext.Provider value={value}>
      {props.children}
    </MedContext.Provider>
  );
};

export default MedContextProvider;