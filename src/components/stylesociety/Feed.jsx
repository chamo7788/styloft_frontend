import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc, doc, setDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../../assets/css/StyleSociety/Feed.css";
import Dp from "../../assets/images/s-societybackground.jpg"; // Default avatar

const Feed = ({ updateFollowingCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [followed, setFollowed] = useState({});
  const [hiddenItems, setHiddenItems] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await addFeed(currentUser.displayName || "Unknown User", currentUser.photoURL || "/dp.jpg", currentUser.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
  }, [user]);

  const addFeed = async (name, avatar, email) => {
    const feedRef = collection(db, "feed");
    const q = query(feedRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      try {
        await addDoc(feedRef, { name, avatar, email });
      } catch (error) {
        console.error("Error adding feed:", error);
      }
    }
  };

  const handleFollow = async (followedUserEmail, followedUserId) => {
    if (!user) return;

    setFollowed((prevState) => ({
      ...prevState,
      [followedUserId]: !prevState[followedUserId], // Toggle follow state
    }));

    setTimeout(() => {
      setHiddenItems((prevState) => ({
        ...prevState,
        [followedUserId]: true,
      }));
    }, 3000);

    try {
      const userDocRef = doc(db, "users", user.email);
      const followingRef = collection(userDocRef, "following");

      if (followed[followedUserId]) {
        await setDoc(doc(followingRef, followedUserEmail), { email: followedUserEmail });
      } else {
        await setDoc(doc(followingRef, followedUserEmail), { email: followedUserEmail });
      }
      // Trigger profile follower count update
      updateFollowingCount(user.email); 
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

   // Handle feed item deletion - Only remove from the UI (local state), not Firestore
   const handleDelete = async (id) => {
    try {
      // Remove the item locally from the notifications state
      setNotifications((prevState) => prevState.filter((item) => item.id !== id));

      // Optionally, remove the feed from Firestore (if needed)
      // await deleteDoc(doc(db, "feed", id)); // Uncomment if you want to delete from Firestore

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
                  onClick={() => handleFollow(item.email, item.id)} // Passing both email and id
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
