import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bell, X, Clock, Play, StopCircle, CheckCircle } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';
import { MedContext } from '../context/MedContext';

const NotificationPopup = () => {
  const { isSessionActive, elapsedTime, activeSessionUserId, endSession, userMessages } = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);
  const { users, filteredUsers } = useContext(MedContext);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const toastRef = useRef(null);

  // Sample initial notifications
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'info',
        title: "Today's session summary for Andrea #MAS12345 is saved",
        message: "To revise, open Andrea's profile",
        time: "10:55 AM",
        read: false,
        actions: [
          { text: "Read Summary", type: "outline" },
          { text: "Proceed to Home", type: "primary" }
        ]
      },
    ]);
  }, []);

  // Show toast when session starts
  useEffect(() => {
    if (isSessionActive && activeSessionUserId) {
      const userName = getUserName(activeSessionUserId);
      const startTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Show toast notification
      setToast({
        type: 'session-start',
        message: `Session started for ${userName} at ${startTime}`,
        timestamp: Date.now()
      });
      
      // Auto-hide toast after 5 seconds
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSessionActive, activeSessionUserId]);

  // Show toast when session ends
  useEffect(() => {
    if (!isSessionActive && activeSessionUserId === null && notifications.some(n => n.type === 'session-start' && !n.endTime)) {
      const lastSession = notifications.find(n => n.type === 'session-start' && !n.endTime);
      if (lastSession) {
        const userName = getUserName(lastSession.sessionId);
        const endTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Show toast notification
        setToast({
          type: 'session-end',
          message: `Session ended for ${userName} at ${endTime}`,
          timestamp: Date.now()
        });
        
        // Auto-hide toast after 5 seconds
        const timer = setTimeout(() => {
          setToast(null);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [isSessionActive, activeSessionUserId]);

  // Add session start notification when session becomes active
  useEffect(() => {
    if (isSessionActive && activeSessionUserId) {
      const sessionStartNotification = {
        id: Date.now(),
        type: 'session-start',
        title: `Session started for ${getUserName(activeSessionUserId)}`,
        message: "Patient consultation in progress",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        sessionId: activeSessionUserId,
        startTime: new Date()
      };

      setNotifications(prev => [sessionStartNotification, ...prev]);
    }
  }, [isSessionActive, activeSessionUserId]);

  // Add session end notification when session ends
  useEffect(() => {
    if (!isSessionActive && activeSessionUserId === null && notifications.some(n => n.type === 'session-start' && !n.endTime)) {
      const now = new Date();
      setNotifications(prev =>
        prev.map(notification =>
          notification.type === 'session-start' && !notification.endTime
            ? {
              ...notification,
              type: 'session-end',
              title: `Session ended for ${getUserName(notification.sessionId)}`,
              message: `Duration: ${formatTime(elapsedTime)}`,
              endTime: now,
              read: false
            }
            : notification
        )
      );
    }
  }, [isSessionActive, activeSessionUserId, elapsedTime]);

  const getUserName = (userId) => {
    // First check filteredUsers, then fall back to all users
    let user = filteredUsers.find(u => u._id === userId) ||
      users.find(u => u._id === userId);

    if (user) {
      return `${user.name} #${user._id.slice(-5)}`;
    }

    return `Patient #${userId.slice(-5)}`;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const toggleNotification = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleEndSession = () => {
    endSession();
    setIsOpen(false);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close popup when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // Close toast when clicked
  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast && (
        <div
          ref={toastRef}
          className={`fixed top-15 right-20 z-50 p-4 rounded-md shadow-lg flex items-center justify-between ${toast.type === 'session-start' ? 'bg-white text-black' : 'bg-white text-black'}`}
          style={{ minWidth: '250px', maxWidth: '300px' }}
        >
          <div className="flex items-center">
            {toast.type === 'session-start' ? (
              <Play className="w-5 h-5 mr-2" />
            ) : (
              <StopCircle className="w-5 h-5 mr-2" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={closeToast}
            className="ml-4 text-gray-500 hover:text-gray-700"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={toggleNotification}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        {/* Notification indicator dot - only show if there are unread notifications */}
        {notifications.some(n => !n.read) && (
          <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Notification Popup */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-10 sm:top-12 right-0 w-72 sm:w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-base sm:text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification Items */}
          <div className="max-h-72 sm:max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                >
                  <div className="flex items-start">
                    <div className={`w-2 h-2 mt-2 rounded-full mr-3 flex-shrink-0 ${notification.read ? 'bg-gray-300' :
                        notification.type === 'session-start' ? 'bg-green-500' :
                          notification.type === 'session-end' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {notification.type === 'session-start' && (
                          <Play className="w-4 h-4 text-green-500" />
                        )}
                        {notification.type === 'session-end' && (
                          <StopCircle className="w-4 h-4 text-purple-500" />
                        )}
                        <p className="text-sm font-medium break-words">
                          {notification.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>

                      {/* Session duration for ended sessions */}
                      {notification.type === 'session-end' && notification.startTime && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(notification.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {notification.time}
                        </p>
                      )}

                      {/* Action buttons */}
                      {notification.actions && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              className={`px-3 py-1 text-xs rounded hover:opacity-90 ${action.type === 'primary'
                                  ? 'bg-blue-500 text-white'
                                  : 'border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                }`}
                            >
                              {action.text}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* End Session button for active session */}
                      {notification.type === 'session-start' && !notification.endTime && isSessionActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEndSession();
                          }}
                          className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          End Session Now
                        </button>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 ml-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 sm:p-3 text-center border-t border-gray-200 dark:border-gray-700">
            <button className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;