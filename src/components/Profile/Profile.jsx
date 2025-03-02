import React, { useState } from "react";
import "../../assets/css/Profile/profile.css";
import profilePic from "../../assets/images/user-profile.png";
import coverPhoto from "../../assets/images/profile-background.jpg";

const Profile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const images = [profilePic, profilePic, profilePic, profilePic];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="cover-photo" style={{ backgroundImage: `url(${coverPhoto})` }}></div>
        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-pic" style={{ backgroundImage: `url(${profilePic})` }}></div>
            <div className="profile-name-title">
              <h2>Kevin Smith</h2>
              <p>Advisor and Consultant at Stripe Inc.</p>
            </div>
          </div>
          <div className="profile-info">
            <p>📍 Saint-Petersburg, Russia</p>
            <p>📞 +1 711 018830 (Office)</p>
            <p>📱 +1 746 1741777 (Mobile)</p>
            <p>✉️ kevin.smith@stripe.com</p>
            <p>⭐ 4.5 (180 reviews)</p>
            <button className="chat-button">Chat</button>
           
          </div>
        </div>
      </div>
      <div className="image-gallery">
        {images.map((img, index) => (
          <div key={index} className="image-card" onClick={() => setSelectedImage(img)}>
            <img src={img} alt="Preview" />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content">
            <img src={selectedImage} alt="Full View" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
