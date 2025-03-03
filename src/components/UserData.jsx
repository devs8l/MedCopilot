import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { MedContext } from "../context/MedContext";
import { Clock, AlertCircle, CheckCircle2, AlertTriangle, Sparkles, Info } from "lucide-react";

const UserData = () => {
  const { id } = useParams();
  const { filteredUsers } = useContext(MedContext);
  
  const user = filteredUsers.find((u) => u.id === id);

  if (!user) {
    return <h2 className="text-center text-gray-500">User Not Found</h2>;
  }

  const medicalEvents = [
    {
      type: "Missed Routine Checkup",
      description: "Recent report has Thyroid symptoms",
      date: "16th Feb, Sunday",
      status: "missed",
    },
    {
      type: "Hypertension Test Report",
      description: "(Scope of Details)",
      date: "16th Feb, Sunday",
      status: "completed",
    },
    {
      type: "Non-routine Checkup",
      description: "Random chest pain",
      date: "10th Feb, Friday",
      status: "pending",
    },
    {
      type: "Routine Checkup",
      description: "Random chest pain",
      date: "1st Jan, Sunday",
      status: "completed",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "missed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "pending":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white flex flex-col gap-6 rounded-lg  mx-auto h-full overflow-auto">
      {/* Profile Section */}
      <div >
        <div className="flex items-start justify-between ">
          <div className="flex items-start space-x-4">
            <img
              src={user?.profileImage || "/api/placeholder/80/80"}
              className="w-16 h-16 rounded-full object-cover"
              alt={user?.name}
            />
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-sm text-gray-500">#{user?.id}</p>

              </div>
              {/* Medical Details Grid */}
              <div className=" grid grid-cols-4 gap-3 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">32</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sex</p>
                  <p className="font-medium">Female</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">BP</p>
                  <p className="font-medium">High</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Diabetic?</p>
                  <p className="font-medium">Type A</p>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-6">
        <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg">
          <Sparkles  className="w-4 h-4" />
          <span className="text-sm">Summarize Patient Profile</span>
        </button>
        <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg">
          <Info  className="w-4 h-4" />
          <span>Highlight Key Events</span>
        </button>
      </div>

      {/* Medical Events List */}
      <div className="space-y-4">
        {medicalEvents.map((event, index) => (
          <div
            key={index}
            className="flex items-center justify-between  pb-4"
          >
            <div className="flex items-start space-x-3">
              {getStatusIcon(event.status)}
              <div>
                <h3 className="font-medium">{event.type}</h3>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">{event.date}</span>
              <button className="p-1">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserData;  