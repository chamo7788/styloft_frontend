import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "/src/assets/css/DashBoard/ongoing-challenges.css"

export default function OngoingChallenges() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOngoingContests()
  }, [])

  const fetchOngoingContests = async () => {
    try {
      setLoading(true)
      const currentUser = JSON.parse(localStorage.getItem("currentUser"))

      if (!currentUser || !currentUser.uid) {
        throw new Error("User not logged in")
      }

      // Fetch all contests
      const response = await fetch("https://styloftbackendnew-production.up.railway.app/contest")

      if (!response.ok) {
        throw new Error("Failed to fetch contests")
      }

      const allContests = await response.json()

      // Filter for active contests (where deadline is in the future)
      const activeContests = allContests.filter((contest) => {
        const deadlineDate = new Date(contest.deadline)
        const currentDate = new Date()
        return deadlineDate > currentDate
      })

      setChallenges(activeContests)
    } catch (error) {
      console.error("Error fetching ongoing contests:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateDaysLeft = (deadline) => {
    const deadlineDate = new Date(deadline)
    const currentDate = new Date()
    const timeDiff = deadlineDate.getTime() - currentDate.getTime()
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysLeft > 0 ? daysLeft : 0
  }

  const calculateProgress = (deadline) => {
    // Calculate a fake progress percentage based on days left
    // This is just for visual representation
    const daysLeft = calculateDaysLeft(deadline)
    const maxDays = 30 // Assuming a month is the max contest duration
    const progress = 100 - Math.min(100, (daysLeft / maxDays) * 100)
    return Math.round(progress)
  }

  const handleContinueDesign = (contestId) => {
    navigate(`/contest/${contestId}`)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  if (loading) {
    return (
      <div className="ongoing-challenges">
        <div className="card-header">
          <h3 className="card-title">Ongoing Challenges</h3>
        </div>
        <div className="card-content loading-content">
          <div className="loading-spinner"></div>
          <p>Loading challenges...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ongoing-challenges">
        <div className="card-header">
          <h3 className="card-title">Ongoing Challenges</h3>
        </div>
        <div className="card-content error-content">
          <p>Error loading challenges: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="ongoing-challenges">
      <div className="card-header">
        <h3 className="card-title">Ongoing Challenges</h3>
        <button className="view-all-btn" onClick={() => navigate("/contest")}>
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>
      </div>
      <div className="card-content">
        {challenges.length === 0 ? (
          <div className="empty-state">
            <p>No active challenges found.</p>
            <button className="explore-btn" onClick={() => navigate("/contest")}>
              Explore Contests
            </button>
          </div>
        ) : (
          <div className="challenge-list">
            {challenges.slice(0, 3).map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <div className="challenge-header">
                  <h4 className="challenge-title">{challenge.title}</h4>
                  <div className="challenge-prize">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                    <span>${challenge.prize}</span>
                  </div>
                </div>
                <div className="challenge-info">
                  <div className="challenge-deadline">
                    <span>Deadline: {formatDate(challenge.deadline)}</span>
                  </div>
                  <div className="challenge-days-left">
                    <span>{calculateDaysLeft(challenge.deadline)} days left</span>
                  </div>
                </div>
                <div className="challenge-progress">
                  <div className="progress-info">
                    <span>Count Down</span>
                    <span>{calculateProgress(challenge.deadline)}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${calculateProgress(challenge.deadline)}%` }}></div>
                  </div>
                </div>
                <button className="continue-btn" onClick={() => handleContinueDesign(challenge.id)}>
                  Continue Design
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

