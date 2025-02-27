import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Chat from "../components/Chat";

const Home = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex h-full">
            {/* Sidebar and main content */}
            <div className="flex-grow grid grid-cols-[auto_1fr] gap-3 h-[80vh] transition-all duration-300">
                {/* Sidebar */}
                <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

                {/* Middle Section */}
                <div className="drop-shadow-md bg-white rounded-2xl transition-all duration-300 overflow-y-auto p-4">
                    <Outlet /> {/* This will render Patients or UserData based on the route */}
                </div>
            </div>

            {/* Chat Section */}
            <div className="w-1/3 ml-3">
                <Chat />
            </div>
        </div>
    );
};

export default Home;
