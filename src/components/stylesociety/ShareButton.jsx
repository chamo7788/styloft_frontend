import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "../../assets/css/StyleSociety/ShareButton.css";

const currentUserId = "user123"; // Replace with actual logged-in user ID

function ShareButton({ post }) {
  const handleShare = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        shares: arrayUnion({ userId: currentUserId, timestamp: new Date() }),
      });

      console.log(`${currentUserId} shared post ${post.id}`);
      alert("Post shared successfully!");
    } catch (error) {
      console.error("Error sharing post: ", error);
    }
  };

  return (
    <div className="share-container">
      <button onClick={handleShare} className="share-button">Share</button>
      {post.shares?.length > 0 && (
        <p><strong>Shared by:</strong> {post.shares.map(share => share.userId).join(", ")}</p>
      )}
    </div>
  );
}

export default ShareButton;
