import { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaHeart } from "react-icons/fa";
import "../../assets/css/StyleSociety/LikeButton.css";

function LikeButton({ post }) {
  const [likes, setLikes] = useState([]);
  const [showLikes, setShowLikes] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Fetch likes in real-time
  useEffect(() => {
    if (!post?.id) return;

    const postRef = doc(db, "posts", post.id);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const postData = docSnap.data();
        setLikes(postData.likes || []); // Ensure UI updates only from Firestore
      }
    });

    return () => unsubscribe();
  }, [post?.id]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!post?.id || !currentUser) return;

    try {
      const postRef = doc(db, "posts", post.id);
      const isLiked = likes.some((like) => like.userId === currentUser.uid);

      if (isLiked) {
        // Remove like
        const likeToRemove = likes.find((like) => like.userId === currentUser.uid);
        if (likeToRemove) {
          await updateDoc(postRef, {
            likes: arrayRemove(likeToRemove),
          });
        }
      } else {
        // Add like
        const newLike = {
          userId: currentUser.uid,
          userName: currentUser.displayName || "Anonymous",
        };
        await updateDoc(postRef, {
          likes: arrayUnion(newLike),
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const isLiked = currentUser && likes.some((like) => like.userId === currentUser.uid);

  return (
    <div className="like-container">
      <div className="like-button-wrapper">
        <button 
          className={`like-button ${isLiked ? "liked" : ""}`} 
          onClick={handleLike} 
          title={isLiked ? "Unlike" : "Like"}
        >
          <FaHeart className="like-icon" />
          <span 
            className="like-count"
            onClick={(e) => {
              e.stopPropagation();
              setShowLikes(!showLikes);
            }}
          >
            {likes.length > 0 && likes.length}
          </span>
        </button>
      </div>

      {/* 🔹 Display Names Under the Like Button */}
      {likes.length > 0 && (
        <div className="like-names">
          <strong></strong>{" "}
          {[...new Map(likes.map((like) => [like.userId, like])).values()]
            .slice(0, 2)
            .map((like, index) => (
              <span key={like.userId}>
                {like.userName}
                {index < likes.length - 1 ? ", " : ""}
              </span>
            ))}
          {likes.length > 3 && <span> and {likes.length - 3} others</span>}
        </div>
      )}

      

      {/* 🔹 Pop-up List of Likes */}
      {showLikes && (
        <div className="likes-popup">
          <div className="likes-header">
            <h4>{likes.length} {likes.length === 1 ? "Like" : "Likes"}</h4>
            <button 
              className="close-button" 
              onClick={() => setShowLikes(false)}
            >
              ×
            </button>
          </div>
          <ul className="likes-list">
            {[...new Map(likes.map((like) => [like.userId, like])).values()].map(
              (like, index) => (
                <li key={`${like.userId}-${index}`} className="like-item">
                  <div className="like-user-info">
                    <strong>{like.userName}</strong>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LikeButton;
