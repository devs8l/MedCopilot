import React, { useContext, useState } from "react";
import { MedContext } from "../context/MedContext";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Patients = () => {
    const { filteredUsers, searchQuery, searchFilteredUsers, setIsUserSelected } = useContext(MedContext);
    const displayedUsers = searchQuery ? searchFilteredUsers : filteredUsers;

    return (
        <div className="mx-auto bg-white dark:bg-[#272626] px-1 py-1 pb-4 flex flex-col justify-between gap-3 rounded-xl overflow-hidden">
            {/* Fixed Header */}
            <div className="sticky top-0 bg-[#f7f7f7] dark:bg-[#464444] font-semibold text-gray-700 rounded-xl px-5 py-5 z-10 ">
                <div className="grid grid-cols-[1fr_2fr_1fr]">
                    <span>Time</span>
                    <span>Patients</span>
                </div>
            </div>
            
            {/* List of Filtered Patients */}
            <div className="space-y-4 flex-grow overflow-y-auto overflow-hidden  max-h-[65vh]">
                {displayedUsers.length > 0 ? (
                    displayedUsers.map((user) => (
                        <Link to={`/user/${user.id}`} key={user.id} onClick={() => setIsUserSelected(true)} className="block">
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
                    ))
                ) : (
                    <p className="text-center text-gray-500">No appointments found for this date.</p>
                )}
            </div>
        </div>
    );
};

export default Patients;