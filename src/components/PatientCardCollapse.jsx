import { Heart, Droplet, Activity } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { MedContext } from '../context/MedContext';


const PatientCardCollapse = ({ userData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { setIsContentExpanded } = useContext(MedContext);

    return (
        <div className=" rounded-lg  h-full  flex flex-col  transition-all duration-300 ease-in-out">
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Appointments</h2>
                    <button
                        onClick={() => setIsContentExpanded(true)}
                        className="text-gray-500 p-2 rounded-full hover:text-gray-900 animate-fadeInLeft"
                    >
                        <img src="/notes.svg" className='w-5 h-5' alt="" />
                    </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">Today, 10:00 - 11:00</p>
            </div>
            <div className='bg-[#ffffffc2] rounded-lg flex-grow'>
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col  mb-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                            <img src={userData.profileImage} alt="Patient" className="h-full w-full object-cover" />
                        </div>
                        <div className="">
                            <p className="font-medium">Name: {userData.name}</p>
                            <p className="text-sm text-gray-600">Patient ID: #{userData?._id?.slice(-6)}</p>
                            <p className="text-sm text-gray-600">MRN: TEMP12345</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Sex: {userData.gender}</p>
                    <p className="text-sm text-gray-600 mb-1">Weight: 64kg</p>
                    <p className="text-sm text-gray-600">Age: 32</p>
                </div>

                <div className="p-4">
                    <div className="flex flex-wrap flex-col gap-2">
                        <button className="flex gap-2 text-xs sm:text-sm border border-gray-500 text-gray-500  items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                            <img src="/bp.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">120/80 mmHg</span>
                        </button>
                        <button className="flex gap-2 text-xs sm:text-sm border border-gray-500 text-gray-500  items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                            <img src="/glucose.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">95 mg/dL</span>
                        </button>
                        <button className="flex gap-2 text-xs sm:text-sm border border-gray-500 text-gray-500  items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                            <img src="/o2.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">98%</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default PatientCardCollapse