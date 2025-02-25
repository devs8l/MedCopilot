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
        <div className={`grid  gap-3 
            grid-cols-1
            md:grid-cols-[0.1fr_3fr_2fr]
            md:${isExpanded ? 'grid-cols-[0.8fr_3fr_2fr]' : 'grid-cols-[0.1fr_1fr_1fr]'} 
            transition-all duration-300 pb-10`}
        >
            {/* Sidebar */}
            <SideBar />

            {/* Middle Section */}
            <div className="drop-shadow-md bg-white rounded-2xl transition-all  duration-300 overflow-y-auto ">
                <Routes>
                    <Route path="/" element={<Patients />} />
                    <Route path="/user/:id" element={<UserData />} />
                </Routes>
            </div>

            {/* Right Section */}
            <Chat />
        </div>
    );
};

export default Home;
