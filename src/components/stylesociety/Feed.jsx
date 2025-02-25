import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import "../../assets/css/StyleSociety/Feed.css";

const Feed = () => {
  const [notifications, setNotifications] = useState([]);
  const [newFeed, setNewFeed] = useState({
    name: "",
    category: "",
    type: "",
    avatar: "/dp.jpg", // Default avatar, update if needed
  });

  useEffect(() => {
    // Reference to the "feed" collection in Firestore
    const feedRef = collection(db, "feed");

    // Listen for real-time updates
    const unsubscribe = onSnapshot(feedRef, (snapshot) => {
      const feedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(feedData);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Function to add a new feed item
  const handleAddFeed = async (e) => {
    e.preventDefault();
    if (!newFeed.name || !newFeed.category || !newFeed.type) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const feedRef = collection(db, "feed"); // Reference to Firestore collection
      await addDoc(feedRef, newFeed); // Add document to Firestore
      setNewFeed({ name: "", category: "", type: "", avatar: "/dp.jpg" }); // Reset form
    } catch (error) {
      console.error("Error adding feed:", error);
    }
  };

  return (
    <div className="Feed-container">
      <div className="Feed-header">
        <p>Add to your feed</p>
        <button className="add-btn">+</button>
      </div>

      {/* Form to add new feed */}
      <form onSubmit={handleAddFeed} className="add-feed-form">
        <input
          type="text"
          placeholder="Name"
          value={newFeed.name}
          onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newFeed.category}
          onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type"
          value={newFeed.type}
          onChange={(e) => setNewFeed({ ...newFeed, type: e.target.value })}
        />
        <button type="submit" className="submitbtn">Add Feed</button>
      </form>

      {/* Displaying the feed list */}
      {notifications.map((item) => (
        <div key={item.id} className="Feed-item">
          <img src={item.avatar} alt="avatar" className="Feed-avatar" />
          <div className="Feed-info">
            <p className="Feed-title">{item.name}</p>
            <p className="Feed-category">
              <span>{item.category}</span> • <span>{item.type}</span>
            </p>
            <button className="followbtn">+ Follow</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed ;


