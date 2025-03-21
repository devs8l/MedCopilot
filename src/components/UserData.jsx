import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";
import { Clock, AlertCircle, CheckCircle2, Loader, Info, Ellipsis, ChevronRight, ClipboardList, BookOpen, Pill, AlertTriangle, FileText, Sparkle, Play, Timer, ChartSpline, Calendar } from "lucide-react";
import Chart from "./Chart";


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
  const { userMessages, isloadingHistory, isSessionActive, elapsedTime, startSession, endSession, activeSessionUserId } = useContext(ChatContext);
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

      // Check if patient history exists in local storage
      const cachedHistory = localStorage.getItem(`patientHistory_${user._id}`);
      if (cachedHistory) {
        try {
          setPatientHistory(JSON.parse(cachedHistory));
        } catch (error) {
          console.error('Error parsing cached history:', error);
          setPatientHistory(null);
        }
      } else {
        setPatientHistory(null); // Reset patient history when a new patient is selected
      }
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

      const historyObj = {
        rawData: historyData,
        analysis: analysisData.content || 'No analysis available',
        timestamp: new Date().toISOString() // Add timestamp for cache invalidation if needed
      };

      // Save to state
      setPatientHistory(historyObj);

      // Save to local storage
      localStorage.setItem(`patientHistory_${userData._id}`, JSON.stringify(historyObj));

    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };


  //charts sec
  const [healthMetricsData, setHealthMetricsData] = useState(null);
  const [isLoadingHealthMetrics, setIsLoadingHealthMetrics] = useState(false);

  const fetchHealthMetrics = async () => {
    if (!userData) return;

    setIsLoadingHealthMetrics(true);
    try {
      const response = await fetch(
        `https://medicalchat-backend-mongodb.vercel.app/patients/${userData._id}/health-metrics`
      );
      if (!response.ok) throw new Error('Failed to fetch health metrics');
      const metricsData = await response.json();
      setHealthMetricsData(metricsData);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      setHealthMetricsData(null);
    } finally {
      setIsLoadingHealthMetrics(false);
    }
  };


  useEffect(() => {
    if (activeTab === 'Trends' && userData) {
      fetchHealthMetrics();
    }
  }, [activeTab, userData?._id]);



  // Load reports data when tab changes to 'reports'
  useEffect(() => {
    if (activeTab === 'summary' && userData && !patientHistory) {
      fetchPatientHistory();
    }
  }, [activeTab, userData, patientHistory]); // Added patientHistory dependency

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

  // Function to clear cached data - useful for debugging or forcing a refresh
  const clearCachedData = () => {
    if (userData) {
      localStorage.removeItem(`patientHistory_${userData._id}`);
      setPatientHistory(null);
      fetchPatientHistory();
    }
  };

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
            {analysisMessage && (
              <div className="bg-white rounded-lg p-4 drop-shadow-sm mb-4">
                <h4 className="font-medium text-blue-600 mb-2">AI Analysis</h4>
                <div className="text-sm whitespace-pre-wrap">
                  {analysisMessage.content}
                </div>
              </div>
            )}

            {patientHistory ? (
              <div className="rounded-lg px-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Summary from Past</h4>
                  <button
                    onClick={clearCachedData}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    Refresh
                  </button>
                </div>
                <div className="text-sm text-gray-500 whitespace-pre-wrap">
                  {patientHistory.analysis}
                </div>
                {patientHistory.timestamp && (
                  <p className="text-xs text-gray-400 mt-2">
                    Last updated: {new Date(patientHistory.timestamp).toLocaleString()}
                  </p>
                )}
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
            <h2 className="text-md">Today's Prerequisite</h2>
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
              <p>Everything's looking good! Her recent readings were consistently within the 120-135/75-85 range, her medication and activity logs are in order. I don't see any need for changes or adjustments at this time.</p>
              <ul className="list-disc list-inside mt-2">
                <li>Readings: 120-135/75-85 (good range).</li>
                <li>Meds/activity: OK.</li>
                <li>Model & alerts: Working fine.</li>
                <li>No changes needed. 😊</li>
              </ul>
            </div>
          </div>
        );
      case 'Trends':
        return (
          <div className="px-10">
            <div className="text-gray-500">
              {isLoadingHealthMetrics ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                  <p>Loading health metrics...</p>
                </div>
              ) : (
                <Chart rawData={healthMetricsData || []} />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-10">
        <div className="flex gap-5 text-xl font-bold px-6 py-5 items-center text-[#222836]">
          <h2 className="">Appointments</h2>
          <ChevronRight size={15} />
          <h2>{userData?.name}</h2>
        </div>
        <div className="flex items-center py-3 gap-4">
          <div className="flex items-center gap-1">
            <Calendar size={15} className="text-gray-500"/>
            <p className="text-sm text-gray-500">Today</p>
          </div>
          <p className="text-sm text-gray-500 ">{userData?.time}</p>
        </div>
      </div>
      <h2 className="">   </h2>
      <div>
        <div className="flex items-start mx-6 justify-between">
          <div className="flex items-start space-x-4">
            <img
              src={userData?.profileImage || "/api/placeholder/80/80"}
              className="w-13 h-13 rounded-full object-cover"
              alt={userData?.name}
            />
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold">Name:  {userData?.name}</h2>
                <div className="flex gap-1">
                  <h2 className="text-sm font-semibold">Patient ID: </h2>
                  <p className="text-sm text-gray-500">#{userData?._id?.slice(-6)}</p>
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
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-xs text-sm"
                >
                  End Session
                </button>
              </div>
            ) : (
              <button
                onClick={() => startSession(userData._id)}
                className="px-4 py-2 bg-[#1AE86C] flex gap-3 items-center justify-center text-white rounded-xs text-sm"
              >
                <Play size={13} /> Start Session
              </button>
            )}
          </div>


        </div>
      </div>
      <div className="p-4 flex flex-col gap-6 rounded-sm   bg-[#ffffff] dark:bg-[#00000099] mx-1 h-[calc(65vh-80px)] overflow-auto">

        {/* Profile Section */}


        {/* Action Buttons */}
        <div className="flex">
          <div className="flex flex-col mb-2 mr-2  group gap-4 transition-all duration-300 w-11 group-hover:w-48 hover:w-48 ">
            <button
              className={`flex items-center cursor-pointer px-3 py-2 gap-2 rounded-sm transition-all duration-200 group/button ${activeTab === 'summary'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'dark:text-white bg-[#ffffff77] text-[#7A7E86]'
                }`}
              onClick={() => setActiveTab('summary')}
            >
              <div className="flex-shrink-0">
                <Sparkle className={`transition-all duration-200 ${activeTab === 'summary'
                  ? 'w-5 h-5 text-blue-600 '
                  : 'w-4 h-4 text-gray-400 group-hover/button:w-5 group-hover/button:h-5 '
                  }`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Summary</span>
            </button>

            <button
              className={`flex items-center cursor-pointer px-3 py-2 gap-2 rounded-sm transition-all duration-200 group/button ${activeTab === 'prerequisites'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'dark:text-white bg-[#ffffff77] text-[#7A7E86]'
                }`}
              onClick={() => setActiveTab('prerequisites')}
            >
              <div className="flex-shrink-0">
                <BookOpen className={`transition-all duration-200 ${activeTab === 'prerequisites'
                  ? 'w-5 h-5 text-blue-600'
                  : 'w-4 h-4 text-gray-400 group-hover/button:w-5 group-hover/button:h-5'
                  }`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Today's Prerequisite</span>
            </button>

            <button
              className={`flex items-center cursor-pointer px-3 py-2 gap-2 rounded-sm transition-all duration-200 group/button ${activeTab === 'chatHistory'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'dark:text-white bg-[#ffffff77] text-[#7A7E86]'
                }`}
              onClick={() => setActiveTab('chatHistory')}
            >
              <div className="flex-shrink-0">
                <Clock className={`transition-all duration-200 ${activeTab === 'chatHistory'
                  ? 'w-5 h-5 text-blue-600'
                  : 'w-4 h-4 text-gray-400 group-hover/button:w-5 group-hover/button:h-5 '
                  }`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Chat History</span>
            </button>

            <button
              className={`flex items-center px-3 py-2 cursor-pointer gap-2 rounded-sm transition-all duration-200 group/button ${activeTab === 'Trends'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'dark:text-white bg-[#ffffff77] text-[#7A7E86]'
                }`}
              onClick={() => setActiveTab('Trends')}
            >
              <div className="flex-shrink-0">
                <ChartSpline className={`transition-all duration-200 ${activeTab === 'Trends'
                  ? 'w-5 h-5 text-blue-600'
                  : 'w-4 h-4 text-gray-400 group-hover/button:w-5 group-hover/button:h-5'
                  }`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Trends</span>
            </button>
            <button
              className={`flex items-center px-3 cursor-pointer py-2 gap-2 rounded-sm transition-all duration-200 group/button ${activeTab === 'reports'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'dark:text-white bg-[#ffffff77] text-[#7A7E86] '
                }`}
              onClick={() => setActiveTab('reports')}
            >
              <div className="flex-shrink-0">
                <ClipboardList className={`transition-all duration-200 ${activeTab === 'reports'
                  ? 'w-5 h-5 text-blue-600 '
                  : 'w-4 h-4 text-gray-400 group-hover/button:w-5 group-hover/button:h-5'
                  }`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Past Reports</span>
            </button>

            <button
              className={`flex items-center px-3 py-2 cursor-pointer gap-2 rounded-sm transition-all duration-200 group/button ${activeTab === 'prescription'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'dark:text-white bg-[#ffffff77] text-[#7A7E86]'
                }`}
              onClick={() => setActiveTab('prescription')}
            >
              <div className="flex-shrink-0">
                <Pill className={`transition-all duration-200 ${activeTab === 'prescription'
                  ? 'w-5 h-5 text-blue-600'
                  : 'w-4 h-4 text-gray-400 group-hover/button:w-5 group-hover/button:h-5'
                  }`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Prescription</span>
            </button>

            <button
              className={`flex items-center px-3 py-2 cursor-pointer gap-2 rounded-sm transition-all duration-200 group/button ${activeTab === 'allergies'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'dark:text-white bg-[#ffffff77] text-[#7A7E86] '
                }`}
              onClick={() => setActiveTab('allergies')}
            >
              <div className="flex-shrink-0">
                <AlertTriangle className={`transition-all duration-200 ${activeTab === 'allergies'
                  ? 'w-5 h-5 text-blue-600'
                  : 'w-4 h-4 text-gray-400 group-hover/button:w-5 group-hover/button:h-5'
                  }`} />
              </div>
              <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">Allergies</span>
            </button>


          </div>

          {/* Tab Content */}
          <div className="flex-1 p-2">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;