import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import ShareButton from "./ShareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faEdit, faSave, faThumbtack, faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/StyleSociety/PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null); // Track open menus

  useEffect(() => {
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })));
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

  const toggleMenu = (postId) => {
    setMenuOpen(menuOpen === postId ? null : postId); // Toggle the menu
  };

  return (
    <div className="post-set">
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post">
            {/* Post Menu Bar */}
            <div className="post-menu">
              <FontAwesomeIcon icon={faEllipsisV} className="menu-icon" onClick={() => toggleMenu(post.id)} />
              {menuOpen === post.id && (
                <div className="menu-dropdown">
                  <button className="menu-item">
                    <FontAwesomeIcon icon={faEdit} /> Edit Post
                  </button>
                  <button className="menu-item">
                    <FontAwesomeIcon icon={faSave} /> Save Post
                  </button>
                  <button className="menu-item">
                    <FontAwesomeIcon icon={faThumbtack} /> Pin Post
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
            <p>{post.text}</p>
            <small>{post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString() : "Just now"}</small>
          <div className="p-action">
            {/* Like Component */}
            <LikeButton post={post} />

            {/* Comment Component */}
            <CommentSection post={post} />

            {/* Share Component */}
            <ShareButton post={post} />
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
