import { createContext, useEffect, useState } from 'react';

export const MedContext = createContext();

const MedContextProvider = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [users, setUsers] = useState([
    { id: "MAS12345", name: "Andrea Smith", time: "12:00 PM", status: "Active", appointmentDate: "2025-02-23",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12346", name: "Zack Thompson", time: "1:00 PM", status: "First Time Patient", appointmentDate: "2025-02-24",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12347", name: "Lara Chen", time: "2:00 PM", status: "Returning", appointmentDate: "2025-02-23",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12348", name: "Michael Brown", time: "2:30 PM", status: "Active", appointmentDate: "2025-02-25",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12349", name: "Sarah Wilson", time: "3:00 PM", status: "Active", appointmentDate: "2025-02-23",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12350", name: "James Rodriguez", time: "3:30 PM", status: "First Time Patient", appointmentDate: "2025-02-24",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12351", name: "Emma Davis", time: "4:00 PM", status: "Active", appointmentDate: "2025-02-23",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12352", name: "David Miller", time: "4:30 PM", status: "Returning", appointmentDate: "2025-02-25",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12353", name: "Sophie Taylor", time: "5:00 PM", status: "Active", appointmentDate: "2025-02-24",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12354", name: "Robert Garcia", time: "5:30 PM", status: "First Time Patient", appointmentDate: "2025-02-23",profileImage:"https://images.unsplash.com/photo-1502685104226-ee32379fefbe" },
    { id: "MAS12355", name: "Lisa Anderson", time: "6:00 PM", status: "Active", appointmentDate: "2025-02-23",profileImage:"https://images.unsplash.com/photo-1502685104226-ee32379fefbe" },
    { id: "MAS12356", name: "Kevin", time: "6:30 PM", status: "Returning", appointmentDate: "2025-02-24",profileImage:"https://images.unsplash.com/photo-1502685104226-ee32379fefbe" },
    { id: "MAS12357", name: "Rachel White", time: "7:00 PM", status: "Active", appointmentDate: "2025-02-23",profileImage:"https://images.unsplash.com/photo-1502685104226-ee32379fefbe" },
    { id: "MAS12358", name: "Thomas Lee", time: "7:30 PM", status: "First Time Patient", appointmentDate: "2025-02-25",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
    { id: "MAS12359", name: "Patricia Clark", time: "8:00 PM", status: "Active", appointmentDate: "2025-02-23",profileImage:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" },
  ]);


  // Filter users based on selected date
  const formattedSelectedDate = selectedDate.toISOString().split("T")[0];

  // Filter users based on the selected date
  const filteredUsers = users.filter(user => user.appointmentDate === formattedSelectedDate);


  const value = {
    selectedDate,
    setSelectedDate,
    users,
    filteredUsers,
    setUsers
  };
  return (
    <MedContext.Provider value={value}>
      {props.children}
    </MedContext.Provider>
  )
}

export default MedContextProvider