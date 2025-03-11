import React, { useState, useRef, useEffect } from "react";
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
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("Advisor and Consultant at Stripe Inc.");
  const [nameError, setNameError] = useState("");
  const [professionError, setProfessionError] = useState("");
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState(null);
  const [imageType, setImageType] = useState(""); 
  const imgRef = useRef(null);

  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.displayName) {
      setName(user.displayName);
    }
    if (user.photoURL) {
      setProfilePic(user.photoURL);
    }
    if (user.aboutText) {
      setAboutText(user.aboutText);

    if (user && user.uid) {
      fetch(`http://localhost:3000/design/user/${user.uid}`)
        .then((response) => response.json())
        .then((data) => setDesigns(data))
        .catch((error) => console.error("Error fetching designs:", error));
    }
  }, []);

  const handleImageChange = async (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setImageType(type);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Styloft"); // Change to your Cloudinary preset
  
      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/ds0xdh85j/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          if (type === "profile") {
            setProfilePic(data.secure_url);
          } else {
            setCoverPhoto(data.secure_url);
          }
          await updateProfilePicture(data.secure_url);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
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

  const handleSave = async () => {
    let valid = true;
    if (!name.trim()) {
      setNameError("Name cannot be empty");
      valid = false;
    } else {
      setNameError("");
    }

    if (!profession.trim()) {
      setProfessionError("Profession cannot be empty");
      valid = false;
    } else {
      setProfessionError("");
    }

    if (valid) {
      setIsEditingAbout(false);

      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user || !user.email) return;

      try {
        const response = await fetch("http://localhost:3000/user/updateAbout", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, aboutText }),
        });

        if (response.ok) {
          user.aboutText = aboutText;
          localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
          const errorData = await response.json();
          console.error("Error updating about text:", errorData.message);
        }
      } catch (error) {
        console.error("Error updating about text:", error);
      }
    }
  };

  const updateProfilePicture = async (imageUrl) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user.uid) return;
  
    try {
      const response = await fetch("http://localhost:3000/user/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: user.uid, photoURL: imageUrl }),
      });
  
      if (response.ok) {
        user.photoURL = imageUrl;
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        const errorData = await response.json();
        console.error("Error updating profile picture:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
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
                  {nameError && <p className="error">{nameError}</p>}
                  <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} />
                  {professionError && <p className="error">{professionError}</p>}
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
            <button onClick={() => isEditingAbout ? handleSave() : setIsEditingAbout(true)} className="edit-button">
              {isEditingAbout ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
      <div className="Designs">
        <div className="profile-sections">
          <div className="about-section">
            <h3>Designs</h3>
            {designs.length > 0 ? (
              designs.map((design) => (
                <div key={design.id} className="DesignCard" onClick={() => openModal(design.fileUrl)}>
                  <img src={design.fileUrl} alt="Design" className="design-img" />
                  <h3 className="DesignName">{design.description}</h3>
                  <p className="DesignReview">⭐ 4.5 (180 reviews)</p>
                </div>
              ))
            ) : (
              <p>No designs available.</p>
            )}
          </div>
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