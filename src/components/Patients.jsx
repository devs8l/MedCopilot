import { useContext } from "react";
import { MedContext } from "../context/MedContext";

// components/Patients.jsx
const Patients = () => {
    const { setUsers, users } = useContext(MedContext);

    // Sort users alphabetically by name
    const sortedUsers = [...users].sort((a, b) => 
        a.name.localeCompare(b.name)
    );

    return (
        <div className="p-1">
            <h3 className="mx-4 font-medium mb-4">Patient List</h3>
            <div className="space-y-4 h-[50vh] overflow-auto">
                {
                    sortedUsers.map((user, index) => (
                        <div key={index} className="p-4  dark:bg-gray-800 rounded-lg shadow flex items-center space-x-4 mx-4">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <img src={user.profileImage} alt="Patient avatar" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user._id}</p>
                            </div>
                        </div>
                    ))
                }

                {/* More patient cards would go here */}
            </div>
        </div>
    );
};

export default Patients;