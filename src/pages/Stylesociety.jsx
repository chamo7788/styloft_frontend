import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  AddPost,
  PostList,
  Feed,
  SocietyProfileCard,
  StyleSearchBar,
  TrendingCard
} from "../components/stylesociety";

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