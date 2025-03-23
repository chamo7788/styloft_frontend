import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Profile/NotifiRequest.css";
import { auth } from "../../firebaseConfig";

const NotifiRequest = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Get garment requests from localStorage
    const loadNotifications = () => {
      const garmentRequests = JSON.parse(localStorage.getItem("garmentRequests") || "[]");
      
      // Filter only pending requests for the current user if logged in
      const pendingRequests = currentUser ? 
        garmentRequests.filter(request => 
          request.status === "pending" && request.userId === currentUser.uid) : [];
      
      setNotifications(pendingRequests);
    };

    loadNotifications();

    // Set up an event listener for localStorage changes
    window.addEventListener("storage", loadNotifications);

    // Check for new notifications every 30 seconds
    const intervalId = setInterval(loadNotifications, 30000);

    return () => {
      window.removeEventListener("storage", loadNotifications);
      clearInterval(intervalId);
    };
  }, [currentUser]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Add this function to handle navigation to the request form
  const handleCreateRequest = () => {
    navigate('/request-form');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="NotifiRequest">
      <div className="request-buttons">
       <button className="CreateRequestBtn" onClick={handleCreateRequest}>
          Create New Request
        </button>
        <button className="MyRequestBtn" onClick={toggleDropdown}>
          My sent Request
          {notifications.length > 0 && (
            <span className="RequestCount">{notifications.length}</span>
          )}
        </button>
      </div>
      
      {showDropdown && (
        <div className="notifications-dropdown">
          <h3>Your Pending Requests</h3>
          {notifications.length === 0 ? (
            <p className="no-notifications">No pending requests</p>
          ) : (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <div className="notification-header">
                    <img 
                      src={notification.garmentImage} 
                      alt={notification.garmentLabel} 
                      className="notification-garment-img"
                    />
                    <span className="notification-garment">{notification.garmentLabel}</span>
                  </div>
                  <p className="notification-text">Request: {notification.requestText}</p>
                  <span className="notification-date">{formatDate(notification.date)}</span>
                  <span className="notification-status">Status: {notification.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotifiRequest;