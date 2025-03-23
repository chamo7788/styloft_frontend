import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebaseConfig";
import { 
  collection, addDoc, doc, setDoc, query, where, getDocs, onSnapshot, updateDoc, arrayUnion 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../../assets/css/StyleSociety/Feed.css";
import Dp from "../../assets/images/user-profile.png"; 

const Feed = ({ updateFollowingCount, updateFollowerCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [followed, setFollowed] = useState({});
  const [hiddenItems, setHiddenItems] = useState({});
  const [user, setUser] = useState(null);
  
  // Add this new state to track profile updates
  const [profileUpdates, setProfileUpdates] = useState({});

  // Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await addFeed(currentUser.displayName || "Unknown User", currentUser.photoURL, currentUser.email);
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
  
  // Enhanced profile update listener for feed users
  useEffect(() => {
    if (!notifications.length) return;
    
    // Create an array of email addresses from notifications
    const emailsToWatch = notifications.map(item => item.email).filter(Boolean);
    console.log("Watching profiles for emails:", emailsToWatch);
    
    // Set up listeners for each user
    const unsubscribers = emailsToWatch.map(email => {
      // Use the email as the document ID to match how profiles are stored
      const userDocRef = doc(db, "users", email);
      
      return onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          console.log(`Profile update for ${email}:`, userData);
          
          setProfileUpdates(prev => ({
            ...prev,
            [email]: {
              photoURL: userData.photoURL || null,
              displayName: userData.displayName || userData.name || "Unknown User"
            }
          }));
        } else {
          console.log(`No document found for user ${email}`);
        }
      }, (error) => {
        console.error(`Error listening to profile updates for ${email}:`, error);
      });
    });
    
    return () => {
      // Clean up all listeners when component unmounts
      unsubscribers.forEach(unsub => unsub());
    };
  }, [notifications]);

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
      // Get the user document for both users
      const currentUserDoc = doc(db, "users", user.uid);
      
      // Need to get the user ID from email
      const followedUserQuery = query(collection(db, "users"), where("email", "==", followedUserEmail));
      const followedUserSnapshot = await getDocs(followedUserQuery);
      
      if (!followedUserSnapshot.empty) {
        const followedUserDoc = followedUserSnapshot.docs[0];
        const followedUserId = followedUserDoc.id;
        
        // Add to current user's following array
        await updateDoc(currentUserDoc, {
          following: arrayUnion(followedUserId)
        });
        
        // Add to followed user's followers array
        await updateDoc(doc(db, "users", followedUserId), {
          followers: arrayUnion(user.uid)
        });
        
        console.log("✅ Followed:", followedUserEmail);
        
        // For backwards compatibility, also update the old structure
        const followingRef = doc(db, "users", user.email, "following", followedUserEmail);
        const followerRef = doc(db, "users", followedUserEmail, "followers", user.email);
        
        await setDoc(followingRef, { email: followedUserEmail });
        await setDoc(followerRef, { email: user.email });
        
        // Update counters
        updateFollowingCount(user.email);
        updateFollowerCount(followedUserEmail);
      } else {
        console.error("Could not find user document for:", followedUserEmail);
      }
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
      {notifications.length === 0 ? (
        <div className="empty-feed-message">
          <p>No new users to follow at this time</p>
        </div>
      ) : (
        notifications.map((item) =>
          hiddenItems[item.id] ? null : (
            <div key={item.id} className="Feed-item">
              {/* Debug data */}
              {console.log("Rendering feed item:", item.email, {
                profileUpdateAvailable: !!profileUpdates[item.email],
                profilePhotoURL: profileUpdates[item.email]?.photoURL,
                originalAvatar: item.avatar
              })}
              
              <img 
                src={
                  (profileUpdates[item.email] && profileUpdates[item.email].photoURL) || 
                  item.avatar 
                } 
                className="Feed-avatar"
                alt={item.name || "User avatar"}
                onError={(e) => {
                  console.log("Image failed to load, using default");
                  e.target.onerror = null; // Prevent infinite error loop
                  e.target.src = Dp;
                }}
              />
              <div className="Feed-info">
                <p className="Feed-title">
                  {(profileUpdates[item.email] && profileUpdates[item.email].displayName) || item.name}
                </p>
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
        )
      )}
    </div>
  );
};

export default Feed;