import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../../assets/css/Profile/profile.css";
import { auth, db } from "../../firebaseConfig";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import axios from "axios";
import { useParams } from "react-router-dom";


// Default images
const defaultProfilePic = "../../assets/images/user-profile.png"
const defaultCoverPhoto = "../../assets/images/profile-background.jpg"

const Profile = () => {
  // State variables
  const [profilePic, setProfilePic] = useState(defaultProfilePic)
  const [coverPhoto, setCoverPhoto] = useState(defaultCoverPhoto)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [aboutText, setAboutText] = useState("")
  const [name, setName] = useState("")
  const [profession, setProfession] = useState("")
  const [nameError, setNameError] = useState("")
  const [professionError, setProfessionError] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [crop, setCrop] = useState(null)
  const [imageType, setImageType] = useState("")
  const imgRef = useRef(null)

  const [userId, setUserId] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [currentUserUid, setCurrentUserUid] = useState(null)

  // Designs state
  const [userDesigns, setUserDesigns] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(true)

  // Modal state
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [followersData, setFollowersData] = useState([])
  const [followingData, setFollowingData] = useState([])
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false)
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false)

  // Get the userId from URL parameters
  const { id: profileUserId } = useParams()

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      // Reset state when profile changes
      setName("")
      setProfession("")
      setAboutText("")
      setProfilePic(defaultProfilePic)
      setCoverPhoto(defaultCoverPhoto)
      setUserDesigns([])
      setFollowers([])
      setFollowing([])

      // Get current user ID first
      const userString = localStorage.getItem("currentUser")
      let loggedInUserId = null

      if (userString) {
        try {
          const user = JSON.parse(userString)
          if (user && user.uid) {
            loggedInUserId = user.uid
            setCurrentUserUid(user.uid)
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error)
        }
      }

      // Determine which user profile to show
      const targetUserId = profileUserId || loggedInUserId

      console.log("Profile ID from URL:", profileUserId)
      console.log("Logged in user ID:", loggedInUserId)
      console.log("Target user ID to display:", targetUserId)

      if (targetUserId) {
        setUserId(targetUserId)

        // Check if viewing own profile or someone else's
        const isOwnProfile = loggedInUserId === targetUserId
        setIsCurrentUserProfile(isOwnProfile)

        // Fetch user data with await to ensure it completes
        await fetchUserProfile(targetUserId)
        fetchUserDesigns(targetUserId)
      }
    }

    loadProfileData()
  }, [profileUserId])

  // Fetch user profile data
  const fetchUserProfile = async (uid) => {
    if (!uid) {
      console.error("No user ID provided to fetchUserProfile")
      return
    }

    try {
      console.log(`Fetching profile data for user ID: ${uid}`)

      // Force a fresh fetch of the document
      const userDocRef = doc(db, "users", uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        // User document exists, use its data
        const userData = userDoc.data()
        console.log("User data retrieved:", userData)

        // Directly update state with the retrieved data
        if (userData.displayName) {
          setName(userData.displayName)
        } else if (userData.name) {
          setName(userData.name)
        } else {
          setName("User")
        }

        setProfession(userData.profession || "")
        setAboutText(userData.aboutText || userData.about || "")

        // Handle profile picture - make sure we have a fallback
        if (userData.photoURL && userData.photoURL !== "") {
          setProfilePic(userData.photoURL)
        } else {
          setProfilePic(defaultProfilePic)
        }

        // Handle cover photo - make sure we have a fallback
        if (userData.coverPhotoURL && userData.coverPhotoURL !== "") {
          setCoverPhoto(userData.coverPhotoURL)
        } else {
          setCoverPhoto(defaultCoverPhoto)
        }

        // Set followers/following
        setFollowers(userData.followers || [])
        setFollowing(userData.following || [])

        // Check if current user is following this profile
        if (currentUserUid && userData.followers) {
          setIsFollowing(userData.followers.includes(currentUserUid))
        }
      } else {
        console.log(`No user document found for ID: ${uid}, attempting to create it`)

        // Try to get user info from Firebase Auth directly
        try {
          // For current user, we can get data directly
          if (auth.currentUser && auth.currentUser.uid === uid) {
            const authUser = auth.currentUser
            const basicUserData = {
              displayName: authUser.displayName || "New User",
              email: authUser.email || "",
              photoURL: authUser.photoURL || "",
              uid: authUser.uid,
              followers: [],
              following: [],
              profession: "",
              aboutText: "",
            }

            // Set the user data in state
            setName(basicUserData.displayName)
            setProfilePic(basicUserData.photoURL || defaultProfilePic)
            setProfession("")
            setAboutText("")
            setFollowers([])
            setFollowing([])

            // Create the document in Firestore
            await setDoc(userDocRef, basicUserData)
            console.log("Created new user document for current user")
          } else {
            // For other users, we need to fetch their info from auth
            console.log("Fetching user from Firebase Auth Admin (if available)")

            // Since client-side code can't directly access other users' auth data,
            // we'll create a minimal placeholder document
            const placeholderData = {
              displayName: "User",
              uid: uid,
              followers: [],
              following: [],
              profession: "",
              aboutText: "",
              photoURL: "",
            }

            // Set minimal data in state
            setName(placeholderData.displayName)
            setProfilePic(defaultProfilePic)
            setProfession("")
            setAboutText("")
            setFollowers([])
            setFollowing([])

            // Create placeholder document
            await setDoc(userDocRef, placeholderData)
            console.log("Created placeholder user document")
          }
        } catch (authError) {
          console.error("Error creating user from auth data:", authError)
          throw authError
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
      // Set default error state
      setName("Error loading profile")
      setProfession("")
      setAboutText("")
      setProfilePic(defaultProfilePic)
      setCoverPhoto(defaultCoverPhoto)
    }
  }

  // Fetch user designs
  const fetchUserDesigns = async (uid) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(`http://localhost:3000/design/user/${uid}`)
      setUserDesigns(response.data)
    } catch (err) {
      console.error("Error fetching user designs:", err)
      setError("Failed to load designs. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle follow/unfollow
  const handleFollow = async () => {
    if (!currentUserUid || currentUserUid === userId) return

    try {
      if (isFollowing) {
        // Unfollow
        await updateDoc(doc(db, "users", userId), {
          followers: arrayRemove(currentUserUid),
        })

        await updateDoc(doc(db, "users", currentUserUid), {
          following: arrayRemove(userId),
        })

        setFollowers(followers.filter((id) => id !== currentUserUid))
      } else {
        // Follow
        await updateDoc(doc(db, "users", userId), {
          followers: arrayUnion(currentUserUid),
        })

        await updateDoc(doc(db, "users", currentUserUid), {
          following: arrayUnion(userId),
        })

        setFollowers([...followers, currentUserUid])
      }

      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("Error updating follow status:", error)
    }
  }

  // Handle image change
  const handleImageChange = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result)
        setImageType(type)
      }
      reader.readAsDataURL(file)
    }
  }

  // Apply crop to image
  const applyCrop = async () => {
    if (imgRef.current && crop && crop.width && crop.height) {
      const canvas = document.createElement("canvas")
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height
      const ctx = canvas.getContext("2d")

      canvas.width = crop.width * scaleX
      canvas.height = crop.height * scaleY

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
      )

      const croppedImage = canvas.toDataURL("image/jpeg")
      if (imageType === "profile") {
        setProfilePic(croppedImage)
        await updateProfilePicture(croppedImage)
      } else {
        setCoverPhoto(croppedImage)
        await updateCoverPhoto(croppedImage)
      }

      setSelectedImage(null)
      setCrop(null)
    }
  }

  // Update profile picture
  const updateProfilePicture = async (imageUrl) => {
    if (!userId) return

    try {
      await updateDoc(doc(db, "users", userId), { photoURL: imageUrl })
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: imageUrl })
      }

      // Update the user in local storage too
      const userString = localStorage.getItem("currentUser")
      if (userString) {
        const user = JSON.parse(userString)
        user.photoURL = imageUrl
        localStorage.setItem("currentUser", JSON.stringify(user))
      }
    } catch (error) {
      console.error("Error updating profile picture:", error)
    }
  }

  // Update cover photo
  const updateCoverPhoto = async (coverPhotoURL) => {
    if (!userId) return

    try {
      await updateDoc(doc(db, "users", userId), { coverPhotoURL })
    } catch (error) {
      console.error("Error updating cover photo:", error)
    }
  }

  // Save profile info
  const handleSave = async () => {
    let valid = true
    if (!name.trim()) {
      setNameError("Name cannot be empty")
      valid = false
    } else {
      setNameError("")
    }

    if (!profession.trim()) {
      setProfessionError("Profession cannot be empty")
      valid = false
    } else {
      setProfessionError("")
    }

    if (valid) {
      setIsEditingAbout(false)
      await updateProfileInfo(name, profession, aboutText)
    }
  }

  // Update profile info
  const updateProfileInfo = async (displayName, profession, aboutText) => {
    if (!userId) return

    try {
      await updateDoc(doc(db, "users", userId), {
        displayName,
        profession,
        aboutText,
      })

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName })
      }

      // Update the user in local storage too
      const userString = localStorage.getItem("currentUser")
      if (userString) {
        const user = JSON.parse(userString)
        user.displayName = displayName
        localStorage.setItem("currentUser", JSON.stringify(user))
      }
    } catch (error) {
      console.error("Error updating profile info:", error)
    }
  }

  // Fetch followers/following data
  const fetchUsersByIds = async (userIds) => {
    const users = []

    for (const uid of userIds) {
      try {
        const userDoc = await getDoc(doc(db, "users", uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          users.push({
            id: uid,
            name: userData.displayName || userData.name || "User",
            photoURL: userData.photoURL || defaultProfilePic,
            profession: userData.profession || "",
          })
        }
      } catch (error) {
        console.error(`Error fetching user ${uid}:`, error)
      }
    }

    return users
  }

  // Show followers modal
  const handleShowFollowers = async () => {
    if (followers.length === 0) return

    setIsLoadingFollowers(true)
    setShowFollowersModal(true)

    try {
      const users = await fetchUsersByIds(followers)
      setFollowersData(users)
    } catch (error) {
      console.error("Error fetching followers:", error)
    } finally {
      setIsLoadingFollowers(false)
    }
  }

  // Show following modal
  const handleShowFollowing = async () => {
    if (following.length === 0) return

    setIsLoadingFollowing(true)
    setShowFollowingModal(true)

    try {
      const users = await fetchUsersByIds(following)
      setFollowingData(users)
    } catch (error) {
      console.error("Error fetching following:", error)
    } finally {
      setIsLoadingFollowing(false)
    }
  }

  // Navigate to user profile
  const navigateToProfile = (userId) => {
    // Close any open modals
    setShowFollowersModal(false)
    setShowFollowingModal(false)

    // Navigate to profile
    window.location.href = `/profile/${userId}`
  }

  return (
    <>
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          {/* Cover Photo */}
          <div className="cover-photo">
            <img
              src={coverPhoto || "/placeholder.svg"}
              alt="Cover"
              className="cover-img"
              onError={(e) => {
                console.log("Error loading cover photo, using default")
                e.target.onerror = null // Prevent infinite error loop
                e.target.src = defaultCoverPhoto
              }}
            />
            {isCurrentUserProfile && (
              <label className="edit-button-cover">
                <i className="icon-camera"></i>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "cover")} hidden />
              </label>
            )}
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="profile-pic-container">
              <img
                src={profilePic || "/placeholder.svg"}
                alt="Profile"
                className="profile-pic"
                onError={(e) => {
                  console.log("Error loading profile picture, using default")
                  e.target.onerror = null // Prevent infinite error loop
                  e.target.src = defaultProfilePic
                }}
              />
              {isCurrentUserProfile && (
                <label className="edit-button-profile">
                  <i className="icon-camera"></i>
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "profile")} hidden />
                </label>
              )}
            </div>

            <div className="user-info">
              {isCurrentUserProfile && isEditingAbout ? (
                <>
                  <div className="edit-field">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="edit-input"
                    />
                    {nameError && <p className="error-message">{nameError}</p>}
                  </div>
                  <div className="edit-field">
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="Profession"
                      className="edit-input"
                    />
                    {professionError && <p className="error-message">{professionError}</p>}
                  </div>
                </>
              ) : (
                <>
                  <h2>{name}</h2>
                  <p className="profession">{profession}</p>
                </>
              )}

              {/* Follow Stats */}
              <div className="follow-stats">
                <span
                  className="followers-count"
                  onClick={handleShowFollowers}
                  style={{ cursor: followers.length > 0 ? "pointer" : "default" }}
                >
                  <span className="count">{followers.length}</span> followers
                </span>
                <span
                  className="following-count"
                  onClick={handleShowFollowing}
                  style={{ cursor: following.length > 0 ? "pointer" : "default" }}
                >
                  <span className="count">{following.length}</span> following
                </span>
              </div>

              {/* Follow Button */}
              {!isCurrentUserProfile && currentUserUid && (
                <div className="profile-actions">
                  <button className={`connect-btn ${isFollowing ? "following" : ""}`} onClick={handleFollow}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="profile-sections">
          {/* About Section */}
          <div className="about-section">
            <div className="section-header">
              <h3>About</h3>
              {isCurrentUserProfile && (
                <button
                  onClick={() => (isEditingAbout ? handleSave() : setIsEditingAbout(true))}
                  className="edit-button"
                >
                  {isEditingAbout ? "Save" : "Edit"}
                </button>
              )}
            </div>
            <div className="section-content">
              {isCurrentUserProfile && isEditingAbout ? (
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Write something about yourself..."
                  className="about-textarea"
                />
              ) : (
                <p>{aboutText || "No information provided."}</p>
              )}
            </div>
          </div>

          {/* Designs Section */}
          <div className="designs-section">
            <h3>{isCurrentUserProfile ? "My Designs" : "Designs"}</h3>
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading designs...</p>
              </div>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : userDesigns.length > 0 ? (
              <div className="designs-grid">
                {userDesigns.map((design) => (
                  <div key={design.id} className="design-card">
                    <div className="design-image-container">
                      <img
                        src={design.fileUrl || "/placeholder.svg"}
                        alt={design.description || "Design"}
                        className="design-image"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder-design.jpg"
                        }}
                      />
                    </div>
                    {design.description && <p className="design-description">{design.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                {isCurrentUserProfile
                  ? "No designs found. Start creating to showcase your work!"
                  : "This user hasn't shared any designs yet."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Crop Image Modal */}
      {selectedImage && (
        <div className="modal">
          <div className="modal-content crop-modal">
            <h2>Crop Image</h2>
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={imageType === "profile" ? 1 : 16 / 9}>
              <img
                src={selectedImage || "/placeholder.svg"}
                ref={imgRef}
                style={{ maxWidth: "100%" }}
                alt="Crop preview"
              />
            </ReactCrop>
            <div className="modal-actions">
              <button className="modal-button apply-button" onClick={applyCrop}>
                Apply
              </button>
              <button className="modal-button cancel-button" onClick={() => setSelectedImage(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="follow-modal">
          <div className="follow-modal-content">
            <div className="follow-modal-header">
              <h2>Followers</h2>
              <button className="close-button" onClick={() => setShowFollowersModal(false)}>
                ×
              </button>
            </div>
            <div className="follow-list">
              {isLoadingFollowers ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading followers...</p>
                </div>
              ) : followersData.length > 0 ? (
                followersData.map((user) => (
                  <div key={user.id} className="follow-item" onClick={() => navigateToProfile(user.id)}>
                    <img
                      src={user.photoURL || "/placeholder.svg"}
                      alt={user.name}
                      className="follow-avatar"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = defaultProfilePic
                      }}
                    />
                    <div className="follow-info">
                      <p className="follow-name">{user.name}</p>
                      {user.profession && <p className="follow-profession">{user.profession}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">No followers found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="follow-modal">
          <div className="follow-modal-content">
            <div className="follow-modal-header">
              <h2>Following</h2>
              <button className="close-button" onClick={() => setShowFollowingModal(false)}>
                ×
              </button>
            </div>
            <div className="follow-list">
              {isLoadingFollowing ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading following...</p>
                </div>
              ) : followingData.length > 0 ? (
                followingData.map((user) => (
                  <div key={user.id} className="follow-item" onClick={() => navigateToProfile(user.id)}>
                    <img
                      src={user.photoURL || "/placeholder.svg"}
                      alt={user.name}
                      className="follow-avatar"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = defaultProfilePic
                      }}
                    />
                    <div className="follow-info">
                      <p className="follow-name">{user.name}</p>
                      {user.profession && <p className="follow-profession">{user.profession}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">Not following anyone</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile

