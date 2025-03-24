import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import ShareButton from "./ShareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faEdit, faSave, faThumbtack, faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Loader2 } from "lucide-react"; // Loader icon
import "../../assets/css/StyleSociety/PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editPostId, setEditPostId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      let pinnedPosts = [];
      let normalPosts = [];

      snapshot.docs.forEach((doc) => {
        const post = { id: doc.id, ...doc.data() };

        if (post.postType === "pinned") {
          pinnedPosts.push(post);
        } else {
          normalPosts.push(post);
        }
      });

      // Merging pinned posts at the top
      setPosts([...pinnedPosts, ...normalPosts]);
      setIsLoading(false); // Stop loading once data is fetched
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleCopyLink = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postUrl);
    alert("Post link copied to clipboard!");
  };

  const handleEdit = (postId, currentText) => {
    setEditPostId(postId);
    setEditedText(currentText);
  };

  const handleSaveEdit = async (postId) => {
    try {
      await updateDoc(doc(db, "posts", postId), { text: editedText });
      setEditPostId(null);
    } catch (error) {
      console.error("Error updating post: ", error);
    }
  };

  const handleTogglePin = async (postId, currentType) => {
    let newType = currentType === "pinned" ? "normal" : "pinned";

    try {
      await updateDoc(doc(db, "posts", postId), { postType: newType });
      alert(newType === "pinned" ? "Post pinned!" : "Post unpinned!");
    } catch (error) {
      console.error("Error updating pin status: ", error);
    }
  };

  const toggleMenu = (postId) => {
    setMenuOpen(menuOpen === postId ? null : postId);
  };

  return (
    <div className="post-set">
      {isLoading ? (
        <div className="post-loading-container">
          <Loader2 className="post-loading-spinner" />
          <p>Loading posts...</p>
        </div>
      ) : (
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className={`post ${post.postType === "pinned" ? "pinned" : ""}`}>
            {/* Post Menu */}
            <div className="post-menu">
              <FontAwesomeIcon icon={faEllipsisV} className="menu-icon" onClick={() => toggleMenu(post.id)} />
              {menuOpen === post.id && (
                <div className="menu-dropdown">
                  <button className="menu-item" onClick={() => handleEdit(post.id, post.text)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit Post
                  </button>
                  <button className="menu-item" onClick={() => alert("Post saved!")}>
                    <FontAwesomeIcon icon={faSave} /> Save Post
                  </button>
                  <button className="menu-item" onClick={() => handleTogglePin(post.id, post.postType)}>
                    <FontAwesomeIcon icon={faThumbtack} /> {post.postType === "pinned" ? "Unpin Post" : "Pin Post"}
                  </button>
                  <button className="menu-item" onClick={() => handleCopyLink(post.id)}>
                    <FontAwesomeIcon icon={faCopy} /> Copy Link
                  </button>
                  <button className="menu-item delete" onClick={() => handleDelete(post.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="post-user">
              <img src={post.userProfile} alt="User Profile" className="post-user-img" />
              <span className="post-user-name">{post.userName}</span>
              <small className="post-timestamp">
                {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString() : "Just now"}
              </small>
            </div>

            {/* Editable Text Area */}
            {editPostId === post.id ? (
              <>
                <textarea className="edit-input" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                <button className="save-btn" onClick={() => handleSaveEdit(post.id)}>Save</button>
              </>
            ) : (
              <p>{post.text}</p>
            )}

            {/* Display Media (Images/Videos) */}
            {post.files && post.files.length > 0 && (
              <div className="post-media">
                {post.files.map((fileUrl, index) => (
                  <div key={index} className="file-preview">
                    {fileUrl.endsWith(".mp4") ? (
                      <video controls className="post-video">
                        <source src={fileUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={fileUrl} alt={`Uploaded file ${index}`} className="post-image" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="p-action">
              <LikeButton post={post} />
              <CommentSection post={post} />
              <ShareButton post={post} />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default PostList;
