import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import AddPost from "./AddPost";
import PostList from "./PostList";

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
    <div>
      <AddPost setPosts={setPosts} />
      <PostList posts={posts} setPosts={setPosts} />
    </div>
  );
};

export default ShowPost;
