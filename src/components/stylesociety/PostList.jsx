import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import ShareButton from "./ShareButton";
import "../../assets/css/StyleSociety/PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);

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

  return (
    <div className="apple">
    <div className="post-list"> 
      {posts.map((post) => (
        <div key={post.id} className="post">
          <p>{post.text}</p>
          <small>{post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString() : "Just now"}</small>

          {/* Like Component */}
          <LikeButton post={post} />

          {/* Comment Component */}
          <CommentSection post={post} />

          {/* Share Component */}
          <ShareButton post={post} />

          {/* Delete Button */}
          <button onClick={() => handleDelete(post.id)} className="deletePostButton">
            Delete
          </button>
        </div>
      ))}
    </div>
    </div>
  );
}

export default PostList;
