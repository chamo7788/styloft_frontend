import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faImage, faSmile, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/StyleSociety/CreatePost.css";

function CreatePost({ onClose, setPosts }) {
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState('Friend');

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

      // Update UI immediately
      setPosts(prevPosts => [
        { id: docRef.id, ...newPost, createdAt: new Date() }, // Fake timestamp for instant UI update
        ...prevPosts
      ]);

      setPostContent("");
      setSelectedFiles([]);
      setFileUrls([]);
    } catch (error) {
      console.error("Error adding post: ", error);
    } finally {
      setIsPosting(false);
      onClose(); // Close modal after posting
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
        <img src="/dp.jpg" alt="User Profile" className="createImage" />
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
    </div>
  );
}

export default CreatePost;
