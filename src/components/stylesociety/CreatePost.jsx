import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faImage, faSmile, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import "../../assets/css/StyleSociety/CreatePost.css";
import Dp from "../../assets/images/s-societybackground.jpg"; // Default profile image
import { Link } from "react-router-dom";

function CreatePost({ onClose, setPosts }) {
  const [postContent, setPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  const handlePostClick = async () => {
    if (!postContent && fileUrls.length === 0) return;
    setIsPosting(true);

    try {
      const newPost = {
        text: postContent,
        files: fileUrls,
        createdAt: serverTimestamp(),
        userName: currentUser?.displayName || "Anonymous",
        userProfile: currentUser?.photoURL || Dp,
      };

      const docRef = await addDoc(collection(db, "posts"), newPost);

      setPosts((prevPosts) => [
        { id: docRef.id, ...newPost, createdAt: new Date() },
        ...prevPosts,
      ]);

      setPostContent("");
      setSelectedFiles([]);
      setFileUrls([]);
    } catch (error) {
      console.error("Error adding post: ", error);
    } finally {
      setIsPosting(false);
      onClose();
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedFiles.length > 10) {
      alert("You can only upload a maximum of 10 files.");
      return;
    }

    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    setIsPosting(true);

    try {
      const uploadedUrls = await Promise.all(validFiles.map(uploadToCloudinary));
      setFileUrls((prevUrls) => [...prevUrls, ...uploadedUrls.filter((url) => url)]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Styloft"); // Replace with your actual preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/ds0xdh85j/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };

  const handleEmojiClick = (emojiData) => {
    setPostContent((prev) => prev + emojiData.emoji);
  };

  return (
    <>
      <div className="create-background-blur"></div>
      <div className="createPost">
        <div className="topic">
          <button className="clossicon1" onClick={onClose}>
            <span className="clossicon">Close</span>
          </button>
          <span className="header">Create Post</span>
          <button className={`PostButton ${isPosting ? "Posting" : ""}`} onClick={handlePostClick} disabled={isPosting}>
            {isPosting ? "loading..." : <FontAwesomeIcon icon={faPaperPlane} />}
          </button>
        </div>

        <div className="createTop">
          {currentUser && (
            <div className="current-user-info">
              <Link to="/profile">
                <img
                  src={currentUser.photoURL || Dp}
                  className="createImage"
                  alt="User Profile"
                />
              </Link>
              <span className="createUserName">{currentUser.displayName}</span>
            </div>
          )}
        </div>

        <div className="createCenter">
          <textarea
            placeholder="What's on your mind?"
            rows="4"
            cols="70"
            className="addPostInput"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>

        <div className="uploadedFilesContainer">
          <div className="uploadedFiles">
            {fileUrls.map((fileUrl, index) => (
              <div key={index} className="filePreview1">
                {fileUrl.endsWith(".mp4") ? (
                  <video controls className="fileVideo">
                    <source src={fileUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={fileUrl} alt={`Uploaded file ${index}`} className="fileImage" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="createBottom">
          <label htmlFor="file-input" className="uploadButton">
            <FontAwesomeIcon icon={faImage} className="PIcon" />
          </label>
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
          />

          <label onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <FontAwesomeIcon icon={faSmile} className="emojiIcon" />
          </label>
        </div>

        {showEmojiPicker && (
          <div className="emojiPickerContainer">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </>
  );
}

export default CreatePost;



