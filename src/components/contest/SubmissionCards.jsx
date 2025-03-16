import { User, Star } from "lucide-react";

export default function SubmissionCards({ submissions, openModal, renderStaticStars }) {
  return (
    <div className="submission-cards">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="submission-card"
          onClick={() => openModal(submission)}
        >
          <div className="submission-image-container">
            <img
              src={submission.fileUrl || "/placeholder.svg"}
              alt="Submission"
              className="submission-image"
            />
          </div>
          <div className="submission-info">
            <div className="submission-user">
              <User size={16} className="user-icon" />
              <span>{submission.userName}</span>
            </div>
            {submission.message && (
              <p className="submission-message">{submission.message}</p>
            )}
            <div className="submission-rating">
              {renderStaticStars(submission.rating || 0)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}