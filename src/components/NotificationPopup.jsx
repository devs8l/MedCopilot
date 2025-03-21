import React, { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const NotificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

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

  const toggleNotification = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button 
        ref={buttonRef}
        onClick={toggleNotification} 
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        {/* Notification indicator dot */}
        <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full"></span>
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
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Notification Items */}
          <div className="max-h-72 sm:max-h-96 overflow-y-auto">
            {/* Notification item */}
            <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium break-words">Today's session summary for Andrea #MAS12345 is saved</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">To revise, open Andrea's profile</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="px-3 py-1 text-xs border border-blue-500 text-blue-500 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      Read Summary
                    </button>
                    <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                      Proceed to Home
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">10:55 AM</p>
                </div>
              </div>
            </div>
            
            {/* Another notification item */}
            <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-300 mr-3 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium break-words">Patient Michael #PT78901 has checked in</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Appointment scheduled for 11:15 AM</p>
                  <p className="text-xs text-gray-400 mt-2">10:42 AM</p>
                </div>
              </div>
            </div>
            
            {/* More notification examples */}
            <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-300 mr-3 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium break-words">Prescription for Sophia #PT45678 needs review</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dr. Johnson requested your input</p>
                  <p className="text-xs text-gray-400 mt-2">Yesterday, 4:30 PM</p>
                </div>
              </div>
            </div>
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