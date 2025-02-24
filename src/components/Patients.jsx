import React, { useContext, useState } from "react";
import { MedContext } from "../context/MedContext";
import { Link } from "react-router-dom";  // ✅ Import Link
import { GripVertical, Plus } from "lucide-react";

const Patients = () => {
    const { filteredUsers,searchQuery, searchFilteredUsers } = useContext(MedContext);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const displayedUsers = searchQuery ? searchFilteredUsers : filteredUsers;

    // Pagination calculations
    const totalPages = Math.ceil(displayedUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const usersToShow = displayedUsers.slice(startIndex, endIndex);

    return (
        <div className="mx-auto bg-white p-6 h-[80vh] flex flex-col">
            {/* List of Filtered Patients */}
            <div className="space-y-4 flex-grow overflow-auto">
                {usersToShow.length > 0 ? (
                    usersToShow.map((user) => (
                        <Link to={`/user/${user.id}`} key={user.id} className="block">
                            <div className="grid grid-cols-[0.4fr_0.2fr_2fr_1fr] items-center gap-4 p-6 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
                                <span className="text-sm text-gray-500">{user.time}</span>
                                <GripVertical color="#0000004D"/> 
                                <div className="grid grid-cols-[3rem_auto] items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center overflow-hidden justify-center">
                                        <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-500">#{user.id}</p>
                                    </div>
                                </div>
                                <Plus/>
                            </div>
                        </Link>

                    ))
                ) : (
                    <p className="text-center text-gray-500">No appointments found for this date.</p>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-auto pt-4">
                    <button
                        className={`px-4 py-2 rounded-md mx-2 ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-100 rounded-md">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className={`px-4 py-2 rounded-md mx-2 ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Patients;
