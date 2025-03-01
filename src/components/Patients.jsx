import React, { useContext, useState } from "react";
import { MedContext } from "../context/MedContext";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, GripVertical, Plus } from "lucide-react";

const Patients = () => {
    const { filteredUsers, searchQuery, searchFilteredUsers, isUserSelected, setIsUserSelected } = useContext(MedContext);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const displayedUsers = searchQuery ? searchFilteredUsers : filteredUsers;

    // Pagination calculations
    const totalPages = Math.ceil(displayedUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const usersToShow = displayedUsers.slice(startIndex, endIndex);

    return (
        <div className="mx-auto bg-white dark:bg-[#272626] px-1 py-1 pb-4  flex flex-col justify-between gap-3 rounded-xl ">
            <div>
                <div className="grid grid-cols-[1fr_2fr_1fr]  px-5 py-5  bg-[#f7f7f7] dark:bg-[#464444] font-semibold text-gray-700 rounded-xl ">
                    <span>Time</span>
                    <span>Patients</span>
                </div>
                {/* List of Filtered Patients */}
                <div className="space-y-4 flex-grow overflow-auto">
                    {usersToShow.length > 0 ? (
                        usersToShow.map((user) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center   pt-4">
                    <button
                        className={`px-3 py-1 rounded-md mx-2 ${currentPage === 1 ? "opacity-15 cursor-not-allowed" : " hover:scale-[1.1]"
                            }`}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <ChevronLeft />
                    </button>

                    <button
                        className={`px-3 py-1 rounded-md mx-2 ${currentPage === totalPages ? "opacity-15 cursor-not-allowed" : "  hover:scale-[1.1]"
                            }`}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Patients;
