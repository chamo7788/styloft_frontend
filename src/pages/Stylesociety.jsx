import React from "react";
import { AddPost } from "../components/stylesociety/AddPost";
import { CreatePost } from "../components/stylesociety/CreatePost";
import { Post } from "../components/stylesociety/Post";
import { SearchBar } from "../components/stylesociety/SearchBar";
import { TrendingCard } from "../components/stylesociety/TrendingCard";

export default function StyleSociety() {
    return (
        <div>
            <AddPost />
            <CreatePost />
            <Post />
            <SearchBar />
            <TrendingCard />
            <h1>Style Society</h1>
            <p>Welcome to the Style Society page!</p>
        </div>
    );
}