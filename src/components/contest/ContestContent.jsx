import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import "../../assets/css/contest/ContestContent.css"
import { User, Clock, Award, Upload, X, CheckCircle, Image, MessageSquare, Calendar } from "lucide-react"

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
              >
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleImageUpload}
                  className="file-input"
                  accept="image/jpeg,image/png,image/jpg"
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
        </div>
      </div>

      <div className="submission-gallery">
        <h2 className="gallery-title">
          <Image size={20} />
          <span>Submissions ({submissions.length})</span>
        </h2>

        {submissions.length === 0 ? (
          <div className="no-submissions">
            <p>No submissions yet. Be the first to submit your design!</p>
          </div>
        ) : (
          <div className="submission-cards">
            {submissions.map((submission) => (
              <div key={submission.id} className="submission-card" onClick={() => openModal(submission)}>
                <div className="submission-image-container">
                  <img src={submission.fileUrl || "/placeholder.svg"} alt="Submission" className="submission-image" />
                </div>
                <div className="submission-info">
                  <div className="submission-user">
                    <User size={16} className="user-icon" />
                    <span>{submission.userName}</span>
                  </div>
                  {submission.message && <p className="submission-message">{submission.message}</p>}
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
    </div>
  )
}