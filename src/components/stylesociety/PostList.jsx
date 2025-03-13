import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import ShareButton from "./ShareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faEdit, faSave, faThumbtack, faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/StyleSociety/PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editPostId, setEditPostId] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      let pinnedPosts = [];
      let normalPosts = [];
      let unpinnedPosts = [];

      snapshot.docs.forEach((doc) => {
        const post = { id: doc.id, ...doc.data() };

        // Categorizing posts
        if (post.postType === "pinned") {
          pinnedPosts.push(post);
        } else if (post.postType === "normal") {
          normalPosts.push(post);
        } else {
          unpinnedPosts.push(post);
        }
      });

      // Setting the sorted posts: pinned first, then normal, then unpinned
      setPosts([...pinnedPosts, ...normalPosts, ...unpinnedPosts]);
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
    let newType = "normal"; // Default to normal posts

    if (currentType === "pinned") {
      newType = "unpin"; // If pinned, move it to unpinned
    } else {
      newType = "pinned"; // Otherwise, pin the post
    }

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
              <small className="post-timestamp">{post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString() : "Just now"}</small>
            </div>

            {editPostId === post.id ? (
              <textarea
                className="edit-input"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            ) : (
              <p>{post.text}</p>
            )}

            {editPostId === post.id && (
              <button className="save-btn" onClick={() => handleSaveEdit(post.id)}>
                Save
              </button>
            )}

            <div className="p-action">
              <LikeButton post={post} />
              <CommentSection post={post} />
              <ShareButton post={post} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
