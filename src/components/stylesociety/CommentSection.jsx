import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useState } from "react";
import "../../assets/css/StyleSociety/CommentSection.css";

const currentUserId = "user123"; // Replace with actual logged-in user ID

function CommentSection({ post }) {
  const [commentText, setCommentText] = useState("");

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const postRef = doc(db, "posts", post.id);
      const comment = { userId: currentUserId, text: commentText, timestamp: new Date() };

      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      });

      console.log(`${currentUserId} commented on post ${post.id}: "${commentText}"`);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div className="comment-container">
      <input
        type="text"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleComment()}
      />
      <button onClick={handleComment} className="comment-button">Comment</button>
      <ul>
        {post.comments?.map((c, index) => (
          <li key={index}><strong>{c.userId}:</strong> {c.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default CommentSection;
