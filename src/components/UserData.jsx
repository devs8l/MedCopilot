import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";
import { Clock, AlertCircle, CheckCircle2, Loader, Info, Ellipsis, ChevronRight, ClipboardList, BookOpen, Pill, AlertTriangle, FileText, Sparkle, Play, Timer } from "lucide-react";


const Stopwatch = ({ elapsedTime }) => {
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center ml-4 border border-gray-500 rounded-xl px-3 py-1 ">
      <Timer className="w-4 h-4 mr-2 text-gray-500" />
      <span className="text-sm text-gray-500">{formatTime(elapsedTime)}</span>
    </div>
  );
};

const UserData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, filteredUsers, setIsUserSelected } = useContext(MedContext);
  const { userMessages, isloadingHistory, isSessionActive, elapsedTime, startSession, endSession ,activeSessionUserId} = useContext(ChatContext);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [patientHistory, setPatientHistory] = useState(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);

  // Set isUserSelected to true when this component mounts
  useEffect(() => {
    setIsUserSelected(true);

    // Cleanup function to set isUserSelected to false when unmounting
    return () => {
      setIsUserSelected(false);
    };
  }, [setIsUserSelected]);

  // Find user data
  useEffect(() => {
    let user = filteredUsers.find((u) => u._id === id);
    if (!user) {
      user = users.find((u) => u._id === id);
    }
    if (user) {
      setUserData(user);
    }
  }, [id, filteredUsers, users]);

  // Function to fetch patient history for reports tab
  const fetchPatientHistory = async () => {
    if (!userData) return;

    setIsLoadingReports(true);
    try {
      const response = await fetch(
        `https://medicalchat-backend-mongodb.vercel.app/patients/${userData._id}/history`
      );
      if (!response.ok) throw new Error('Failed to fetch history');
      const historyData = await response.json();
      const analysisResult = await fetch(
        `https://medicalchat-tau.vercel.app/medical_analysis/Provide a comprehensive overview of this patient's medical history`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(historyData),
        }
      );

      if (!analysisResult.ok) throw new Error('Failed to analyze history');
      const analysisData = await analysisResult.json();

      setPatientHistory({
        rawData: historyData,
        analysis: analysisData.content || 'No analysis available'
      });

    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  // Load reports data when tab changes to 'reports'
  useEffect(() => {
    if (activeTab === 'reports' && userData && !patientHistory) {
      fetchPatientHistory();
    }
  }, [activeTab, userData]);

  // Format and store chat history data when user messages change
  useEffect(() => {
    if (userData && userMessages[userData._id]) {
      const messages = userMessages[userData._id].filter(msg => !msg.isInitial);
      const chatEvents = [];

      let sessionDate = new Date();
      let currentSessionMessages = [];
      let lastSessionDate = null;

      for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === 'user') {
          const storedDate = localStorage.getItem(`sessionStarted_${userData._id}_${i}`);
          if (storedDate) {
            sessionDate = new Date(storedDate);
          } else {
            sessionDate = new Date();
            sessionDate.setDate(sessionDate.getDate() - (messages.length - i) / 2);
            localStorage.setItem(`sessionStarted_${userData._id}_${i}`, sessionDate.toISOString());
          }

          if (!lastSessionDate || sessionDate.toDateString() !== lastSessionDate.toDateString()) {
            lastSessionDate = sessionDate;
            currentSessionMessages = [messages[i].content];

            chatEvents.push({
              type: "Chat Session",
              description: messages[i].content.length > 50
                ? messages[i].content.substring(0, 50) + "..."
                : messages[i].content,
              content: [messages[i].content],
              date: sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
              timestamp: sessionDate.toISOString(),
              status: "completed"
            });
          } else {
            currentSessionMessages.push(messages[i].content);

            if (chatEvents.length > 0) {
              const lastEvent = chatEvents[chatEvents.length - 1];
              lastEvent.content.push(messages[i].content);
              lastEvent.description = messages[i].content.length > 50
                ? messages[i].content.substring(0, 50) + "..."
                : messages[i].content;
            }
          }
        }
      }

      chatEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setSessionHistory(chatEvents);
    }
  }, [userData, userMessages]);

  if (!userData) {
    return <h2 className="text-center text-gray-500 flex w-full h-full items-center justify-center"><Ellipsis /></h2>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "missed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'chatHistory':
        if (sessionHistory.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <Info className="w-8 h-8 mb-2" />
              <p>No chat history available for this patient</p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {sessionHistory.map((session, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 drop-shadow-sm flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm ">{session.date}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {session.content.length} message{session.content.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mt-1">
                    {getStatusIcon(session.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'summary':
        if (isLoadingReports) {
          return (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" />
              <p>Loading patient reports...</p>
            </div>
          );
        }

        const analysisMessage = userData ?
          userMessages[userData._id]?.find(msg =>
            msg.type === 'bot' &&
            !msg.isInitial &&
            msg.content.includes('history')
          ) : null;

        return (
          <div className="space-y-4">
            {/* <h3 className="font-semibold text-lg">Patient Reports</h3> */}

            {analysisMessage && (
              <div className="bg-white rounded-lg p-4 drop-shadow-sm mb-4">
                <h4 className="font-medium text-blue-600 mb-2">AI Analysis</h4>
                <div className="text-sm whitespace-pre-wrap">
                  {analysisMessage.content}
                </div>
              </div>
            )}

            {patientHistory ? (
              <div className=" rounded-lg px-4">
                <h4 className="font-medium  mb-2">Summary from Past</h4>
                <div className="text-sm text-gray-500 whitespace-pre-wrap">
                  {patientHistory.analysis}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>Unable to load patient reports</p>
                <button
                  onClick={fetchPatientHistory}
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md text-sm"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        );

      case 'prerequisites':
        return (
          <div className="px-4">
            <h2 className="text-md">Today’s Prerequisite</h2>
            <p className="text-gray-500">Past Reports</p>
          </div>
        );

      case 'prescription':
        return (
          <div className="px-4">
            <h2 className="text-md">Prescription</h2>
            <p className="text-gray-500">Prescription details will be displayed here.</p>
          </div>
        );

      case 'allergies':
        return (
          <div className="px-4">
            <h2 className="text-md">Allergies</h2>
            {userData?.allergies && userData.allergies.length > 0 ? (
              <ul className="list-disc text-gray-500 list-inside">
                {userData.allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            ) : (
              <p>No allergies recorded.</p>
            )}
          </div>
        );

      case 'reports':
        return (
          <div className="px-4">
            <h2 className="text-md ">Past reports</h2>
            <div className="text-gray-500">
              <p>Summary from last visit, 5th March (Wednesday)</p>
              <p>Everything’s looking good! Her recent readings were consistently within the 120-135/75-85 range, her medication and activity logs are in order. I don’t see any need for changes or adjustments at this time.</p>
              <ul className="list-disc list-inside mt-2">
                <li>Readings: 120-135/75-85 (good range).</li>
                <li>Meds/activity: OK.</li>
                <li>Model & alerts: Working fine.</li>
                <li>No changes needed. 😊</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 text-sm px-6 items-center text-[#222836]">
        <h2 className="">Appointments</h2>
        <ChevronRight size={15} />
        <h2>{userData?.name}</h2>
      </div>
      <h2 className="">   </h2>
      <div className="p-6 flex flex-col gap-6 rounded-lg bg-[#ffffffc8] dark:bg-[#00000099] mx-4 h-[calc(70vh-80px)] overflow-auto">

        {/* Profile Section */}
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <img
                src={userData?.profileImage || "/api/placeholder/80/80"}
                className="w-16 h-16 rounded-full object-cover"
                alt={userData?.name}
              />
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold">{userData?.name}</h2>
                  <div className="grid grid-cols-[2fr_1fr] gap-4">
                    <p className="text-sm text-gray-500">#{userData?._id?.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{userData?.time}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {isSessionActive && activeSessionUserId === userData._id ? (
                <div className="flex items-center gap-4">
                  <Stopwatch elapsedTime={elapsedTime} />
                  <button
                    onClick={endSession}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm"
                  >
                    End Session
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startSession(userData._id)}
                  className="px-4 py-2 bg-blue-500 flex gap-1 items-center justify-center text-white rounded-md text-sm"
                >
                  <Play size={15} /> Start Session
                </button>
              )}
            </div>


          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex">
          <div className="flex flex-col mb-2 mr-2 group gap-4 transition-all duration-300 w-11 group-hover:w-48 hover:w-48 overflow-hidden">
            <button
              className={`flex items-center cursor-pointer px-3 py-2 gap-2 rounded-sm transition-all duration-200 ${activeTab === 'summary'
                ? 'bg-white  text-blue-600'
                : 'dark:text-white bg-[#ffffffc2]'
                }`}
              onClick={() => setActiveTab('summary')}
            >
              <div className="flex-shrink-0">
                <Sparkle className={`transition-all duration-200 ${activeTab === 'summary' ? 'w-5 h-5 text-blue-600' : 'w-4 h-4'}`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Summary</span>
            </button>

            <button
              className={`flex items-center cursor-pointer px-3 py-2 gap-2 rounded-sm transition-all duration-200 ${activeTab === 'prerequisites'
                ? 'bg-white  text-blue-600'
                : 'dark:text-white bg-[#ffffffc2]'
                }`}
              onClick={() => setActiveTab('prerequisites')}
            >
              <div className="flex-shrink-0">
                <BookOpen className={`transition-all duration-200 ${activeTab === 'prerequisites' ? 'w-5 h-5 text-blue-600' : 'w-4 h-4'}`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Today's Prerequisite</span>
            </button>

            <button
              className={`flex items-center cursor-pointer px-3 py-2 gap-2 rounded-sm transition-all duration-200 ${activeTab === 'chatHistory'
                ? 'bg-white  text-blue-600'
                : 'dark:text-white bg-[#ffffffc2]'
                }`}
              onClick={() => setActiveTab('chatHistory')}
            >
              <div className="flex-shrink-0">
                <Clock className={`transition-all duration-200 ${activeTab === 'chatHistory' ? 'w-5 h-5 text-blue-600' : 'w-4 h-4'}`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Chat History</span>
            </button>

            <button
              className={`flex items-center px-3 cursor-pointer py-2 gap-2 rounded-sm transition-all duration-200 ${activeTab === 'reports'
                ? 'bg-white  text-blue-600'
                : 'dark:text-white bg-[#ffffffc2]'
                }`}
              onClick={() => setActiveTab('reports')}
            >
              <div className="flex-shrink-0">
                <ClipboardList className={`transition-all duration-200 ${activeTab === 'reports' ? 'w-5 h-5 text-blue-600' : 'w-4 h-4'}`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Past Reports</span>
            </button>

            <button
              className={`flex items-center px-3 py-2 cursor-pointer gap-2 rounded-sm transition-all duration-200 ${activeTab === 'prescription'
                ? 'bg-white  text-blue-600'
                : 'dark:text-white bg-[#ffffffc2]'
                }`}
              onClick={() => setActiveTab('prescription')}
            >
              <div className="flex-shrink-0">
                <Pill className={`transition-all duration-200 ${activeTab === 'prescription' ? 'w-5 h-5 text-blue-600' : 'w-4 h-4'}`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Prescription</span>
            </button>

            <button
              className={`flex items-center px-3 py-2 cursor-pointer gap-2 rounded-sm transition-all duration-200 ${activeTab === 'allergies'
                ? 'bg-white  text-blue-600'
                : 'dark:text-white bg-[#ffffffc2]'
                }`}
              onClick={() => setActiveTab('allergies')}
            >
              <div className="flex-shrink-0">
                <AlertTriangle className={`transition-all duration-200 ${activeTab === 'allergies' ? 'w-5 h-5 text-blue-600' : 'w-4 h-4'}`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Allergies</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;