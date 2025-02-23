import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CreatePost from "../components/stylesociety/CreatePost";
import PostList from "../components/stylesociety/PostList";
import AddPost from "../components/stylesociety/AddPost";
import Feed from "../components/stylesociety/Feed";
import SearchBar from "../components/stylesociety/SearchBar";
import ShowPost from "../components/stylesociety/ShowPost";

function StyleSociety() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <div>
      <SearchBar />
      <ShowPost />
      <Feed />
      {/* Pass the user ID to AddPost if needed */}
      <AddPost userId={user ? user.uid : null} />
      
      {/* Show PostList only when the user is authenticated */}
      {user && <PostList userId={user.uid} />}
    </div>
  );
}

export default StyleSociety;
