import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CreatePost from "../components/stylesociety/CreatePost";
import PostList from "../components/stylesociety/PostList";
import AddPost from "../components/stylesociety/AddPost";
import Feed from "../components/stylesociety/Feed";
import SocietyProfileCard from "../components/stylesociety/SocietyProfileCard";
import StyleSearchBar from "../components/stylesociety/StyleSearchBar";
import { TrendingCard } from "../components/stylesociety/TrendingCard";


export default function Stylesociety() {


  return (
    <div>
      
      <StyleSearchBar />
      <AddPost />
      <PostList />
      <Feed />
      <SocietyProfileCard />
      
      {/* Pass the user ID to AddPost if needed }
      <AddPost userId={user ? user.uid : null} />
      
      { Show PostList only when the user is authenticated }
      {user && <PostList userId={user.uid} />*/}
    </div>
  );
}