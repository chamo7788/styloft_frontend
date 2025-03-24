import React from "react";
import { User, Trophy, Heart, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SubmissionGallery = ({
  submissions,
  contest,
  isContestCreator,
  isDeadlinePassed,
  handleToggleFavorite,
  openModal,
  openChatModal,
  handleSetWinner,
  canChatWithSubmission,
}) => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="submission-gallery">
      <div
        className="gallery-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h2 className="gallery-title">
          <span>Submissions ({submissions.length})</span>
        </h2>

        {isContestCreator && (
          <button
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
              fontSize: "14px",
            }}
            onClick={() => navigate(`/contest/${contest.id}/favorites`)} // Navigate to the favorites page
          >
            <Heart size={16} />
            <span>Favorites</span>
          </button>
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
              <div
                className="submission-image-container"
                onClick={() => openModal(submission)}
              >
                <img
                  src={submission.fileUrl || "/placeholder.svg"}
                  alt="Submission"
                  className="submission-image"
                />

                {/* Add winner badge if this is the winner */}
                {contest.winner === submission.id && (
                  <div className="winner-badge-overlay">
                    <Trophy size={24} color="#f59e0b" />
                    <span>Winner</span>
                  </div>
                )}

                {/* Add favorite button */}
                {isContestCreator && (
                  <button
                    className="favorite-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the modal
                      handleToggleFavorite(submission.id);
                    }}
                  >
                    <Heart
                      size={20}
                      fill={submission.favorite ? "#ef4444" : "none"}
                      color={submission.favorite ? "#ef4444" : "#666"}
                    />
                  </button>
                )}
              </div>
              <div className="submission-info">
                <div className="submission-user">
                  <User size={16} className="user-icon" />
                  <span>{submission.userName}</span>
                </div>

                {submission.message && (
                  <p className="submission-message">{submission.message}</p>
                )}

                <div className="submission-actions">
                  {canChatWithSubmission(submission) && (
                    <button
                      className="chat-button"
                      onClick={() => openChatModal(submission)}
                    >
                      <MessageSquare size={16} />
                      <span>Chat</span>
                    </button>
                  )}

                  {/* Add Set as Winner button for contest creator when deadline passed */}
                  {isContestCreator && isDeadlinePassed && !contest.winner && (
                    <button
                      className="winner-button"
                      onClick={() => handleSetWinner(submission.id)}
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "#f59e0b",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <Trophy size={16} />
                      <span>Set as Winner</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionGallery;