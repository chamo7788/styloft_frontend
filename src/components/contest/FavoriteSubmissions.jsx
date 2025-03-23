import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "../../assets/css/contest/ContestContent.css"
import "../../assets/css/contest/favoriteSubmissions.css"
import { User, Clock, Award, X, Image, Star, Heart, ArrowLeft, Crown } from "lucide-react"

export default function FavoriteSubmissions() {
  const { id } = useParams()
  const [favoriteSubmissions, setFavoriteSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [contest, setContest] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [winnerSubmissionId, setWinnerSubmissionId] = useState(null)
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  // Fetch contest details
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await fetch(`http://localhost:3000/contest/${id}`)
        if (!response.ok) throw new Error("Failed to fetch contest")
        const data = await response.json()
        setContest(data)
        setWinnerSubmissionId(data.winner) // Store the current winner submission ID if any
      } catch (error) {
        console.error("Error fetching contest:", error)
        setError("Failed to load contest details")
      }
    }
    fetchContest()
  }, [id])

  // Fetch favorite submissions
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/submission/contest/${id}/favorites`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch favorite submissions: ${response.statusText}`);
        }
        
        const data = await response.json();
        setFavoriteSubmissions(data);
      } catch (error) {
        console.error("Error fetching favorite submissions:", error);
        setError(error.message || "Failed to load favorite submissions");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [id]);

  // Handle winner selection
  const handleSelectWinner = async (submissionId) => {
    if (!isContestCreator) return;
    
    try {
      const response = await fetch(`http://localhost:3000/contest/${id}/winner`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId: submissionId })
      });
      
      if (!response.ok) {
        throw new Error("Failed to set winner");
      }
      
      const updatedContest = await response.json();
      
      // Update local winner state
      setWinnerSubmissionId(submissionId);
      
      // Find submission info to display in alert
      const selectedSubmission = favoriteSubmissions.find(sub => sub.id === submissionId);
      alert(`${selectedSubmission.userName}'s submission has been selected as the winner!`);
      
    } catch (error) {
      console.error("Error selecting winner:", error);
      alert("Failed to select winner. Please try again.");
    }
  };

  const openModal = (submission) => {
    setSelectedSubmission(submission)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSubmission(null)
  }

  // Star Rating component (read-only for favorites page)
  const StarRating = ({ rating }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            fill={star <= rating ? "#f59e0b" : "none"}
            stroke={star <= rating ? "#f59e0b" : "#9ca3af"}
            className="star-readonly"
          />
        ))}
        <span className="rating-value">{rating ? rating.toFixed(1) : "Not rated"}</span>
      </div>
    )
  }

  // Check if user is contest creator
  const isContestCreator = contest && currentUser && currentUser.uid === contest.createdBy

  // Redirect if not contest creator
  useEffect(() => {
    if (contest && currentUser && currentUser.uid !== contest.createdBy) {
      window.location.href = `/contest/${id}`
    }
  }, [contest, currentUser, id])

  if (isLoading) {
    return (
      <div className="contest-loading">
        <div className="contest-loader"></div>
        <p>Loading favorite submissions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Link to={`/contest/${id}`} className="back-link">
          Back to Contest
        </Link>
      </div>
    )
  }

  return (
    <div className="contest-content-page">
      <div className="contest-header">
        <h1 className="contest-header-title">
          {contest ? `${contest.title} - Favorites` : 'Favorite Submissions'}
        </h1>
        <Link 
          to={`/contest/${id}`} 
          className="back-link"
        >
          <ArrowLeft size={16} />
          <span>Back to Contest</span>
        </Link>
      </div>

      <div className="submission-gallery">
        <h2 className="gallery-title">
          <Heart size={20} />
          <span>Favorite Submissions ({favoriteSubmissions.length})</span>
        </h2>

        {favoriteSubmissions.length === 0 ? (
          <div className="no-submissions">
            <p>No favorite submissions yet. Mark submissions as favorites from the contest page.</p>
          </div>
        ) : (
          <div className="submission-cards">
            {favoriteSubmissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-image-container" onClick={() => openModal(submission)}>
                  <img src={submission.fileUrl || "/placeholder.svg"} alt="Submission" className="submission-image" />
                  {winnerSubmissionId === submission.id && (
                    <div className="winner-badge">
                      <Crown size={16} />
                      <span>Winner</span>
                    </div>
                  )}
                </div>
                <div className="submission-info">
                  <div className="submission-user">
                    <User size={16} className="user-icon" />
                    <span>{submission.userName}</span>
                  </div>
                  
                  {/* Star Rating Component (read-only) */}
                  <StarRating rating={submission.rating || 0} />
                  
                  {submission.message && <p className="submission-message">{submission.message}</p>}
                  
                  {/* Crown button for selecting winner */}
                  {isContestCreator && (
                    <button
                      className={`crown-button ${winnerSubmissionId === submission.id ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectWinner(submission.id);
                      }}
                    >
                      <Crown size={16} />
                      <span>{winnerSubmissionId === submission.id ? "Selected as Winner" : "Select as Winner"}</span>
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
                {winnerSubmissionId === selectedSubmission.id && (
                  <div className="winner-badge-modal">
                    <Crown size={16} />
                    <span>Contest Winner</span>
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
