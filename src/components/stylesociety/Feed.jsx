import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import "../../assets/css/StyleSociety/Feed.css";
import Dp from "../../assets/images/s-societybackground.jpg";

const Feed = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [newFeed, setNewFeed] = useState({
    name: "",
    category: "",
    type: "",
    avatar: "/dp.jpg", // Default avatar
  });

  const [followed, setFollowed] = useState({});
  const [hiddenItems, setHiddenItems] = useState({});

  useEffect(() => {
    const feedRef = collection(db, "feed");

    const unsubscribe = onSnapshot(feedRef, (snapshot) => {
      const feedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(feedData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddFeed = async (e) => {
    e.preventDefault();
    if (!newFeed.name || !newFeed.category || !newFeed.type) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const feedRef = collection(db, "feed");
      await addDoc(feedRef, newFeed);

      setNewFeed({ name: "", category: "", type: "", avatar: "/dp.jpg" }); // Reset form
      setShowForm(false); // Hide form after submission
    } catch (error) {
      console.error("Error adding feed:", error);
    }
  };

  const handleFollow = (id) => {
    setFollowed((prevState) => ({
      ...prevState,
      [id]: true,
    }));

    setTimeout(() => {
      setHiddenItems((prevState) => ({
        ...prevState,
        [id]: true,
      }));
    }, 3000);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "feed", id)); // Remove from Firestore
      setHiddenItems((prevState) => ({
        ...prevState,
        [id]: true, // Hide the item from UI
      }));
    } catch (error) {
      console.error("Error deleting feed:", error);
    }
  };

  return (
    <div className="Feed-container">
      <div className="Feed-header">
        <p>Add to your feed</p>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✖" : "+"} {/* Toggle button text */}
        </button>
      </div>
      {showForm && (
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
          <button type="submit" className="submitbtn">
            Add Feed
          </button>
        </form>
      )}

      {notifications.map((item) =>
        hiddenItems[item.id] ? null : (
          <div key={item.id} className="Feed-item">
            <img src={Dp} alt="avatar" className="Feed-avatar" />
            <div className="Feed-info">
              <p className="Feed-title">{item.name}</p>
              <p className="Feed-category">
                <span>{item.category}</span> • <span>{item.type}</span>
              </p>

              <div className="Feed-actions">
                <button
                  className={`followbtn ${followed[item.id] ? "following" : ""}`}
                  onClick={() => handleFollow(item.id)}
                >
                  {followed[item.id] ? "Following" : "+ Follow"}
                </button>

                <button className="deletebtn" onClick={() => handleDelete(item.id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Feed;

