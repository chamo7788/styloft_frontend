import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../../assets/css/Profile/profile.css";
import defaultProfilePic from "../../assets/images/user-profile.png";
import defaultCoverPhoto from "../../assets/images/profile-background.jpg";
import { auth, db } from "../../firebaseConfig";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  // Keep all existing state variables
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [coverPhoto, setCoverPhoto] = useState(defaultCoverPhoto);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [nameError, setNameError] = useState("");
  const [professionError, setProfessionError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState(null);
  const [imageType, setImageType] = useState("");
  const imgRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserUid, setCurrentUserUid] = useState(null);
  
  // Add new state for designs
  const [userDesigns, setUserDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(true);

  // Get the userId from URL parameters
  const { id: profileUserId } = useParams();

  // Modify the useEffect to handle fetch timing better
  useEffect(() => {
    const loadProfileData = async () => {
      // Reset state when profile changes
      setName("");
      setProfession("");
      setAboutText("");
      setProfilePic(defaultProfilePic);
      setCoverPhoto(defaultCoverPhoto);
      setUserDesigns([]);
      setFollowers([]);
      setFollowing([]);
      
      // Get current user ID first
      const userString = localStorage.getItem("currentUser");
      let loggedInUserId = null;
      
      if (userString) {
        try {
          const user = JSON.parse(userString);
          if (user && user.uid) {
            loggedInUserId = user.uid;
            setCurrentUserUid(user.uid);
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
      
      // Determine which user profile to show
      const targetUserId = profileUserId || loggedInUserId;
      
      console.log("Profile ID from URL:", profileUserId);
      console.log("Logged in user ID:", loggedInUserId);
      console.log("Target user ID to display:", targetUserId);
      
      if (targetUserId) {
        setUserId(targetUserId);
        
        // Check if viewing own profile or someone else's
        const isOwnProfile = loggedInUserId === targetUserId;
        setIsCurrentUserProfile(isOwnProfile);
        
        // Fetch user data with await to ensure it completes
        await fetchUserProfile(targetUserId);
        fetchUserDesigns(targetUserId);
      }
    };
    
    loadProfileData();
  }, [profileUserId]); // This will re-run when the profile ID in the URL changes

  // Keep all existing functions like fetchUserProfile, handleFollow, etc.
  
  // Add new function to fetch designs
  const fetchUserDesigns = async (uid) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:3000/design/user/${uid}`);
      setUserDesigns(response.data);
    } catch (err) {
      console.error("Error fetching user designs:", err);
      setError("Failed to load designs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the fetchUserProfile function to be more strict about document data

const fetchUserProfile = async (uid) => {
  if (!uid) {
    console.error("No user ID provided to fetchUserProfile");
    return;
  }
  
  try {
    console.log(`Fetching profile data for user ID: ${uid}`);
    
    // Force a fresh fetch of the document
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // User document exists, use its data
      const userData = userDoc.data();
      console.log("User data retrieved:", userData);
      
      // Directly update state with the retrieved data
      if (userData.displayName) {
        setName(userData.displayName);
      } else if (userData.name) {
        setName(userData.name);
      } else {
        setName("User");
      }
      
      setProfession(userData.profession || "");
      setAboutText(userData.aboutText || userData.about || "");
      
      // Handle profile picture - make sure we have a fallback
      if (userData.photoURL && userData.photoURL !== "") {
        setProfilePic(userData.photoURL);
      } else {
        setProfilePic(defaultProfilePic);
      }
      
      // Handle cover photo - make sure we have a fallback
      if (userData.coverPhotoURL && userData.coverPhotoURL !== "") {
        setCoverPhoto(userData.coverPhotoURL);
      } else {
        setCoverPhoto(defaultCoverPhoto);
      }
      
      // Set followers/following
      setFollowers(userData.followers || []);
      setFollowing(userData.following || []);
      
      // Check if current user is following this profile
      if (currentUserUid && userData.followers) {
        setIsFollowing(userData.followers.includes(currentUserUid));
      }
    } else {
      console.log(`No user document found for ID: ${uid}, attempting to create it`);
      
      // Try to get user info from Firebase Auth directly
      try {
        // For current user, we can get data directly
        if (auth.currentUser && auth.currentUser.uid === uid) {
          const authUser = auth.currentUser;
          const basicUserData = {
            displayName: authUser.displayName || "New User",
            email: authUser.email || "",
            photoURL: authUser.photoURL || "",
            uid: authUser.uid,
            followers: [],
            following: [],
            profession: "",
            aboutText: ""
          };
          
          // Set the user data in state
          setName(basicUserData.displayName);
          setProfilePic(basicUserData.photoURL || defaultProfilePic);
          setProfession("");
          setAboutText("");
          setFollowers([]);
          setFollowing([]);
          
          // Create the document in Firestore
          await setDoc(userDocRef, basicUserData);
          console.log("Created new user document for current user");
        } else {
          // For other users, we need to fetch their info from auth
          console.log("Fetching user from Firebase Auth Admin (if available)");
          
          // Since client-side code can't directly access other users' auth data,
          // we'll create a minimal placeholder document
          const placeholderData = {
            displayName: "User",
            uid: uid,
            followers: [],
            following: [],
            profession: "",
            aboutText: "",
            photoURL: ""
          };
          
          // Set minimal data in state
          setName(placeholderData.displayName);
          setProfilePic(defaultProfilePic);
          setProfession("");
          setAboutText("");
          setFollowers([]);
          setFollowing([]);
          
          // Create placeholder document
          await setDoc(userDocRef, placeholderData);
          console.log("Created placeholder user document");
        }
      } catch (authError) {
        console.error("Error creating user from auth data:", authError);
        throw authError;
      }
    }
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    // Set default error state
    setName("Error loading profile");
    setProfession("");
    setAboutText("");
    setProfilePic(defaultProfilePic);
    setCoverPhoto(defaultCoverPhoto);
  }
};

  const handleFollow = async () => {
    if (!currentUserUid || currentUserUid === userId) return;
    
    try {
      if (isFollowing) {
        // Unfollow
        await updateDoc(doc(db, "users", userId), {
          followers: arrayRemove(currentUserUid)
        });
        
        await updateDoc(doc(db, "users", currentUserUid), {
          following: arrayRemove(userId)
        });
        
        setFollowers(followers.filter(id => id !== currentUserUid));
      } else {
        // Follow
        await updateDoc(doc(db, "users", userId), {
          followers: arrayUnion(currentUserUid)
        });
        
        await updateDoc(doc(db, "users", currentUserUid), {
          following: arrayUnion(userId)
        });
        
        setFollowers([...followers, currentUserUid]);
      }
      
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const handleImageChange = async (event, type) => {
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

  const applyCrop = async () => {
    if (imgRef.current && crop && crop.width && crop.height) {
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
        await updateProfilePicture(croppedImage);
      } else {
        setCoverPhoto(croppedImage);
        await updateCoverPhoto(croppedImage);
      }

      setSelectedImage(null);
      setCrop(null);
    }
  };

  const updateProfilePicture = async (imageUrl) => {
    if (!userId) return;

    try {
      await updateDoc(doc(db, "users", userId), { photoURL: imageUrl });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: imageUrl });
      }
      
      // Update the user in local storage too
      const userString = localStorage.getItem("currentUser");
      if (userString) {
        const user = JSON.parse(userString);
        user.photoURL = imageUrl;
        localStorage.setItem("currentUser", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const updateCoverPhoto = async (coverPhotoURL) => {
    if (!userId) return;

    try {
      await updateDoc(doc(db, "users", userId), { coverPhotoURL });
    } catch (error) {
      console.error("Error updating cover photo:", error);
    }
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
      await updateProfileInfo(name, profession, aboutText);
    }
  };

  const updateProfileInfo = async (displayName, profession, aboutText) => {
    if (!userId) return;

    try {
      await updateDoc(doc(db, "users", userId), {
        displayName,
        profession,
        aboutText,
      });
      
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      
      // Update the user in local storage too
      const userString = localStorage.getItem("currentUser");
      if (userString) {
        const user = JSON.parse(userString);
        user.displayName = displayName;
        localStorage.setItem("currentUser", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error updating profile info:", error);
    }
  };
                                                                                                                                                                                                                                                                                                                                             
  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <div className="cover-photo">
            <img 
              src={coverPhoto} 
              alt="Cover" 
              className="cover-img" 
              onError={(e) => {
                console.log("Error loading cover photo, using default");
                e.target.onerror = null; // Prevent infinite error loop
                e.target.src = defaultCoverPhoto;
              }}
            />
            {isCurrentUserProfile && (
              <label className="edit-button_cover-edit">
                ✎
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "cover")} hidden />
              </label>
            )}
          </div>
          <div className="profile-details">
            <div className="profile-pic-container">
              <img 
                src={profilePic} 
                alt="Profile" 
                className="profile-pic" 
                onError={(e) => {
                  console.log("Error loading profile picture, using default");
                  e.target.onerror = null; // Prevent infinite error loop
                  e.target.src = defaultProfilePic;
                }}
              />
              {isCurrentUserProfile && (
                <label className="edit-button profile-edit">
                  ✎
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "profile")} hidden />
                </label>
              )}
            </div>

            <div className="user-info">
              {isCurrentUserProfile && isEditingAbout ? (
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
              <div className="follow-stats">
                <span className="followers-count">{followers.length} followers</span>
                <span className="following-count">{following.length} following</span>
              </div>
              {!isCurrentUserProfile && currentUserUid && (
                <div className="profile-actions">
                  <button 
                    className={`connect-btn ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="profile-sections">
          <div className="about-section">
            <h3>About</h3>
            {isCurrentUserProfile && isEditingAbout ? (
              <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} />
            ) : (
              <p>{aboutText}</p>
            )}
            {isCurrentUserProfile && (
              <button onClick={() => (isEditingAbout ? handleSave() : setIsEditingAbout(true))} className="edit-button">
                {isEditingAbout ? "Save" : "Edit"}
              </button>
            )}
          </div>
          
          {/* Add the new Designs section */}
          <div className="designs-section">
            <h3>{isCurrentUserProfile ? "My Designs" : "Designs"}</h3>
            {isLoading ? (
              <p>Loading designs...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : userDesigns.length > 0 ? (
              <div className="designs-grid">
                {userDesigns.map((design) => (
                  <div key={design.id} className="design-card">
                    <img src={design.fileUrl} alt={design.description || 'Design'} />
                    {design.description && <p>{design.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p>{isCurrentUserProfile ? 
                "No designs found. Start creating to showcase your work!" : 
                "This user hasn't shared any designs yet."}
              </p>
            )}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <h2>Crop Image</h2>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={imageType === "profile" ? 1 : 16/9}
            >
              <img 
                src={selectedImage} 
                ref={imgRef}
                style={{ maxWidth: '100%' }}
                alt="Crop preview"
              />
            </ReactCrop>
            <div className="modal-actions">
              <button onClick={applyCrop}>Apply</button>
              <button onClick={() => setSelectedImage(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;