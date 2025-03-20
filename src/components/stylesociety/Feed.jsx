import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebaseConfig";
import { 
  collection, addDoc, doc, setDoc, query, where, getDocs, onSnapshot 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../../assets/css/StyleSociety/Feed.css";
import Dp from "../../assets/images/s-societybackground.jpg"; // Default avatar

const Feed = ({ updateFollowingCount, updateFollowerCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [followed, setFollowed] = useState({});
  const [hiddenItems, setHiddenItems] = useState({});
  const [user, setUser] = useState(null);

  // Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await addFeed(currentUser.displayName || "Unknown User", currentUser.photoURL || "/dp.jpg", currentUser.email);
        fetchFollowedUsers(currentUser.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch users the current user follows
  const fetchFollowedUsers = async (email) => {
    const followingRef = collection(db, "users", email, "following");
    const querySnapshot = await getDocs(followingRef);

    const followedUsers = {};
    querySnapshot.forEach((doc) => {
      followedUsers[doc.id] = true;
    });

    setFollowed(followedUsers);
  };

  // Real-time listener for feed (excluding user & followed users)
  useEffect(() => {
    if (!user) return;

    const feedRef = collection(db, "feed");
    const unsubscribe = onSnapshot(feedRef, (snapshot) => {
      const feedData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.email !== user.email && !followed[item.email]);

      setNotifications(feedData);
    });

    return () => unsubscribe();
  }, [user, followed]);

  // Add user to feed if not already present
  const addFeed = async (name, avatar, email) => {
    const feedRef = collection(db, "feed");
    const q = query(feedRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      try {
        await addDoc(feedRef, { name, avatar, email });
      } catch (error) {
        console.error("Error adding to feed:", error);
      }
    }
  };

  // Follow user & update Firestore
  const handleFollow = async (followedUserEmail, followedUserId) => {
    if (!user) return;

    console.log("Following:", followedUserEmail);

    setFollowed((prevState) => ({
      ...prevState,
      [followedUserEmail]: true,
    }));

    setTimeout(() => {
      setHiddenItems((prevState) => ({
        ...prevState,
        [followedUserId]: true,
      }));
    }, 3000);

    try {
      const followingRef = doc(db, "users", user.email, "following", followedUserEmail);
      const followerRef = doc(db, "users", followedUserEmail, "followers", user.email);

      // Add to "following" collection of the logged-in user
      await setDoc(followingRef, { email: followedUserEmail });

      // Add to "followers" collection of the followed user
      await setDoc(followerRef, { email: user.email });

      console.log("✅ Followed:", followedUserEmail);

      // Update counters
      updateFollowingCount(user.email);
      updateFollowerCount(followedUserEmail);
    } catch (error) {
      console.error("❌ Error following user:", error);
    }
  };

  // Remove feed item locally
  const handleDelete = async (id) => {
    try {
      setNotifications((prevState) => prevState.filter((item) => item.id !== id));
      setHiddenItems((prevState) => ({ ...prevState, [id]: true }));
    } catch (error) {
      console.error("Error deleting feed item:", error);
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
            </div>

            <div className="Feed-actions">
              <button
                className={`followbtn ${followed[item.email] ? "following" : ""}`}
                onClick={() => handleFollow(item.email, item.id)}
              >
                {followed[item.email] ? "Following" : "+ Follow"}
              </button>
              <button className="deletebtn" onClick={() => handleDelete(item.id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Feed;