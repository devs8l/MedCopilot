import React, { useContext, useState } from "react";
import { MedContext } from "../context/MedContext";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Patients = () => {
    const { 
        filteredUsers, 
        searchQuery, 
        searchFilteredUsers, 
        setIsUserSelected, 
        filterBasis,
        selectedDate,
        weekBounds,
        setSelectedUser
    } = useContext(MedContext);
    
    const displayedUsers = searchQuery ? searchFilteredUsers : filteredUsers;

    // Function to group patients by day of week
    const groupPatientsByWeekday = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const groupedPatients = {};
        
        // Initialize all days with dates
        const { startOfWeek } = weekBounds;
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            const dayKey = days[i];
            const dateString = currentDate.toISOString().split('T')[0];
            groupedPatients[dayKey] = { 
                date: currentDate,
                dateString: dateString,
                patients: []
            };
        }
        
        // Group patients by weekday
        displayedUsers.forEach(user => {
            const date = new Date(user.appointmentDate);
            const dayName = days[date.getDay()];
            groupedPatients[dayName].patients.push(user);
        });
        
        return { groupedPatients, days };
    };

    // Function to group patients by date for monthly view
    const groupPatientsByDate = () => {
        const groupedPatients = {};
        
        displayedUsers.forEach(user => {
            const date = new Date(user.appointmentDate);
            const dateKey = date.getDate().toString();
            
            if (!groupedPatients[dateKey]) {
                groupedPatients[dateKey] = [];
            }
            
            groupedPatients[dateKey].push(user);
        });
        
        return groupedPatients;
    };

    const handleUserClick = (user) => {
        setSelectedUser(user); // Store the selected user in context
        setIsUserSelected(true);
    };

    // Render a single patient card
    const renderPatientCard = (user) => (
        <Link to={`/user/${user.id}`} key={user.id} onClick={() => handleUserClick(user)} className="block">
            <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4 p-6 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
                <span className="text-sm text-gray-500">{user.time}</span>
                <div className="grid grid-cols-[3rem_auto] items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center overflow-hidden justify-center">
                        <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">#{user.id}</p>
                    </div>
                </div>
                <ChevronDown size={20} />
            </div>
        </Link>
    );

    // Render daily view
    const renderDailyView = () => (
        <>
            <div className="sticky top-0 bg-[#f7f7f7] dark:bg-[#464444] font-semibold text-gray-700 rounded-xl px-5 py-5 z-10">
                <div className="grid grid-cols-[1fr_2fr_1fr]">
                    <span>Time</span>
                    <span>Patients</span>
                    <span></span>
                </div>
            </div>
            
            <div className="space-y-4 flex-grow overflow-y-auto overflow-hidden max-h-[65vh]">
                {displayedUsers.length > 0 ? (
                    displayedUsers.map(user => renderPatientCard(user))
                ) : (
                    <p className="text-center text-gray-500">No appointments found for this date.</p>
                )}
            </div>
        </>
    );

    // Render weekly view
    const renderWeeklyView = () => {
        const { groupedPatients, days } = groupPatientsByWeekday();
        const { startOfWeek, endOfWeek } = weekBounds;
        
        const formattedStartDate = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const formattedEndDate = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return (
            <>
                <div className="sticky top-0 bg-[#f7f7f7] dark:bg-[#464444] font-semibold  text-gray-700 rounded-xl px-5 py-5 z-10">
                    <h2 className="text-lg font-semibold mb-2">Week of {formattedStartDate} - {formattedEndDate}</h2>
                    <div className="grid grid-cols-7 gap-2">
                        {days.map(day => {
                            const dayData = groupedPatients[day];
                            const dayDate = new Date(dayData.date);
                            const dayNum = dayDate.getDate();
                            return (
                                <div key={day} className="text-center">
                                    <span>{day.substring(0, 3)} {dayNum}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="flex-grow overflow-y-auto overflow-hidden h-[60vh]">
                    <div className="grid grid-cols-7 gap-2">
                        {days.map(day => {
                            const dayData = groupedPatients[day];
                            const isToday = dayData.dateString === new Date().toISOString().split('T')[0];
                            
                            return (
                                <div 
                                    key={day} 
                                    className={`border rounded-lg p-2 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-[#2a2a2a]'} min-h-[200px] overflow-y-auto`}
                                >
                                    <h3 className="font-medium text-center border-b pb-2 mb-2">{day}</h3>
                                    {dayData.patients.length > 0 ? (
                                        <div className="space-y-3">
                                            {dayData.patients.map(user => (
                                                <Link to={`/user/${user.id}`} key={user.id} onClick={() => handleUserClick(user)} className="block">
                                                    <div className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            
                                                            <div>
                                                                <h4 className="font-medium text-sm">{user.name}</h4>
                                                                <p className="text-xs text-gray-500">{user.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 text-sm">No appointments</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    };

    // Render monthly view
    const renderMonthlyView = () => {
        const groupedPatients = groupPatientsByDate();
        const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
        const monthName = selectedDate.toLocaleString('default', { month: 'long' });
        const year = selectedDate.getFullYear();
        
        // Create an array of weeks (for grid layout)
        const weeks = [];
        let week = [];
        
        // Get the first day of the month
        const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            week.push(null);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            week.push(day.toString());
            
            if (week.length === 7 || day === daysInMonth) {
                // Fill remaining days of the last week
                while (week.length < 7) {
                    week.push(null);
                }
                
                weeks.push(week);
                week = [];
            }
        }
        
        return (
            <>
                <div className="sticky top-0 bg-[#f7f7f7] dark:bg-[#464444] font-semibold text-gray-700 rounded-xl px-5 py-5 z-10">
                    <h2 className="text-lg font-semibold mb-2">{monthName} {year}</h2>
                    <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center">
                                <span>{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="flex-grow overflow-y-auto overflow-hidden max-h-[65vh]">
                    {weeks.map((week, weekIndex) => (
                        <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-2 mb-2">
                            {week.map((day, dayIndex) => (
                                <div 
                                    key={`day-${weekIndex}-${dayIndex}`} 
                                    className={`border rounded-lg p-2 ${day ? 'bg-gray-50 dark:bg-[#2a2a2a]' : 'bg-gray-100 dark:bg-[#333333] opacity-50'} min-h-[100px] overflow-y-auto`}
                                >
                                    {day && (
                                        <>
                                            <h3 className="font-medium text-center border-b pb-1 mb-1">{day}</h3>
                                            {groupedPatients[day] && groupedPatients[day].length > 0 ? (
                                                <div className="space-y-2">
                                                    {groupedPatients[day].map(user => (
                                                        <Link to={`/user/${user.id}`} key={user.id} onClick={() => handleUserClick(user)} className="block">
                                                            <div className="p-1 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded text-xs">
                                                                <p className="font-medium truncate">{user.name}</p>
                                                                <p className="text-gray-500">{user.time}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-gray-500 text-xs">No appts</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </>
        );
    };

    // Render yearly view
    const renderYearlyView = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const year = selectedDate.getFullYear();
        
        // Group patients by month
        const groupedPatients = {};
        months.forEach((month, index) => {
            groupedPatients[index] = [];
        });
        
        displayedUsers.forEach(user => {
            const date = new Date(user.appointmentDate);
            const monthIndex = date.getMonth();
            groupedPatients[monthIndex].push(user);
        });
        
        return (
            <>
                <div className="sticky top-0 bg-[#f7f7f7] dark:bg-[#464444] font-semibold text-gray-700 rounded-xl px-5 py-5 z-10">
                    <h2 className="text-lg font-semibold mb-2">Yearly Calendar - {year}</h2>
                </div>
                
                <div className="flex-grow overflow-y-auto overflow-hidden max-h-[65vh]">
                    <div className="grid grid-cols-3 gap-4">
                        {months.map((month, index) => (
                            <div key={month} className="border rounded-lg p-3 bg-gray-50 dark:bg-[#2a2a2a]">
                                <h3 className="font-medium border-b pb-2 mb-2">{month}</h3>
                                {groupedPatients[index].length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">{groupedPatients[index].length} appointments</p>
                                        <div className="space-y-1 max-h-[150px] overflow-y-auto">
                                            {groupedPatients[index].slice(0, 5).map(user => (
                                                <Link to={`/user/${user.id}`} key={user.id} onClick={() => handleUserClick(user)} className="block">
                                                    <div className="p-1 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded text-xs">
                                                        <p className="font-medium truncate">{user.name}</p>
                                                        <p className="text-gray-500">{new Date(user.appointmentDate).getDate()} {month.substring(0, 3)}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                            {groupedPatients[index].length > 5 && (
                                                <p className="text-xs text-center text-gray-500">
                                                    + {groupedPatients[index].length - 5} more
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 text-sm">No appointments</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    };

    // Render the appropriate view based on the filter basis
    const renderView = () => {
        switch (filterBasis) {
            case 'week':
                return renderWeeklyView();
            case 'month':
                return renderMonthlyView();
            case 'year':
                return renderYearlyView();
            case 'day':
            default:
                return renderDailyView();
        }
    };

    return (
        <div className="mx-auto bg-white dark:bg-[#272626] px-1 py-1 pb-1 flex flex-col justify-between gap-3 rounded-xl overflow-hidden">
            {renderView()}
        </div>
    );
};

export default Patients;