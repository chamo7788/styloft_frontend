import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebaseConfig";
import { 
  collection, onSnapshot, addDoc, deleteDoc, doc, query, where, getDocs 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";  
import "../../assets/css/StyleSociety/Feed.css";
import Dp from "../../assets/images/s-societybackground.jpg"; // Default avatar

const Feed = () => {
  const [notifications, setNotifications] = useState([]);
  const [followed, setFollowed] = useState({});
  const [hiddenItems, setHiddenItems] = useState({});
  const [user, setUser] = useState(null); 

  // Track the logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await addFeed(
          currentUser.displayName || "Unknown User",
          currentUser.photoURL || "/dp.jpg",
          currentUser.email // Include email
        );
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time feed listener (Excluding the logged-in user)
  useEffect(() => {
    if (!user) return;

    const feedRef = collection(db, "feed");

    const unsubscribe = onSnapshot(feedRef, (snapshot) => {
      const feedData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item) => item.email !== user.email); // Exclude the logged-in user

      setNotifications(feedData);
    });

    return () => unsubscribe();
  }, [user]); // Runs only when the user state changes

  // Function to add user to the feed only if their email is not already present
  const addFeed = async (name, avatar, email) => {
    const feedRef = collection(db, "feed");

    // Check if the email already exists in Firestore
    const q = query(feedRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      try {
        await addDoc(feedRef, { name, avatar, email });
      } catch (error) {
        console.error("Error adding feed:", error);
      }
    } else {
      console.log("User with this email already exists in the feed.");
    }
  };

  // Handle follow button click
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

  // Handle feed deletion
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "feed", id));
      setHiddenItems((prevState) => ({
        ...prevState,
        [id]: true,
      }));
    } catch (error) {
      console.error("Error deleting feed:", error);
    }
  };

  return (
    <div className="Feed-container">
      <div className="Feed-header">
        <p>Your Feed</p>
      </div>

      {notifications.map((item) =>
        hiddenItems[item.id] ? null : (
          <div key={item.id} className="Feed-item">
            <img src={item.avatar || Dp} alt="avatar" className="Feed-avatar" />
            <div className="Feed-info">
              <p className="Feed-title">{item.name}</p>

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
