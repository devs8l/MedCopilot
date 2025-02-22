import { createContext, useEffect, useState } from 'react';

export const MedContext = createContext();

const MedContextProvider = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([
        { id: 1, name: "Andrea S", date: "2025-02-19", time: "12:00 PM" },
        { id: 2, name: "Zack D", date: "2025-02-19", time: "01:00 PM" },
        { id: 3, name: "Lana C", date: "2025-02-20", time: "03:00 PM" },
        { id: 4, name: "Amelia D", date: "2025-02-21", time: "05:00 PM" },
      ]);
    
      // Function to filter appointments based on selected date
      const filteredAppointments = appointments.filter(
        (appt) => appt.date === selectedDate.toISOString().split("T")[0]
      );
    
      const value = {
        selectedDate,
        setSelectedDate,
        appointments,
        setAppointments,
        filteredAppointments,
      };
    return (
        <MedContext.Provider value={value}>
            {props.children}
        </MedContext.Provider>
    )
}

export default MedContextProvider