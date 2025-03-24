import React, { useState } from "react"
import { Star, MessageSquare, ThumbsUp, Flag } from "lucide-react"

const ProductReviews = ({ productId, reviews = [], averageRating = 0, totalReviews = 0 }) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [expandedReviews, setExpandedReviews] = useState([])

  const handleSubmitReview = (e) => {
    e.preventDefault()

    // Here you would typically send the review to your backend
    console.log("Submitting review:", {
      productId,
      rating: userRating,
      comment: reviewComment,
    })

    // Reset form
    setUserRating(0)
    setReviewComment("")
    setShowReviewForm(false)

    // You might want to add the new review to the list or refresh the reviews
    alert("Thank you for your review!")
  }

  const toggleReviewExpand = (reviewId) => {
    setExpandedReviews((prev) =>
      prev.includes(String(reviewId)) ? prev.filter((id) => id !== String(reviewId)) : [...prev, String(reviewId)]
    )
  }

  const markReviewHelpful = (reviewId) => {
    // Here you would typically update this in your backend
    console.log("Marked review as helpful:", reviewId)

    // For demo purposes, we'll just update the UI
    const helpfulReviews = JSON.parse(localStorage.getItem("helpfulReviews") || "[]")
    if (!helpfulReviews.includes(reviewId)) {
      localStorage.setItem("helpfulReviews", JSON.stringify([...helpfulReviews, reviewId]))
    }
  }

  const renderStars = (rating, interactive = false) => {
    return Array(5)
      .fill(0)
      .map((_, index) => {
        const starValue = index + 1
        const filled = interactive ? (hoverRating || userRating) >= starValue : rating >= starValue

        return (
          <Star
            key={index}
            size={interactive ? 24 : 16}
            className={`star-icon ${filled ? "filled" : ""}`}
            fill={filled ? "currentColor" : "none"}
            onClick={interactive ? () => setUserRating(starValue) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(starValue) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        )
      })
  }

  const isReviewExpanded = (reviewId) => expandedReviews.includes(String(reviewId))

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <div className="stars-container">{renderStars(averageRating)}</div>
          </div>
          <span className="review-count">Based on {totalReviews} reviews</span>
        </div>
        <button className="write-review-button" onClick={() => setShowReviewForm(!showReviewForm)}>
          <MessageSquare size={16} />
          Write a Review
        </button>
      </div>

      {showReviewForm && (
        <div className="review-form-container">
          <form onSubmit={handleSubmitReview} className="review-form">
            <h4>Write Your Review</h4>

            <div className="rating-input">
              <label>Your Rating</label>
              <div className="stars-input">{renderStars(0, true)}</div>
            </div>

            <div className="comment-input">
              <label htmlFor="review-comment">Your Review</label>
              <textarea
                id="review-comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                required
                rows={4}
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowReviewForm(false)} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={userRating === 0 || !reviewComment.trim()}>
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="avatar">
                    {review.userAvatar ? (
                      <img src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                    ) : (
                      <div className="avatar-placeholder">{review.userName.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <div>
                    <div className="reviewer-name">{review.userName}</div>
                    <div className="review-date">{review.date}</div>
                  </div>
                </div>
                <div className="review-rating">{renderStars(review.rating)}</div>
              </div>

              <div className={`review-content ${isReviewExpanded(review.id) ? "expanded" : ""}`}>
                <p>{review.comment}</p>
              </div>

              {review.comment.length > 150 && !isReviewExpanded(review.id) && (
                <button className="read-more" onClick={() => toggleReviewExpand(review.id)}>
                  Read more
                </button>
              )}

              <div className="review-actions">
                <button
                  className={`helpful-button ${review.userHasMarkedHelpful ? "active" : ""}`}
                  onClick={() => markReviewHelpful(review.id)}
                  disabled={review.userHasMarkedHelpful}
                >
                  <ThumbsUp size={14} />
                  Helpful ({review.helpful})
                </button>
                <button className="report-button">
                  <Flag size={14} />
                  Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProductReviews