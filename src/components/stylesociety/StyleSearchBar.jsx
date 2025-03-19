import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../../assets/css/StyleSociety/styleSearchBar.css";

export function StyleSearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [feedData, setFeedData] = useState([]);

    const navigate = useNavigate();

    // Fetch user feed data from Firestore
    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const feedRef = collection(db, "feed");
                const querySnapshot = await getDocs(feedRef);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFeedData(data);
            } catch (error) {
                console.error("Error fetching feed data:", error);
            }
        };

        fetchFeed();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setErrorMessage("Please enter a name to search.");
            setSearchResults([]);
            return;
        }

        const results = feedData.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Log the results to verify user IDs
        console.log("Search results:", results);

        if (results.length > 0) {
            setSearchResults(results);
            setErrorMessage("");
            setIsResultVisible(true);
        } else {
            setSearchResults([]);
            setErrorMessage("User not found.");
            setIsResultVisible(true);
        }
    };

    // Update the handleProfileClick function to verify the user ID before navigation
    const handleProfileClick = (userId) => {
        console.log("Search result user:", searchResults.find(user => user.id === userId));
        console.log("Navigating to profile with ID:", userId);
        
        // Verify the user exists in the users collection
        const verifyAndNavigate = async () => {
            try {
                // Check if the user document exists
                const userDoc = await getDoc(doc(db, "users", userId));
                
                if (userDoc.exists()) {
                    console.log("User document found, navigating to profile");
                    navigate(`/profile/${userId}`);
                } else {
                    console.error("User document not found in 'users' collection, checking uid field");
                    
                    // If the document doesn't exist directly, it might be that the ID is different
                    // Try to find the user by checking the 'uid' field in documents
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("uid", "==", userId));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const actualUserId = querySnapshot.docs[0].id;
                        console.log("Found user by uid field, actual document ID:", actualUserId);
                        navigate(`/profile/${actualUserId}`);
                    } else {
                        console.error("User not found in 'users' collection");
                        alert("User profile not found");
                    }
                }
            } catch (error) {
                console.error("Error verifying user:", error);
                // Navigate anyway as fallback
                navigate(`/profile/${userId}`);
            } finally {
                setIsResultVisible(false);
                setSearchQuery("");
            }
        };
        
        verifyAndNavigate();
    };

    const handleClose = () => {
        setIsResultVisible(false);
        setSearchQuery("");
    };

    return (
        <div className="stylesearch-container">
            <div className="stylesearch-bar">
                <input
                    type="text"
                    placeholder="Search Designers"
                    className="stylesearch-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Search Designers"
                />
                <button className="stylesearch-button" onClick={handleSearch}>
                    <Search className="stylesearch-icon" />
                </button>
            </div>

            {isResultVisible && (
                <div className="search-result-container">
                    {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                            <div 
                                key={user.id}
                                className="search-result"
                                onClick={() => handleProfileClick(user.id)} 
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={user.avatar || "/dp.jpg"}
                                    alt="avatar"
                                    className="search-result-avatar"
                                />
                                <div className="search-result-info">
                                    <p>{user.name}</p>
                                    <p className="search-result-email">{user.email}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-result">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <button className="close-button" onClick={handleClose}>
                        <X className="close-icon" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default StyleSearchBar;