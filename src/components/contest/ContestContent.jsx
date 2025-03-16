import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import "../../assets/css/contest/ContestContent.css"
import { User, Clock, Award, Upload, X, CheckCircle, Image, MessageSquare, Calendar, Star } from "lucide-react"
import SubmissionCards from "./SubmissionCards";
import SubmitContest from "./SubmitContest";

export default function ContestContent() {
  const { id } = useParams()
  const [contest, setContest] = useState(null)
  const [isCreator, setIsCreator] = useState(false); // New state to track if the user is the creator
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

        // Check if the current user is the creator
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.uid === data.createdBy) {
          setIsCreator(true);
        }

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

  const handleRatingChange = async (submissionId, rating) => {
    try {
      const response = await fetch(`http://localhost:3000/submission/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          rating,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit rating. Please try again.");
      }
  
      const updatedSubmission = await response.json();
  
      // Update the local state with the new rating
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission.id === submissionId ? { ...submission, rating: updatedSubmission.rating } : submission
        )
      );
  
      alert("Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("An error occurred while submitting the rating.");
    }
  };

  const renderStars = (submissionId, currentRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={24}
          className={`star-icon ${i <= currentRating ? "filled" : ""}`}
          onClick={() => handleRatingChange(submissionId, i)}
        />
      );
    }
    return stars;
  };

  const renderStaticStars = (currentRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`star-icon ${i <= currentRating ? "filled" : ""}`}
        />
      );
    }
    return stars;
  };

  const renderInteractiveStars = (submissionId, currentRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={24}
          className={`star-icon ${i <= currentRating ? "filled" : ""}`}
          onClick={() => handleRatingChange(submissionId, i)}
        />
      );
    }
    return stars;
  };

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
        <SubmitContest
          contest={contest}
          isCreator={isCreator}
          isSubmitted={isSubmitted}
          isDragging={isDragging}
          isUploading={isUploading}
          imagePreview={imagePreview}
          errorMessage={errorMessage}
          newMessage={newMessage}
          isDeadlinePassed={isDeadlinePassed}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleImageUpload={handleImageUpload}
          handleClearForm={handleClearForm}
          handleSubmit={handleSubmit}
          setNewMessage={setNewMessage}
        />
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
          <SubmissionCards
            submissions={submissions}
            openModal={openModal}
            renderStaticStars={renderStaticStars}
          />
        )}
      </div>

      {isModalOpen && selectedSubmission && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              Close
            </button>
            <div className="modal-body">
              <img
                src={selectedSubmission.fileUrl || "/placeholder.svg"}
                alt="Submission"
                className="modal-image"
              />
              <div className="modal-info">
                <h3>{selectedSubmission.userName}</h3>
                {selectedSubmission.message && (
                  <p>{selectedSubmission.message}</p>
                )}
                {isCreator && (
                  <div className="rating-section">
                    <label className="rating-label">Rate this submission:</label>
                    <div className="star-rating">
                      {renderInteractiveStars(selectedSubmission.id, selectedSubmission.rating || 0)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// New ContestEdit component
function ContestEdit({ contest }) {
  const [updatedContest, setUpdatedContest] = useState({
    title: contest.title,
    description: contest.description,
    prize: contest.prize,
    deadline: new Date(contest.deadline).toISOString().split("T")[0],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedContest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch(`http://localhost:3000/contest/update/${contest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContest),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes. Please try again.");
      }

      const result = await response.json();
      console.log("Contest updated successfully:", result);
      alert("Contest updated successfully!");
    } catch (error) {
      console.error("Error updating contest:", error);
      setErrorMessage(error.message || "An error occurred while saving changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="contest-edit">
      <h2>Edit Contest</h2>
      <form onSubmit={handleSaveChanges}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={updatedContest.title}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={updatedContest.description}
            onChange={handleInputChange}
          ></textarea>
        </label>
        <label>
          Prize:
          <input
            type="number"
            name="prize"
            value={updatedContest.prize}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Deadline:
          <input
            type="date"
            name="deadline"
            value={updatedContest.deadline}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
}