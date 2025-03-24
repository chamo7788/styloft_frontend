import { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaShareSquare } from "react-icons/fa";
import "../../assets/css/StyleSociety/ShareButton.css";

function ShareButton({ post }) {
  const [shares, setShares] = useState([]);
  const [showShares, setShowShares] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (!post?.id) return;

    const postRef = doc(db, "posts", post.id);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const postData = docSnap.data();
        setShares(postData.shares || []);
      }
    });

    return () => unsubscribe();
  }, [post?.id]);

  const handleShare = async (e) => {
    e.preventDefault();
    if (!post?.id || !currentUser) return;

    try {
      const postRef = doc(db, "posts", post.id);
      const hasShared = shares.some((share) => share.userId === currentUser.uid);

      if (hasShared) {
        const shareToRemove = shares.find((share) => share.userId === currentUser.uid);
        if (shareToRemove) {
          await updateDoc(postRef, {
            shares: arrayRemove(shareToRemove),
          });
        }
      } else {
        const newShare = {
          userId: currentUser.uid,
          userName: currentUser.displayName || "Anonymous",
        };
        await updateDoc(postRef, {
          shares: arrayUnion(newShare),
        });
      }
    } catch (error) {
      console.error("Error updating share:", error);
    }
  };

  const hasShared = currentUser && shares.some((share) => share.userId === currentUser.uid);

  return (
    <div className="share-container">
      <div className="share-button-wrapper">
        <button 
          className={`share-button ${hasShared ? "shared" : ""}`} 
          onClick={handleShare} 
          title={hasShared ? "Unshare" : "Share"}
        >
          <FaShareSquare className="share-icon" />
          <span 
            className="share-count"
            onClick={(e) => {
              e.stopPropagation();
              setShowShares(!showShares);
            }}
          >
            {shares.length > 0 && shares.length}
          </span>
        </button>
      </div>

      {shares.length > 0 && (
        <div className="share-names">
          <strong>Shared by:</strong>{" "}
          {[...new Map(shares.map((share) => [share.userId, share])).values()]
            .slice(0, 3)
            .map((share, index) => (
              <span key={share.userId}>
                {share.userName}
                {index < shares.length - 1 ? ", " : ""}
              </span>
            ))}
          {shares.length > 3 && <span> and {shares.length - 3} others</span>}
        </div>
      )}

      {showShares && (
        <div className="shares-popup">
          <div className="shares-header">
            <h4>{shares.length} {shares.length === 1 ? "Share" : "Shares"}</h4>
            <button 
              className="close-button" 
              onClick={() => setShowShares(false)}
            >
              ×
            </button>
          </div>
          <ul className="shares-list">
            {[...new Map(shares.map((share) => [share.userId, share])).values()].map(
              (share, index) => (
                <li key={`${share.userId}-${index}`} className="share-item">
                  <div className="share-user-info">
                    <strong>{share.userName}</strong>
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

export default ShareButton;
