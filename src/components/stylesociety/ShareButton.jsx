import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaShareSquare } from "react-icons/fa";
import { useState } from "react";
import "../../assets/css/StyleSociety/ShareButton.css";

const currentUserId = "user123"; // Replace with actual logged-in user ID

function ShareButton({ post }) {
  const [showOptions, setShowOptions] = useState(false);
  const [sharedUsers, setSharedUsers] = useState(post.shares || []);

  const handleShare = async (type) => {
    try {
      const postRef = doc(db, "posts", post.id);
      const newShare = { userId: currentUserId, type, timestamp: new Date() };

      await updateDoc(postRef, {
        shares: arrayUnion(newShare),
      });

      setSharedUsers([...sharedUsers, newShare]);
      setShowOptions(false);
      console.log(`${currentUserId} shared post ${post.id} as ${type}`);
      alert(`Post shared as ${type}!`);
    } catch (error) {
      console.error("Error sharing post: ", error);
    }
  };

  return (
    <div className="share-container">
      <div className="share-icon" onClick={() => setShowOptions(!showOptions)}>
        <FaShareSquare className="share-btn" />
      </div>

      {showOptions && (
        <div className="share-options">
          <button onClick={() => handleShare("Public")}>Share Public</button>
          <button onClick={() => handleShare("Private")}>Share Private</button>
        </div>
      )}

      {sharedUsers.length > 0 && (
        <div className="shared-by">
          <strong>Shared by:</strong>{" "}
          {sharedUsers.map((share, index) => (
            <span key={index}>
              {share.userId} ({share.type}){index < sharedUsers.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShareButton;
