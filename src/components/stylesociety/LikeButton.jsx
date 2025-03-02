import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "../../assets/css/StyleSociety/LikeButton.css";

const currentUserId = "user123"; // Replace with actual logged-in user ID

function LikeButton({ post }) {
  const handleLike = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      const isLiked = post.likes?.some(like => like.userId === currentUserId);

      await updateDoc(postRef, {
        likes: isLiked
          ? post.likes.filter(like => like.userId !== currentUserId)
          : [...(post.likes || []), { userId: currentUserId, timestamp: new Date() }]
      });

      console.log(`${currentUserId} ${isLiked ? "unliked" : "liked"} post ${post.id}`);
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  };

  return (
    <div className="like-container">
      <button onClick={handleLike} className="like-button">
        {post.likes?.some(like => like.userId === currentUserId) ? "Unlike" : "Like"} ({post.likes?.length || 0})
      </button>
      {post.likes?.length > 0 && (
        <p><strong>Liked by:</strong> {post.likes.map(like => like.userId).join(", ")}</p>
      )}
    </div>
  );
}

export default LikeButton;
