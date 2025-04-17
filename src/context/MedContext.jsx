// MedContext.jsx
import { createContext, useEffect, useState } from 'react';

export const MedContext = createContext();

const MedContextProvider = (props) => {
  const [isUserSelected, setIsUserSelected] = useState(
    localStorage.getItem('isUserSelected') === 'true'
  );
  const [filterBasis, setFilterBasis] = useState('schedule');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize users state
  const [users, setUsers] = useState([]);

  // Fetch patient data from API
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://medicalchat-backend-mongodb.vercel.app/patients/all');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const today = new Date();
        const processedData = data.map(user => ({
          ...user,
          appointmentDate: today.toISOString() // or format it as needed
        }));
        setUsers(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Initialize selectedUser from localStorage or set to null
  const [selectedUser, setSelectedUser] = useState(() => {
    const savedUserJSON = localStorage.getItem('selectedUser');
    if (savedUserJSON) {
      try {
        const savedUser = JSON.parse(savedUserJSON);
        return savedUser;
      } catch (error) {
        console.error('Error parsing saved user from localStorage:', error);
      }
    }
    return null;
  });

  // Verify selectedUser still exists in users array after fetching
  useEffect(() => {
    if (selectedUser && users.length > 0) {
      // Use _id for comparison since that's the MongoDB identifier
      const userStillExists = users.some((user) => user._id === selectedUser._id);
      if (!userStillExists) {
        setSelectedUser(null);
        localStorage.removeItem('selectedUser');
        localStorage.setItem('isUserSelected', 'false');
      }
    }
  }, [users, selectedUser]);

  // Update localStorage when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
      localStorage.setItem('isUserSelected', 'true');
    } else {
      localStorage.removeItem('selectedUser');
      localStorage.setItem('isUserSelected', 'false');
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

  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(new Date("2025-03-25"));
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication handlers
  const login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
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
    ? users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : users.filter((user) => {
      if (!user.appointmentDate) return false;

      const userDateFormatted = formatDateForComparison(user.appointmentDate);
      const userDate = new Date(user.appointmentDate);

      if (filterBasis === 'day' || filterBasis === 'schedule') {
        return userDateFormatted === formattedSelectedDate;
      } else if (filterBasis === 'week') {
        // Get the bounds of the week containing the selected date
        const { startOfWeek, endOfWeek } = getWeekBounds(selectedDate);

        // Check if the user date is within the range
        return userDate >= startOfWeek && userDate <= endOfWeek;
      } else if (filterBasis === 'month') {
        return (
          userDate.getFullYear() === selectedDate.getFullYear() &&
          userDate.getMonth() === selectedDate.getMonth()
        );
      } else if (filterBasis === 'year') {
        return userDate.getFullYear() === selectedDate.getFullYear();
      }

      return false;
    });

  // Get week bounds for the context to use in components
  const weekBounds = getWeekBounds(selectedDate);

  // Separate search filtered users
  const searchFilteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    selectedUser,
    setSelectedUser: handleSelectUser,
    isLoading,
    error,
    isNotesExpanded,
    setIsNotesExpanded

  };

  return <MedContext.Provider value={value}>{props.children}</MedContext.Provider>;
};

export default MedContextProvider;