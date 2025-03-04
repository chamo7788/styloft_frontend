import React, { useState } from "react";
import "../../assets/css/Profile/profile.css";
import defaultProfilePic from "../../assets/images/user-profile.png";
import defaultCoverPhoto from "../../assets/images/profile-background.jpg";
import designImage from "../../assets/images/frock.jpeg";
import designimage from "../../assets/images/t-shirt.jpg";

const Profile = () => {
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [coverPhoto, setCoverPhoto] = useState(defaultCoverPhoto);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState("Experienced consultant with expertise in fintech and business development.");

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "profile") {
          setProfilePic(reader.result);
        } else {
          setCoverPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
  };

  const handleAboutChange = (event) => {
    setAboutText(event.target.value);
  };

  const toggleEditAbout = () => {
    setIsEditingAbout(!isEditingAbout);
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <div className="cover-photo">
            <img src={coverPhoto} alt="Cover" className="cover-img" />
            <label className="edit-button_cover-edit">
              ✎
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "cover")} hidden />
            </label>
          </div>
          <div className="profile-details">
            <div className="profile-pic-container">
              <img src={profilePic} alt="Profile" className="profile-pic" />
              <label className="edit-button profile-edit">
                ✎
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "profile")} hidden />
              </label>
            </div>
            <div className="user-info">
              <h2>Kevin Smith</h2>
              <p>Advisor and Consultant at Stripe Inc.</p>
              <p className="followers">| 500 followers</p>
              <div className="profile-actions">
                <button className="connect-btn">Follow</button>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-sections">
          <div className="about-section">
            <h3>About</h3>
            {isEditingAbout ? (
              <textarea value={aboutText} onChange={handleAboutChange} />
            ) : (
              <p>{aboutText}</p>
            )}
            <button onClick={toggleEditAbout} className="edit-button">
              {isEditingAbout ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
      <div className="Designs">
        <div className="profile-sections">
          <div className="about-section">
            <h3>Designs</h3>
            <p>Experienced consultant with expertise in fintech and business development.</p>
          </div>
        </div>
        <div className="DesignCard" onClick={() => openModal(designImage)}>
          <img src={designImage} alt="Design" className="design-img" />
          <h3 className="DesignName">"A frock for every mood, a style for every story."</h3>
          <p className="DesignReview">⭐ 4.5 (180 reviews)</p>
        </div>
        <div className="DesignCard" onClick={() => openModal(designimage)}>
          <img src={designimage} alt="Design" className="design-img" />
          <h3 className="DesignName">" "Fashioned to perfection, tailored for you."</h3>
          <p className="DesignReview">⭐ 4.5 (180 reviews)</p>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <img src={modalImage} alt="Enlarged Design" className="modal-img" />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
