import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "../../assets/css/contest/ContestContent.css"
import { User, Clock, Award, Upload, X, CheckCircle, Image, MessageSquare, Calendar, Lock, Star, Heart } from "lucide-react"
import SubmissionChatView from "./SubmissionChatView"

export default function ContestContent() {
  const { id } = useParams()
  const [contest, setContest] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({ image: "" })
  const [newMessage, setNewMessage] = useState("")
  const [timeLeft, setTimeLeft] = useState(null)
  const [isUploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [submissions, setSubmissions] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    prize: "",
    deadline: ""
  })
  const [favoriteSubmissions, setFavoriteSubmissions] = useState([])
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)

  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  // Fetch contest details
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await fetch(`http://localhost:3000/contest/${id}`)
        if (!response.ok) throw new Error("Failed to fetch contest")
        const data = await response.json()
        setContest(data)
        setTimeLeft(calculateTimeLeft(new Date(data.deadline)))
      } catch (error) {
        console.error("Error fetching contest:", error)
      }
    }
    fetchContest()
  }, [id])

  // Countdown timer
  useEffect(() => {
    if (!timeLeft) return
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date(contest?.deadline)))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, contest?.deadline])

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/submission/contest/${id}`)
        if (!response.ok) throw new Error("Failed to fetch submissions")
        const data = await response.json()

        // Assuming the backend now includes the username in the submission response
        const submissionsWithUserDetails = data.map((submission) => ({
          ...submission,
          userName: submission.userName || "Unknown User",
        }))

        setSubmissions(submissionsWithUserDetails)
      } catch (error) {
        console.error("Error fetching submissions:", error)
      }
    }

    fetchSubmissions()
  }, [id, isSubmitted])

  // Fetch favorite submissions
  useEffect(() => {
    // Only fetch favorites if the current user is the contest creator
    if (contest && currentUser && currentUser.uid === contest.createdBy) {
      const fetchFavorites = async () => {
        setIsFavoriteLoading(true)
        try {
          const response = await fetch(`http://localhost:3000/submission/contest/${id}/favorites`)
          if (!response.ok) throw new Error("Failed to fetch favorite submissions")
          const data = await response.json()
          setFavoriteSubmissions(data)
        } catch (error) {
          console.error("Error fetching favorite submissions:", error)
        } finally {
          setIsFavoriteLoading(false)
        }
      }
      fetchFavorites()
    }
  }, [id, contest, currentUser])

  useEffect(() => {
    if (contest) {
      // Format the date to YYYY-MM-DD for the input type="date"
      const formattedDeadline = contest.deadline ? 
        new Date(contest.deadline).toISOString().split('T')[0] : "";
      
      setEditFormData({
        title: contest.title || "",
        description: contest.description || "",
        prize: contest.prize || "",
        deadline: formattedDeadline
      })
    }
  }, [contest])

  const calculateTimeLeft = (deadline) => {
    const now = new Date()
    const difference = deadline - now
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    if (!file) return

    const validTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload a JPG or PNG image.")
      return
    }

    setImagePreview(URL.createObjectURL(file))
    setUploading(true)
    setErrorMessage("")

    const imageData = new FormData()
    imageData.append("file", file)
    imageData.append("upload_preset", "Styloft")

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/ds0xdh85j/image/upload", {
        method: "POST",
        body: imageData,
      })

      const data = await response.json()

      if (data.secure_url) {
        setFormData((prevData) => ({
          ...prevData,
          image: data.secure_url,
        }))
      } else {
        setErrorMessage("Image upload failed. Try again.")
      }
    } catch (error) {
      setErrorMessage("Error uploading image. Check your network.")
    } finally {
      setUploading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.image) {
      setErrorMessage(isUploading ? "File is still uploading. Please wait." : "Please upload a file before submitting.")
      return
    }

    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (!user) {
      setErrorMessage("User not logged in. Please log in before submitting.")
      return
    }

    const submissionData = {
      fileUrl: formData.image,
      contestId: id,
      userId: user.uid,
      userName: user.displayName,
      message: newMessage,
    }

    try {
      const response = await fetch("http://localhost:3000/submission/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit design")
      }

      setIsSubmitted(true)
      setTimeout(() => {
        handleClearForm()
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting design:", error)
      setErrorMessage(error.message)
    }
  }

  // Clear form
  const handleClearForm = () => {
    setFormData({ image: "" })
    setNewMessage("")
    setImagePreview(null)
    setErrorMessage("")
    document.getElementById("file-upload").value = ""
  }

  const openModal = (submission) => {
    setSelectedSubmission(submission)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSubmission(null)
  }

  const openChatModal = (submission) => {
    setSelectedSubmission(submission)
    setIsChatModalOpen(true)
  }

  const closeChatModal = () => {
    setIsChatModalOpen(false)
    setSelectedSubmission(null)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value
    })
  }

  const handleUpdateContest = async () => {
    try {
      // Prepare the data for sending to the backend
      const updatedData = {
        title: editFormData.title,
        description: editFormData.description,
        prize: parseFloat(editFormData.prize),
        deadline: new Date(editFormData.deadline).toISOString()
      }

      // Send PATCH request to update the contest
      const response = await fetch(`http://localhost:3000/contest/${id}`, {
        method: "PATCH", // Use PATCH instead of PUT as it's more appropriate for partial updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update contest")
      }
      
      // Update the local contest state with edited data
      setContest({
        ...contest,
        ...updatedData
      })
      
      // Show success message
      alert("Contest updated successfully!")
      
      // Reset error message if there was any
      setErrorMessage("")
    } catch (error) {
      console.error("Error updating contest:", error)
      setErrorMessage(error.message)
    }
  }
  // Check if user can chat with this submission
  const canChatWithSubmission = (submission) => {
    if (!currentUser) return false

    // Contest creator can chat with all submissions
    const isContestCreator = currentUser.uid === contest?.createdBy

    // Submitter can only chat with their own submissions
    const isSubmitter = currentUser.uid === submission.userId

    return isContestCreator || isSubmitter
  }

  // Add this function to handle rating submission
  const handleRateSubmission = async (submissionId, rating) => {
    if (!currentUser || !isContestCreator) return
    
    try {
      const response = await fetch(`http://localhost:3000/submission/${submissionId}/rate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rating,
          contestId: id,
          ratedBy: currentUser.uid
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to rate submission")
      }
      
      // Update the submission in the local state
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? { ...sub, rating } : sub
      ))
      
    } catch (error) {
      console.error("Error rating submission:", error)
      alert("Failed to save rating. Please try again.")
    }
  }

  // Add this function to handle favorite toggle
  const handleToggleFavorite = async (submissionId) => {
    if (!currentUser || !isContestCreator) return
    
    try {
      console.log(`Toggling favorite for submission ${submissionId}`);
      const response = await fetch(`http://localhost:3000/submission/${submissionId}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to toggle favorite status")
      }
      
      const updatedSubmission = await response.json();
      console.log('Updated submission:', updatedSubmission);
      
      // Update submissions in state
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? { ...sub, favorite: updatedSubmission.favorite } : sub
      ))
      
      // If the submission has been marked as favorite, add it to favorites
      // If it has been unmarked, remove it from favorites
      if (updatedSubmission.favorite) {
        // Check if it's already in the favorites
        if (!favoriteSubmissions.find(fav => fav.id === submissionId)) {
          // Find the full submission object from submissions array
          const fullSubmission = submissions.find(sub => sub.id === submissionId);
          setFavoriteSubmissions([...favoriteSubmissions, fullSubmission]);
        }
      } else {
        // Remove from favorites
        setFavoriteSubmissions(favoriteSubmissions.filter(fav => fav.id !== submissionId));
      }
      
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite status. Please try again.");
    }
  }

  
  const StarRating = ({ rating, submissionId, readOnly }) => {
    const [hoverRating, setHoverRating] = useState(0)
    
    const handleClick = (value) => {
      if (readOnly) return
      handleRateSubmission(submissionId, value)
    }
    
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            fill={star <= (hoverRating || rating) ? "#f59e0b" : "none"}
            stroke={star <= (hoverRating || rating) ? "#f59e0b" : "#9ca3af"}
            className={readOnly ? "star-readonly" : "star-interactive"}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            onClick={() => handleClick(star)}
          />
        ))}
        <span className="rating-value">{rating ? rating.toFixed(1) : "Not rated"}</span>
      </div>
    )
  }

  if (!contest) {
    return (
      <div className="contest-loading">
        <div className="contest-loader"></div>
        <p>Loading contest details...</p>
      </div>
    )
  }

  const isDeadlinePassed =
    timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  // Check if the current user is the contest creator
  const isContestCreator = currentUser && currentUser.uid === contest.createdBy

  return (
    <div className="contest-content-page">
      <div className="contest-header">
        <h1 className="contest-header-title">{contest.title}</h1>
        <div className="contest-countdown-container">
          <div className="contest-countdown-label">
            <Clock size={18} />
            <span>{isDeadlinePassed ? "Contest Ended" : "Time Remaining"}</span>
          </div>
          <div className="contest-countdown">
            {isDeadlinePassed ? (
              <div className="closed-contest-message">
                <span>This contest has ended.</span>
              </div>
            ) : (
              <>
                <div className="countdown-item">
                  <span className="countdown-value">{String(timeLeft?.days).padStart(2, "0")}</span>
                  <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <span className="countdown-value">{String(timeLeft?.hours).padStart(2, "0")}</span>
                  <span className="countdown-label">Hours</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <span className="countdown-value">{String(timeLeft?.minutes).padStart(2, "0")}</span>
                  <span className="countdown-label">Mins</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <span className="countdown-value">{String(timeLeft?.seconds).padStart(2, "0")}</span>
                  <span className="countdown-label">Secs</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="contest-content-container">
        <div className="contest-left">
          <div className="contest-image-container">
            <img src={contest.image || "/placeholder.svg"} alt="Contest Banner" className="contest-image" />
            <div className="contest-prize-badge">
              <Award size={18} />
              <span>${contest.prize}</span>
            </div>
          </div>

          <div className="contest-details">
            <div className="contest-detail-item">
              <h2 className="contest-detail-title">About This Contest</h2>
              <p className="contest-description">{contest.description}</p>
            </div>

            <div className="contest-detail-item">
              <h3 className="contest-detail-subtitle">
                <Calendar size={16} />
                <span>Deadline</span>
              </h3>
              <p className="contest-deadline">
                {new Date(contest.deadline).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="contest-detail-item">
              <h3 className="contest-detail-subtitle">
                <Award size={16} />
                <span>Prize</span>
              </h3>
              <p className="contest-prize">${contest.prize}</p>
            </div>
          </div>
        </div>

        <div className="contest-right">
          {isContestCreator ? (
            // Contest Creator View - Edit Form
            <>
              <h2 className="submission-title">Edit Contest Details</h2>
              
              {errorMessage && (
                <div className="error-message">
                  <X size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              <div className="edit-form">
                <div className="edit-field">
                  <label htmlFor="title" className="edit-label">Contest Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="message-input"  // Reusing the submission form styles
                    value={editFormData.title}
                    onChange={handleEditChange}
                    placeholder="Contest title"
                  />
                </div>
                
                <div className="edit-field">
                  <label htmlFor="description" className="edit-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="message-input"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    placeholder="Contest description"
                    rows={5}
                  />
                </div>
                
                <div className="edit-field">
                  <label htmlFor="prize" className="edit-label">Prize Amount ($)</label>
                  <input
                    type="number"
                    id="prize"
                    name="prize"
                    className="message-input"
                    value={editFormData.prize}
                    onChange={handleEditChange}
                    placeholder="Prize amount"
                    min="1"
                  />
                </div>
                
                <div className="edit-field">
                  <label htmlFor="deadline" className="edit-label">Deadline</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    className="message-input"
                    value={editFormData.deadline}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div className="button-group">
                  <button 
                    className="submit-btn" 
                    onClick={handleUpdateContest}
                    disabled={isDeadlinePassed}
                  >
                    Update Contest
                  </button>
                </div>
                
                {isDeadlinePassed && (
                  <div className="deadline-passed-message">
                    <Clock size={16} />
                    <span>This contest has ended and can no longer be edited.</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Regular User View - Submission Form (Keep your existing code)
            <>
              {isSubmitted ? (
                <div className="submission-success">
                  <CheckCircle size={48} className="success-icon" />
                  <h3>Submission Successful!</h3>
                  <p>Your design has been submitted to the contest.</p>
                </div>
              ) : (
                <>
                  <h2 className="submission-title">Submit Your Design</h2>

                  <div
                    className={`upload-box ${isDragging ? "dragging" : ""} ${errorMessage ? "error" : ""}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-upload").click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleImageUpload}
                      className="file-input"
                      accept="image/jpeg,image/png,image/jpg"
                      style={{ display: "none" }}
                    />

                    {imagePreview ? (
                      <div className="image-preview-container">
                        <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="submission-image-preview" />
                        <button
                          className="remove-image-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClearForm()
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <div className="upload-icon-container">
                          <Upload size={24} className="upload-icon" />
                        </div>
                        <p className="upload-text">Drag and drop your design here</p>
                        <p className="upload-subtext">or click to browse files</p>
                        <p className="upload-formats">Supported formats: JPG, PNG</p>
                      </div>
                    )}

                    {isUploading && (
                      <div className="upload-overlay">
                        <div className="upload-spinner"></div>
                        <p>Uploading...</p>
                      </div>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="error-message">
                      <X size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="message-container">
                    <label htmlFor="message" className="message-label">
                      <MessageSquare size={16} />
                      <span>Add a message with your submission</span>
                    </label>
                    <textarea
                      id="message"
                      className="message-input"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Describe your design or add any notes for the contest creator..."
                    />
                  </div>

                  <div className="button-group">
                    <button className="submit-btn" onClick={handleSubmit} disabled={isUploading || isDeadlinePassed}>
                      {isUploading ? "Uploading..." : "Submit Design"}
                    </button>
                    <button className="clear-btn" onClick={handleClearForm}>
                      Clear Form
                    </button>
                  </div>

                  {isDeadlinePassed && (
                    <div className="deadline-passed-message">
                      <Clock size={16} />
                      <span>This contest has ended and is no longer accepting submissions.</span>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="submission-gallery">
        <div className="gallery-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="gallery-title">
            <Image size={20} />
            <span>Submissions ({submissions.length})</span>
          </h2>
          
          {isContestCreator && (
            <Link 
              to={`/contest/${id}/favorites`} 
              className="favorites-button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "#3b82f6",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "14px"
              }}
            >
              <Heart size={16} />
              <span>Favorites</span>
            </Link>
          )}
        </div>

        {submissions.length === 0 ? (
          <div className="no-submissions">
            <p>No submissions yet. Be the first to submit your design!</p>
          </div>
        ) : (
          <div className="submission-cards">
            {submissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-image-container" onClick={() => openModal(submission)}>
                  <img src={submission.fileUrl || "/placeholder.svg"} alt="Submission" className="submission-image" />
                </div>
                <div className="submission-info">
                  <div className="submission-user">
                    <User size={16} className="user-icon" />
                    <span>{submission.userName}</span>
                  </div>
                  
                  {/* Add Star Rating Component */}
                  <StarRating 
                    rating={submission.rating || 0} 
                    submissionId={submission.id} 
                    readOnly={!isContestCreator} 
                  />
                  
                  {submission.message && <p className="submission-message">{submission.message}</p>}

                  {canChatWithSubmission(submission) ? (
                    <button
                      className="chat-button"
                      onClick={() => openChatModal(submission)}
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <MessageSquare size={16} />
                      <span>Chat</span>
                    </button>
                  ) : (
                    <button
                      className="chat-button-disabled"
                      disabled
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "#e5e7eb",
                        color: "#9ca3af",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "not-allowed",
                      }}
                    >
                      <Lock size={16} />
                      <span>{isContestCreator ? "Chat Unavailable" : "Chat Restricted"}</span>
                    </button>
                  )}
                  {isContestCreator && (
                    <button
                      className="favorite-button"
                      onClick={() => handleToggleFavorite(submission.id)}
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <Heart size={16} />
                      <span>{submission.favorite ? "Unfavorite" : "Favorite"}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedSubmission && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <X size={24} />
            </button>
            <div className="modal-body">
              <img src={selectedSubmission.fileUrl || "/placeholder.svg"} alt="Submission" className="modal-image" />
              <div className="modal-info">
                <h3>{selectedSubmission.userName}</h3>
                {selectedSubmission.message && <p>{selectedSubmission.message}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {isChatModalOpen && selectedSubmission && (
        <div className="modal-overlay" onClick={closeChatModal}>
          <div className="modal-content submission-chat-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeChatModal}>
              <X size={24} />
            </button>
            <SubmissionChatView submission={selectedSubmission} contest={contest} isContestCreator={isContestCreator} />
          </div>
        </div>
      )}
    </div>
  )
  
}
