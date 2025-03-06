// components/Events.jsx
const Events = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {/* This would be replaced with actual event data */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Staff Meeting</h4>
              <span className="text-sm text-blue-500 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">Meeting</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Discussion of quarterly goals</p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              March 8, 2025 • 09:00 - 10:30
            </div>
          </div>
          
          {/* More event cards would go here */}
        </div>
      </div>
    );
  };
  
  export default Events;