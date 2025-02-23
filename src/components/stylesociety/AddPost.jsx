import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCalendarAlt, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "./CreatePost"; 
import "../../assets/css/StyleSociety/AddPost.css";

const AddPost = ({ setPosts }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleOpenCreatePost = () => {
    setIsCreatePostOpen(true);
    setIsActive(true);
  };

  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false);
    setIsActive(false);
  };

  return (
    <div className="add-post-container">
      <div className="add-post">
        <img src="/dp.jpg" alt="User Profile" className="createImage" />
        <span 
          className={`post-input ${isActive ? "active" : ""}`} 
          onClick={handleOpenCreatePost}
        >
          What's on your mind?
        </span>
      </div>

      <div className="post-options">
        <div className="post-option">
          <FontAwesomeIcon icon={faCamera} className="Camicon" />
          <span>Media</span>
        </div>
        <div className="post-option">
          <FontAwesomeIcon icon={faCalendarAlt} className="Calicon" />
          <span>Event</span>
        </div>
        <div className="post-option">
          <FontAwesomeIcon icon={faFileAlt} className="Filicon" />
          <span>Write article</span>
        </div>
      </div>

      {/* Show CreatePost when clicked */}
      {isCreatePostOpen && <CreatePost onClose={handleCloseCreatePost} setPosts={setPosts} />}
    </div>
  );
};

export default AddPost;
