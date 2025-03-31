import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCalendarAlt, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "./CreatePost";
import "../../assets/css/StyleSociety/AddPost.css";
import Dp from "../../assets/images/user-profile.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { auth, db } from "../../firebaseConfig"; // Import firebase configs
import { doc, getDoc } from "firebase/firestore"; // Firestore functions

const AddPost = ({ setPosts }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate(); // Initialize navigate for routing

  // Fetch current user data including the latest profile photo
  useEffect(() => {
    const fetchUserData = async () => {
      // First get basic user info from localStorage
      const userFromStorage = JSON.parse(localStorage.getItem("currentUser"));
      
      if (userFromStorage && userFromStorage.uid) {
        // Set initial user data from localStorage
        setCurrentUser(userFromStorage);
        
        try {
          // Then fetch the latest user data from Firestore to ensure we have the most recent photo
          const userDocRef = doc(db, "users", userFromStorage.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Update the current user state with the latest data from Firestore
            setCurrentUser(prevUser => ({
              ...prevUser,
              photoURL: userData.photoURL || prevUser.photoURL,
              displayName: userData.displayName || prevUser.displayName
            }));
            
            // Update localStorage with the latest user data
            localStorage.setItem("currentUser", JSON.stringify({
              ...userFromStorage,
              photoURL: userData.photoURL || userFromStorage.photoURL,
              displayName: userData.displayName || userFromStorage.displayName
            }));
          }
        } catch (error) {
          console.error("Error fetching latest user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleOpenCreatePost = () => {
    setIsCreatePostOpen(true);
    setIsActive(true);
  };

  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false);
    setIsActive(false);
  };

  // Navigate to profile page when profile image is clicked
  const handleProfileImageClick = () => {
    navigate("/profile"); // Redirect to profile page
  };

  return (
    <div className="add-post-container">
      <div className="add-post">
        {/* Display current user's profile image or default image */}
        <img
          src={currentUser?.photoURL || Dp}  // Use current user's image if available, otherwise default image
          alt="user"
          className="createImage"
          onClick={handleProfileImageClick} // Add onClick to navigate to profile page
        />
        <span
          className={`post-input ${isActive ? "active" : ""}`}
          onClick={handleOpenCreatePost}
        >
          What's on your mind?
        </span>
      </div>

      <div className="post-options">
        <div className="post-option">
          <FontAwesomeIcon icon={faCamera} className="Camicon" />
          <span>Media</span>
        </div>
        <div className="post-option">
          <FontAwesomeIcon icon={faCalendarAlt} className="Calicon" />
          <span>Event</span>
        </div>
        <div className="post-option">
          <FontAwesomeIcon icon={faFileAlt} className="Filicon" />
          <span>Write article</span>
        </div>
      </div>

      {/* Show CreatePost when clicked */}
      {isCreatePostOpen && <CreatePost onClose={handleCloseCreatePost} setPosts={setPosts} />}
    </div>
  );
};

export default AddPost;
