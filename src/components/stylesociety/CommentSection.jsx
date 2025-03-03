import { doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { FaRegComment, FaTrash } from "react-icons/fa";
import "../../assets/css/StyleSociety/CommentSection.css";

const currentUserId = "user123"; // Replace with actual logged-in user ID

function CommentSection({ post }) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    const postRef = doc(db, "posts", post.id);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      setComments(postSnap.data().comments || []);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const newComment = { userId: currentUserId, text: commentText, timestamp: new Date() };
    try {
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });
      setComments([...comments, newComment]);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleDeleteComment = async (comment) => {
    try {
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        comments: arrayRemove(comment),
      });
      setComments(comments.filter(c => c !== comment));
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  return (
    <div className="comment-container">
      <FaRegComment className="comment-icon" onClick={toggleComments} />

      {showComments && (
        <div className="comment-section">
          <div className="comment-input-container">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button onClick={handleComment} className="comment-button">Comment</button>
          </div>

          <ul className="comment-list">
            {comments.map((c, index) => (
              <li key={index} className="comment-item">
                <strong>{c.userId}:</strong> {c.text}
                {c.userId === currentUserId && (
                  <FaTrash className="delete-icon" onClick={() => handleDeleteComment(c)} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CommentSection;
