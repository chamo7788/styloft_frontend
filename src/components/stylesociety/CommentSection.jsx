import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { FaRegComment, FaTrash } from "react-icons/fa";
import "../../assets/css/StyleSociety/CommentSection.css";

function CommentSection({ post }) {
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user?.displayName) {
      setName(user.displayName);
      setCurrentUserId(user.uid);
    }
  }, []);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    if (!post?.id) return console.error("Post ID is missing in fetchComments!");

    try {
      const postRef = doc(db, "posts", post.id);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        setComments(postSnap.data().comments || []);
        console.log("Fetched comments:", postSnap.data().comments);
      }
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return alert("Comment cannot be empty!");
    if (!post?.id) return console.error("Post ID is missing!");

    const newComment = {
      userId: currentUserId,
      userName: name,
      text: commentText,
      timestamp: new Date().toISOString(),
    };

    try {
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, { comments: arrayUnion(newComment) });

      setShowComments(true);  // 🔹 Ensure comments are shown
      fetchComments();        // 🔹 Fetch latest comments
      setCommentText("");     // 🔹 Clear input
    } catch (error) {
      console.error("Error adding comment: ", error);
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
            <button onClick={handleComment} className="comment-button">
              Comment
            </button>
          </div>

          <ul className="comment-list">
            {comments.map((c, index) => (
              <li key={index} className="comment-item">
                <strong>{c.userName || c.userId}:</strong> {c.text}
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
