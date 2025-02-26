import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faImage, faSmile, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react"; // Import Emoji Picker
import "../../assets/css/StyleSociety/CreatePost.css";
import Dp from "../../assets/images/s-societybackground.jpg";

function CreatePost({ onClose, setPosts }) {
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState('Friend');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Emoji Picker State

  const handlePostClick = async () => {
    if (!postContent) return;
    setIsPosting(true);

    try {
      const newPost = {
        text: postContent,
        files: fileUrls,
        privacy: selectedPrivacy,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "posts"), newPost);

      setPosts(prevPosts => [
        { id: docRef.id, ...newPost, createdAt: new Date() },
        ...prevPosts
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

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedFiles.length > 10) {
      alert('You can only upload a maximum of 10 files.');
      return;
    }
    const validFiles = files.filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
    setFileUrls(prevUrls => [...prevUrls, ...validFiles.map(file => URL.createObjectURL(file))]);
  };

  useEffect(() => {
    return () => fileUrls.forEach(url => URL.revokeObjectURL(url));
  }, [fileUrls]);

  const handleEmojiClick = (emojiData) => {
    setPostContent((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="createPost">
      <div className="create-background-blur"></div>
      <div className="topic">
        <button className="clossicon1" onClick={onClose}>
          <span className="clossicon">Close</span>
        </button>
        <span className="header">Create Post</span>
        <button className={`PostButton ${isPosting ? 'loading' : ''}`} onClick={handlePostClick} disabled={isPosting}>
          {isPosting ? 'Posting...' : <FontAwesomeIcon icon={faPaperPlane} />}
        </button>
      </div>

      <div className="createTop">
        <img src={Dp} alt="User Profile" className="createImage" />
        <span className="createUserName">Styloft</span>
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
              {fileUrl.endsWith('.mp4') ? (
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
        <input type="file" id="file-input" style={{ display: 'none' }} accept="image/*,video/*" multiple onChange={handleFileChange} />

        <label onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <FontAwesomeIcon icon={faSmile} className="emojiIcon" />
        </label>

        <label>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="locationIcon" />
        </label>
      </div>

      {showEmojiPicker && (
        <div className="emojiPickerContainer">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}

export default CreatePost;

