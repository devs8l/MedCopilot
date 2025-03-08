import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";
import { Clock, AlertCircle, CheckCircle2, Loader, Info, Ellipsis, ChevronRight, ClipboardList } from "lucide-react";

const UserData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, filteredUsers, setIsUserSelected } = useContext(MedContext);
  const { userMessages, isloadingHistory } = useContext(ChatContext);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("chatHistory"); // Changed default to 'chatHistory'
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
    // First try to find in filteredUsers
    let user = filteredUsers.find((u) => u._id === id);

    // If not found, look in the full users array
    if (!user) {
      user = users.find((u) => u._id === id);
    }

    // Set the user data
    if (user) {
      setUserData(user);
    }
  }, [id, filteredUsers, users]);

  // Function to fetch patient history for reports tab
  // In UserData.js, modify your fetchPatientHistory function:
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

      // Extract the JSON data from the response
      if (!analysisResult.ok) throw new Error('Failed to analyze history');
      const analysisData = await analysisResult.json();

      // Save both the raw history data and the analysis
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

      // Create session entries from user messages
      let sessionDate = new Date();
      let currentSessionMessages = [];
      let lastSessionDate = null;

      for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === 'user') {
          // Store session start time in localStorage or generate a reasonably consistent one
          const storedDate = localStorage.getItem(`sessionStarted_${userData._id}_${i}`);
          if (storedDate) {
            sessionDate = new Date(storedDate);
          } else {
            // If no stored date, create one based on message index
            // This ensures consistent dates between renders
            sessionDate = new Date();
            sessionDate.setDate(sessionDate.getDate() - (messages.length - i) / 2);
            // Store for future reference
            localStorage.setItem(`sessionStarted_${userData._id}_${i}`, sessionDate.toISOString());
          }

          // If this is a new day compared to the last session, create a new session
          if (!lastSessionDate ||
            sessionDate.toDateString() !== lastSessionDate.toDateString()) {
            lastSessionDate = sessionDate;

            // Create a new session entry
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
            // Add message to current session
            currentSessionMessages.push(messages[i].content);

            // Update the last event with the new content
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

      // Sort by date (newest first)
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
    if (activeTab === 'chatHistory') {
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
    } else if (activeTab === 'reports') {
      if (isLoadingReports) {
        return (
          <div className="flex flex-col items-center justify-center h-40">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <p>Loading patient reports...</p>
          </div>
        );
      }

      // Find the AI analysis message (from handleClockClick)
      const analysisMessage = userData ?
        userMessages[userData._id]?.find(msg =>
          msg.type === 'bot' &&
          !msg.isInitial &&
          msg.content.includes('history')
        ) : null;

      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Patient Reports</h3>

          {/* Show AI Analysis if available */}
          {analysisMessage && (
            <div className="bg-white rounded-lg p-4 drop-shadow-sm mb-4">
              <h4 className="font-medium text-blue-600 mb-2">AI Analysis</h4>
              <div className="text-sm whitespace-pre-wrap">
                {analysisMessage.content}
              </div>
            </div>
          )}

          {/* Show raw patient history data */}
          {patientHistory ? (
            <div className="bg-white rounded-lg p-4 drop-shadow-sm">
              <h4 className="font-medium text-blue-600 mb-2">Patient History</h4>
              <div className="text-sm whitespace-pre-wrap">
                {patientHistory.analysis}
              </div>

              {/* Optionally display raw data in a structured format */}

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
          </div>
        </div>

        {/* Action Buttons - Removed Medical Events tab */}
        <div className="flex space-x-4 mb-2">
          <button
            className={`flex items-center space-x-2 px-6 py-2 gap-2 ${activeTab === 'chatHistory'
              ? 'bg-white drop-shadow-sm'
              : 'dark:text-white'
              }`}
            onClick={() => setActiveTab('chatHistory')}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm">Chat History</span>
          </button>
          <button
            className={`flex items-center space-x-2 px-6 py-2 gap-2 ${activeTab === 'reports'
              ? 'bg-white  drop-shadow-sm'
              : 'dark:text-white'
              }`}
            onClick={() => setActiveTab('reports')}
          >
            <ClipboardList className="w-4 h-4" />
            <span className="text-sm">Past Reports</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserData;