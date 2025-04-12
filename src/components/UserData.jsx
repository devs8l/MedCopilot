import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";
import { Clock, AlertCircle, CheckCircle2, Loader, Info, Ellipsis, ChevronRight, ClipboardList, BookOpen, Pill, AlertTriangle, FileText, Sparkle, Play, Timer, ChartSpline, Calendar, Ear } from "lucide-react";
import Chart from "./Chart";

// Add these new components (you can customize them as needed)
const Transcript = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Patient Transcript</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-gray-700">This is where the full conversation transcript would be displayed.</p>
        <p className="text-gray-500 mt-2">The transcript includes all messages exchanged between the doctor and patient.</p>
      </div>
    </div>
  );
};

const Actionable = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Actionable Items</h2>
      <div className="space-y-3">
        <div className="bg-white p-3 rounded-lg shadow-sm flex items-start">
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 mr-3" />
          <div>
            <h3 className="font-medium">Follow-up appointment</h3>
            <p className="text-sm text-gray-600">Schedule for next week to monitor progress</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm flex items-start">
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 mr-3" />
          <div>
            <h3 className="font-medium">Lab tests</h3>
            <p className="text-sm text-gray-600">Complete blood work before next visit</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm flex items-start">
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 mr-3" />
          <div>
            <h3 className="font-medium">Medication adjustment</h3>
            <p className="text-sm text-gray-600">Reduce dosage after 3 days if symptoms improve</p>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [activeView, setActiveView] = useState("synopsis"); // New state for the three buttons

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
      // Fetch raw patient history data
      const response = await fetch(
        `https://medicalchat-backend-mongodb.vercel.app/patients/${userData._id}/history`
      );
      if (!response.ok) throw new Error('Failed to fetch history');
      const historyData = await response.json();

      // Request full medical analysis from the API
      const analysisResult = await fetch(
        `https://medicalchat-tau.vercel.app/full_medical_analysis/Give me the patient full medical analysis`,
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

      // Create the history object with raw data and formatted analysis
      const historyObj = {
        rawData: historyData,
        analysis: analysisData,
        timestamp: new Date().toISOString(), // Add timestamp for cache invalidation
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
  }, [activeTab, userData, patientHistory]);

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
    const { details = [], summary = "No summary available", recommendations = [] } = patientHistory?.analysis || {};
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
                  {summary}
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
        const medications = details.find((category) => category.category === "Medications")?.findings || [];
        return (
          <div className="px-4">
            <h2 className="text-md">Prescription</h2>
            {medications.length > 0 ? (
              <ul className="list-disc text-gray-500 list-inside">
                {medications.map((medication, index) => (
                  <li key={index}>{medication}</li>
                ))}
              </ul>
            ) : (
              <p>No medications prescribed.</p>
            )}
          </div>
        );

      case 'allergies':
        const allergies = details.find((category) => category.category === "Allergies")?.findings || [];
        return (
          <div className="px-4">
            <h2 className="text-md">Allergies</h2>
            {allergies.length > 0 ? (
              <ul className="list-disc text-gray-500 list-inside">
                {allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            ) : (
              <p>No allergies recorded.</p>
            )}
          </div>
        );

      case 'reports':
        const pastReports = details.filter(
          (category) =>
            category.category !== "Medications" &&
            category.category !== "Allergies" &&
            category.category !== "Miscellaneous"
        );
        return (
          <div className="px-4">
            <h2 className="text-md">Past Reports</h2>
            {pastReports.map((report, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-medium">{report.category}</h3>
                <ul className="list-disc text-gray-500 list-inside">
                  {report.findings.map((finding, idx) => (
                    <li key={idx}>{finding}</li>
                  ))}
                </ul>
              </div>
            ))}
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

  // Render the main content based on active view (synopsis, transcript, actionable)
  const renderMainContent = () => {
    switch (activeView) {
      case 'synopsis':
        return (
          <div className="flex ">
            <div className="flex flex-col  py-4 mb-2 mr-2 group gap-4 transition-all duration-300 w-11 group-hover:w-48 hover:w-48">
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
            <div className="flex-1 p-4 border-l border-gray-300">
              {renderTabContent()}
            </div>
          </div>
        );
      case 'transcript':
        return <Transcript />;
      case 'actionable':
        return <Actionable />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-6 gap-10">
        <div className="flex gap-5 text-xl font-bold py-5 items-center text-[#222836]">
          <h2 className="cursor-pointer" onClick={() => navigate("/")}>Appointments</h2>
          <ChevronRight size={15} />
          <h2>{userData?.name}</h2>
        </div>
        <div className="flex items-center py-3 gap-4">
          <div className="flex items-center gap-1">
            <Calendar size={15} className="text-gray-500" />
            <p className="text-sm text-gray-500">Today</p>
          </div>
          <p className="text-sm text-gray-500 ">{userData?.time}</p>
        </div>
      </div>
      <h2 className="">   </h2>
      <div>
        <div className="flex items-start justify-between bg-[#ffffff8e] border-gray-300 border p-6 rounded-md mx-1">
          <div className="flex items-start space-x-4">
            <img
              src={userData?.profileImage || "/api/placeholder/80/80"}
              className="w-13 h-13 rounded-full object-cover"
              alt={userData?.name}
            />
            <div className="flex gap-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-gray-700">Name: <span className="font-medium text-gray-500">{userData?.name}</span> </h2>
                <div className="flex gap-1">
                  <h2 className="text-sm font-semibold text-gray-700">Patient ID: </h2>
                  <p className="text-sm text-gray-500">#{userData?._id?.slice(-6)}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-gray-700">Sex: <span className="font-medium text-gray-500">{userData?.gender}</span> </h2>
                <div className="flex gap-1">
                  <h2 className="text-sm font-semibold text-gray-700">Age: </h2>
                  <p className="text-sm text-gray-500">35</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-gray-700">Weight: <span className="font-medium text-gray-500">64kg</span> </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="  flex flex-col  rounded-sm bg-[#ffffff] dark:bg-[#00000099] mx-1 h-[calc(65vh-80px)] overflow-auto">
        {/* View Selection Buttons */}
        <div className="flex items-center border-b border-gray-300 p-3 gap-3 justify-between ">
          <button
            onClick={() => setActiveView('synopsis')}
            className={`px-4 text-sm w-1/3 py-2 flex justify-center items-center gap-2 rounded-sm ${activeView === 'synopsis' ? 'bg-blue-100 text-gray-950 font-medium' : 'text-gray-600 bg-gray-50'}`}
          >
            <FileText size={15} className={`${activeView === 'synopsis' ?'text-gray-950':''}`}/> Synopsis
          </button>
          <button
            onClick={() => setActiveView('transcript')}
            className={`px-4 text-sm py-2 w-1/3 flex justify-center items-center gap-2 rounded-sm ${activeView === 'transcript' ? 'bg-blue-100 text-gray-950 font-medium' : 'text-gray-600 bg-gray-50'}`}
          >
            <Ear size={15} className={`${activeView === 'transcript' ?'text-gray-950':''}`}/>Transcript
          </button>
          <button
            onClick={() => setActiveView('actionable')}
            className={`px-4 text-sm py-2 w-1/3 flex justify-center items-center gap-2 rounded-sm ${activeView === 'actionable' ? 'bg-blue-100 text-gray-950 font-medium' : 'text-gray-600 bg-gray-50'}`}
          >
            <Play size={15} className={`${activeView === 'actionable' ?'text-gray-950':''}`}/>Actionable
          </button>
        </div>

        {/* Main Content */}
        <div className="px-3">

          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default UserData;