import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
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
  const [name, setName] = useState("Kevin Smith");
  const [profession, setProfession] = useState("Advisor and Consultant at Stripe Inc.");
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState(null);
  const [imageType, setImageType] = useState(""); 
  const imgRef = useRef(null);

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setImageType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const aspectRatio = imageType === "profile" ? 1 / 1 : 16 / 9;

    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: "%", width: 90 },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const applyCrop = async () => {
    if (imgRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const ctx = canvas.getContext("2d");

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const croppedImage = canvas.toDataURL("image/jpeg");
      if (imageType === "profile") {
        setProfilePic(croppedImage);
      } else {
        setCoverPhoto(croppedImage);
      }

      setSelectedImage(null);
      setCrop(null);
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
              {isEditingAbout ? (
                <>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} />
                </>
              ) : (
                <>
                  <h2>{name}</h2>
                  <p>{profession}</p>
                </>
              )}
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
              <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} />
            ) : (
              <p>{aboutText}</p>
            )}
            <button onClick={() => setIsEditingAbout(!isEditingAbout)} className="edit-button">
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

      {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <h3>Crop Your Image</h3>
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={imageType === "profile" ? 1 / 1 : 16 / 9}>
              <img ref={imgRef} src={selectedImage} alt="Crop preview" onLoad={onImageLoad} />
            </ReactCrop>
            <button onClick={applyCrop}>Apply Crop</button>
            <button onClick={() => setSelectedImage(null)}>Cancel</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={modalImage} alt="Design Preview" className="modal-img" />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
