import { createContext, useEffect, useState } from 'react';

export const MedContext = createContext();

const MedContextProvider = (props) => {
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [filterBasis, setFilterBasis] = useState("day");
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

  


  // Filter users based on selected date
  const formattedSelectedDate = selectedDate.toISOString().split("T")[0];

  // Filter users based on the selected date
  const searchFilteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If there's a search query, ignore date filtering and return search results
  const filteredUsers = searchQuery
    ? users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : users.filter(user => {
      const userDate = new Date(user.appointmentDate);
      const selectedDateObj = new Date(selectedDate);

      if (filterBasis === "day") {
        return userDate.toISOString().split("T")[0] === formattedSelectedDate;
      } else if (filterBasis === "week") {
        const startOfWeek = new Date(selectedDateObj);
        startOfWeek.setDate(selectedDateObj.getDate() - selectedDateObj.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return userDate >= startOfWeek && userDate <= endOfWeek;
      } else if (filterBasis === "month") {
        return (
          userDate.getFullYear() === selectedDateObj.getFullYear() &&
          userDate.getMonth() === selectedDateObj.getMonth()
        );
      } else if (filterBasis === "year") {
        return userDate.getFullYear() === selectedDateObj.getFullYear();
      }

      return false;
    });

    console.log("Selected Date:", selectedDate);
  console.log("Users Dates:", filteredUsers.map(u => u.appointmentDate));



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
    searchFilteredUsers
  };
  return (
    <MedContext.Provider value={value}>
      {props.children}
    </MedContext.Provider>
  )
}

export default MedContextProvider