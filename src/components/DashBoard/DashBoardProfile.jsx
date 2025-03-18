import React, { useState, useEffect } from "react";
import "../../assets/css/DashBoard/DashBoardProfile.css";
import defaultProfilePic from "../../assets/images/user-profile.png";
import defaultCoverPhoto from "../../assets/images/profile-background.jpg";

const DashBoard = () => {
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [coverPhoto, setCoverPhoto] = useState(defaultCoverPhoto);
  const [name, setName] = useState("");
  const [aboutText, setAboutText] = useState("Experienced consultant with expertise in fintech and business development.");
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.displayName) {
      setName(user.displayName);
    }
    if (user.photoURL) {
      setProfilePic(user.photoURL);
    }
    if (user.coverPhotoURL) {
      setCoverPhoto(user.coverPhotoURL);
    }
    if (user.aboutText) {
      setAboutText(user.aboutText);
    }
  }, []);

  const handleSave = async () => {
    setIsEditingAbout(false);
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.uid) {
      try {
        await fetch("http://localhost:3000/user/updateAbout", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: user.uid, aboutText }),
        });
        user.aboutText = aboutText;
        localStorage.setItem("currentUser", JSON.stringify(user));
      } catch (error) {
        console.error("Error updating about text:", error);
      }
    }
  };

  return (
    <div className="DashBoardProfile-container">
      <div className="DashBoardProfile-header">
        <div className="DashBoardyProfileCover-photo">
          <img src={coverPhoto} alt="Cover" className="DashBoardProfileCover-img" />
        </div>
        <div className="DashBoardProfile-details">
          <div className="DashBoardProfile-pic-container">
            <img src={profilePic} alt="Profile" className="DashBoardProfile-pic" />
          </div>
          <div className="DashBoardProfileUser-info">
            <h2>{name}</h2>
          </div>
        </div>
      </div>
      <div className="DashBoardProfile-about-section">
        <h3>About</h3>
        {isEditingAbout ? (
          <>
            <textarea className="DashBoardTesyarea" value={aboutText} onChange={(e) => setAboutText(e.target.value)} />
            <button onClick={handleSave} className="DashboardSave-button">Save</button>
          </>
        ) : (
          <>
            <p>{aboutText}</p>
            <button onClick={() => setIsEditingAbout(true)} className="DashBoardEdit-button">Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
