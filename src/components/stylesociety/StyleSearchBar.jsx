import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
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

    const handleProfileClick = (userId) => {
        navigate(`Profile/${userId}`); // Navigate to the profile page with userId
        setIsResultVisible(false);
        setSearchQuery("");
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