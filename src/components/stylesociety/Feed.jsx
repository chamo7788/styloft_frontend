import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc, doc, setDoc, query, where, getDocs, deleteDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../../assets/css/StyleSociety/Feed.css";
import Dp from "../../assets/images/s-societybackground.jpg"; // Default avatar

const Feed = ({ updateFollowingCount, updateFollowerCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [followed, setFollowed] = useState({});
  const [hiddenItems, setHiddenItems] = useState({});
  const [user, setUser] = useState(null);

  // Track the logged-in user and add them to the feed
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

  // Fetch followed users from Firestore
  const fetchFollowedUsers = async (email) => {
    const userDocRef = doc(db, "users", email);
    const followingRef = collection(userDocRef, "following");

    const querySnapshot = await getDocs(followingRef);
    const followedUsers = {};
    querySnapshot.forEach((doc) => {
      followedUsers[doc.id] = true; // Track followed users by email
    });
    setFollowed(followedUsers);
  };

  // Real-time feed listener excluding the logged-in user and followed users
  useEffect(() => {
    if (!user) return;

    const feedRef = collection(db, "feed");

    const unsubscribe = onSnapshot(feedRef, (snapshot) => {
      const feedData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item) => item.email !== user.email && !followed[item.email]); // Exclude the logged-in user and followed users

      setNotifications(feedData);
    });

    return () => unsubscribe();
  }, [user, followed]);

  // Add user to the feed only if their email is not already present
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

  // Handle follow button click, add follower in Firestore and update follower count
  const handleFollow = async (followedUserEmail, followedUserId) => {
    if (!user) return;

    // Update local followed state
    setFollowed((prevState) => {
      const newFollowed = { ...prevState, [followedUserEmail]: true };
      return newFollowed;
    });

    setTimeout(() => {
      setHiddenItems((prevState) => ({
        ...prevState,
        [followedUserId]: true,
      }));
    }, 3000);

    try {
      const userDocRef = doc(db, "users", user.email);
      const followingRef = collection(userDocRef, "following");

      // Add followed user to the following collection of the logged-in user
      await setDoc(doc(followingRef, followedUserEmail), { email: followedUserEmail });

      // Trigger profile follower count update
      updateFollowingCount(user.email);

      const followedUserDocRef = doc(db, "users", followedUserEmail);
      const followersRef = collection(followedUserDocRef, "followers");

      // Add current user as a follower
      await setDoc(doc(followersRef, user.email), { email: user.email });

      // Trigger profile follower count update
      updateFollowerCount(followedUserEmail); // This will trigger re-fetch of follower count
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Handle feed item deletion - Only remove from the UI (local state), not Firestore
  const handleDelete = async (id) => {
    try {
      // Remove the item locally from the notifications state
      setNotifications((prevState) => prevState.filter((item) => item.id !== id));

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
            </div>

            <div className="Feed-actions">
              <button
                className={`followbtn ${followed[item.email] ? "following" : ""}`}
                onClick={() => handleFollow(item.email, item.id)} // Passing both email and id
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
