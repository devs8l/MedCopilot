import { useState } from "react";
import { Menu, ChevronLeft, BookOpenCheck,User } from "lucide-react";
import UserData from "../components/UserData";
import Patients from "../components/Patients";
import Calendar from "../components/Calendar";
import ChatInterface from "../components/ChatInterface";


const Home = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`grid mt-5 ${isExpanded ? 'grid-cols-[0.8fr_3fr_2fr]' : 'grid-cols-[0.1fr_1fr_1fr]'} transition-all duration-300 gap-3 min-h-[70vh]`}>
            {/* Sidebar */}
            <div className={`bg-primary flex flex-col gap-3 `}>
                <div className="flex flex-col flex-1 items-center justify-between bg-white rounded-2xl drop-shadow-md">
                    <button
                        className={`px-4 py-2 mt-3 rounded-md ${isExpanded ? 'self-start' : 'self-center'}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <ChevronLeft /> : <Menu />}
                    </button>
                    <div className={`transition-all max-h-[300px] duration-300 overflow-hidden ${isExpanded ? 'scale-x-100' : 'scale-x-0 max-w-0 '}`}>
                        <Calendar />
                    </div>

                    <div className={`${isExpanded ? 'flex' : 'hidden'} flex flex-col items-center justify-between w-full px-4 gap-2`}>
                        <button className="w-full bg-white text-sm px-8 py-3 mb-2 rounded-md border-1 border-gray-600">
                            Create Event
                        </button>
                        <button className="w-full bg-action-btn text-white text-sm px-8 py-3 mb-3 rounded-md ">
                            + Add Appointment
                        </button>
                    </div>
                </div>
                <div className={`flex flex-col transition-all ease-in duration-300  items-center justify-between bg-white rounded-2xl drop-shadow-md w-full px-4`}>
                    <button className="flex items-center gap-3 text-sm px-8 py-5 rounded-md w-full mt-1 text-center hover:bg-gray-50">
                        <BookOpenCheck /><span className={`${isExpanded ? 'block' : 'hidden'} transition-all duration-300 ease-in`}>Make an Appointment</span>
                    </button>
                    <button className=" flex items-center gap-3 text-sm px-8 py-5 mb-2 rounded-md w-full hover:bg-gray-50">
                        <User /> <span className={`${isExpanded ? 'block' : 'hidden'} transition-all ease-in `}>My Patients</span>
                    </button>
                </div>
            </div>

            {/* Middle Section (Empty for now) */}
            <div className="drop-shadow-md bg-white rounded-2xl">
                {location.pathname === "/user" ? <UserData /> : <Patients />}
            </div>

            {/* Right Section (Empty for now) */}
            <div className="drop-shadow-md bg-white rounded-2xl overflow-hidden">
                <ChatInterface/>
            </div>
        </div>
    );
};

export default Home;
