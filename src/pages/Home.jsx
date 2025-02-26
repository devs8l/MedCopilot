import { useState } from "react";
import { Menu, ChevronLeft, BookOpenCheck, User } from "lucide-react";
import UserData from "../components/UserData";
import Patients from "../components/Patients";
import Calendar from "../components/Calendar";
import ChatInterface from "../components/ChatInterface";
import SideBar from "../components/SideBar";
import Hero from "../components/Hero";
import Chat from "../components/Chat";
import { Route, Routes } from 'react-router-dom'

const Home = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex h-full">
            {/* Main content area with sidebar and middle section that can resize */}
            <div className={`flex-grow grid grid-cols-[auto_1fr] gap-3 h-[80vh] transition-all duration-300`}>
                {/* Sidebar */}
                <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

                {/* Middle Section */}
                <div className="drop-shadow-md bg-white rounded-2xl transition-all duration-300 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Patients />} />
                        <Route path="/user/:id" element={<UserData />} />
                    </Routes>
                </div>
            </div>

            {/* Chat section with fixed width */}
            <div className="w-1/3 ml-3">
                <Chat />
            </div>
        </div>
    );
};

export default Home;