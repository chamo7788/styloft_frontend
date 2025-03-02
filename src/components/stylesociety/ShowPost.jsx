import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import "../../assets/css/StyleSociety/ShowPost.css";
import AddPost from "./AddPost";
import PostList from "./PostList";
import CreatePost from "./CreatePost";

const ShowPost = () => {
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

  return (
    <div className="showpost-container" >
      <AddPost setPosts={setPosts} />
      <div>
        {posts.length > 0 ? (
          <PostList posts={posts} setPosts={setPosts} />
        ) : (
          <p >No posts available</p>
        )}
    </div>
    </div>
  );
};

export default ShowPost;
