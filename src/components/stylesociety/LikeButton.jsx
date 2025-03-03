import { useState, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaRegHeart, FaHeart, FaSmile, FaSadTear } from "react-icons/fa"; // Additional icons
import "../../assets/css/StyleSociety/LikeButton.css";

const currentUserId = "user123"; // Replace with actual logged-in user ID

function LikeButton({ post }) {
  const [liked, setLiked] = useState(post.likes?.some(like => like.userId === currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [likedUsers, setLikedUsers] = useState(post.likes?.map(like => like.userId) || []);
  const [showPopUp, setShowPopUp] = useState(false);
  const [reaction, setReaction] = useState(""); // Stores the reaction type
  const timerRef = useRef(null);

  const handleLike = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      const isLiked = liked;

      if (isLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: post.likes.filter(like => like.userId !== currentUserId)
        });
        setLikeCount(likeCount - 1);
        setLikedUsers(likedUsers.filter(userId => userId !== currentUserId));
      } else {
        // Like
        await updateDoc(postRef, {
          likes: [...(post.likes || []), { userId: currentUserId, timestamp: new Date() }]
        });
        setLikeCount(likeCount + 1);
        setLikedUsers([...likedUsers, currentUserId]);
      }

      setLiked(!isLiked);
      console.log(`${currentUserId} ${isLiked ? "unliked" : "liked"} post ${post.id}`);
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  };

  const handleMouseDown = () => {
    // Start the timer instantly (0.001 seconds)
    timerRef.current = setTimeout(() => {
      setShowPopUp(true); // Show the pop-up after 0.001 seconds (immediate effect)
    }, 1); // 0.001 seconds is basically instantaneous (rounded to 1 ms)
  };

  const handleMouseUp = () => {
    // Clear the timer if mouse is released before showing the pop-up
    clearTimeout(timerRef.current);
  };

  const handleReaction = (reactionType) => {
    setReaction(reactionType); // Set the chosen reaction
    setShowPopUp(false); // Close the pop-up after a reaction is selected
    console.log(`${currentUserId} reacted with ${reactionType} on post ${post.id}`);
  };

  return (
    <div className="like-container">
      <div
        className="like-icon"
        onClick={handleLike}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // In case mouse leaves the button before 0.001 seconds
      >
        {liked ? <FaHeart className="liked" /> : <FaRegHeart className="unliked" />}
        <span className="like-count">{likeCount}</span>
      </div>

      {likeCount > 0 && (
        <div className="liked-by">
          <strong>Liked by:</strong> {likedUsers.join(", ")}
        </div>
      )}

      {showPopUp && (
        <div className="reaction-popup">
          <div
            className="reaction-icon"
            onClick={() => handleReaction("like")}
            style={{ 
              border: reaction === "like" ? "2px solid #ff4757" : "none", // Add a border to indicate selection
              color: reaction === "like" ? "#ff4757" : "", // Change color of the icon
            }}
          >
            <FaHeart className="reaction" />
            <span>Like</span>
          </div>
          <div
            className="reaction-icon"
            onClick={() => handleReaction("smile")}
            style={{ 
              border: reaction === "smile" ? "2px solid #ffcc00" : "none", // Border color for smile
              color: reaction === "smile" ? "#ffcc00" : "", // Icon color change for smile
            }}
          >
            <FaSmile className="reaction" />
            <span>Smile</span>
          </div>
          <div
            className="reaction-icon"
            onClick={() => handleReaction("sad")}
            style={{ 
              border: reaction === "sad" ? "2px solid #1f8e89" : "none", // Border color for sad
              color: reaction === "sad" ? "#1f8e89" : "", // Icon color change for sad
            }}
          >
            <FaSadTear className="reaction" />
            <span>Sad</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LikeButton;
