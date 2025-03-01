import { createContext, useEffect, useState } from 'react';

export const MedContext = createContext();

const MedContextProvider = (props) => {
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [filterBasis, setFilterBasis] = useState("day");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
    { id: "MAS12345", name: "Andrea Smith", time: "12:00 PM", status: "Active", appointmentDate: "2025-02-23", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12346", name: "Zack Thompson", time: "1:00 PM", status: "First Time Patient", appointmentDate: "2025-02-26", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12347", name: "Lara Chen", time: "2:00 PM", status: "Returning", appointmentDate: "2025-02-23", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12348", name: "Michael Brown", time: "2:30 PM", status: "Active", appointmentDate: "2025-02-25", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12349", name: "Sarah Wilson", time: "3:00 PM", status: "Active", appointmentDate: "2025-02-23", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12350", name: "James Rodriguez", time: "3:30 PM", status: "First Time Patient", appointmentDate: "2025-02-24", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12351", name: "Emma Davis", time: "4:00 PM", status: "Active", appointmentDate: "2025-02-23", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12352", name: "David Miller", time: "4:30 PM", status: "Returning", appointmentDate: "2025-02-25", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12353", name: "Sophie Taylor", time: "5:00 PM", status: "Active", appointmentDate: "2025-02-24", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12354", name: "Robert Garcia", time: "5:30 PM", status: "First Time Patient", appointmentDate: "2025-02-23", profileImage: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe" },
    { id: "MAS12355", name: "Lisa Anderson", time: "6:00 PM", status: "Active", appointmentDate: "2025-03-01", profileImage: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe" },
    { id: "MAS12356", name: "Kevin", time: "6:30 PM", status: "Returning", appointmentDate: "2025-03-02", profileImage: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe" },
    { id: "MAS12357", name: "Rachel White", time: "7:00 PM", status: "Active", appointmentDate: "2025-03-02", profileImage: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe" },
    { id: "MAS12358", name: "Thomas Lee", time: "7:30 PM", status: "First Time Patient", appointmentDate: "2025-03-01", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12359", name: "Patricia Clark", time: "8:00 PM", status: "Active", appointmentDate: "2025-03-01", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
  ]);

  // Authentication handlers
  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
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

  console.log("Selected Date:", formatDateForComparison(selectedDate));
  console.log("Week Range:", formatDateForComparison(weekBounds.startOfWeek), "to", formatDateForComparison(weekBounds.endOfWeek));
  console.log("Users Dates:", filteredUsers.map(u => formatDateForComparison(u.appointmentDate)));

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
    weekBounds
  };
  
  return (
    <MedContext.Provider value={value}>
      {props.children}
    </MedContext.Provider>
  );
};

export default MedContextProvider;