import React, { useState, useEffect } from "react";
import "../../assets/css/StyleSociety/SocietyProfileCard.css";
import defaultProfilePic from "../../assets/images/user-profile.png";
import defaultCoverPhoto from "../../assets/images/profile-background.jpg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const SocietyProfileCard = () => {
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [coverPhoto, setCoverPhoto] = useState(defaultCoverPhoto);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [aboutText, setAboutText] = useState("");
  const [profession, setProfession] = useState("");
  const [loading, setLoading] = useState(true); // Added loader state

  // Function to fetch user data directly from Firestore
  const fetchUserData = async (uid) => {
    try {
      setLoading(true); // Start loading
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.displayName) setName(userData.displayName);
        if (userData.photoURL) setProfilePic(userData.photoURL);
        if (userData.coverPhotoURL) setCoverPhoto(userData.coverPhotoURL);
        if (userData.aboutText) setAboutText(userData.aboutText);
        if (userData.profession) setProfession(userData.profession);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.uid) {
          setUserId(user.uid);
          
          // Fetch the most recent user data from Firestore
          fetchUserData(user.uid);
          
          // Also set initial values from localStorage as a fallback
          if (user.displayName) setName(user.displayName);
          if (user.photoURL) setProfilePic(user.photoURL);
          if (user.coverPhotoURL) setCoverPhoto(user.coverPhotoURL);
          if (user.aboutText) setAboutText(user.aboutText);
          if (user.profession) setProfession(user.profession);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    
    // Listen for profile updates
    window.addEventListener("profileUpdated", handleProfileUpdate);
    
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);
  
  // Handle profile update event
  const handleProfileUpdate = (event) => {
    if (event.detail && event.detail.userId) {
      fetchUserData(event.detail.userId);
    } else if (userId) {
      fetchUserData(userId);
    }
  };

  return (
    <div className="SocietyProfile-container">
      {loading ? (
        <div className="SocietyProfile-loader">
          <div className="society-spinner"></div>
          <p>Loading Profile...</p>
        </div>
      ) : (
        <>
          <div className="SocietyProfile-header">
            <div className="SocietyProfileCover-photo">
              <img 
                src={coverPhoto} 
                alt="Cover" 
                className="SocietyProfileCover-img" 
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite error loop
                  e.target.src = defaultCoverPhoto;
                }}
              />
            </div>
            <div className="SocietyProfile-details">
              <div className="SocietyProfile-pic-container">
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  className="SocietyProfile-pic" 
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite error loop
                    e.target.src = defaultProfilePic;
                  }}
                />
              </div>
              <div className="SocietyProfile-info">
                <h3>{name || "User"}</h3>
                {profession && <p className="society-profession">{profession}</p>}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="SocietyProfile-about-section">
            <h4>About</h4>
            <div className="SocietyProfile-about-content">
              <p>{aboutText || "No information provided."}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocietyProfileCard;
