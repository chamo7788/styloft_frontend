import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { collection, getDocs, query, where, limit, startAt, endAt, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../../assets/css/StyleSociety/styleSearchBar.css";

export function StyleSearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch all users when component mounts
    useEffect(() => {
        fetchAllUsers();
    }, []);

    // Improved fetchAllUsers function with better error handling and debug info
    const fetchAllUsers = async () => {
        setIsLoading(true);
        try {
            // Get a reference to the users collection
            const usersRef = collection(db, "users");
            
            console.log("Starting to fetch all users...");
            
            // Create a query with no filters to get all users
            // Don't order or filter initially to avoid index issues
            const usersQuery = query(usersRef);
            
            // Execute the query
            const querySnapshot = await getDocs(usersQuery);
            
            console.log(`Retrieved ${querySnapshot.size} users from Firestore`);
            
            // Process the results
            const users = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                console.log(`Processing user: ${doc.id}`, userData);
                
                // Add each user to our array
                users.push({
                    id: doc.id,
                    name: userData.displayName || userData.name || "User",
                    photoURL: userData.photoURL || "/dp.jpg",
                    profession: userData.profession || "",
                    uid: userData.uid || doc.id
                });
            });
            
            console.log(`Processed ${users.length} users successfully`);
            
            if (users.length === 0) {
                console.warn("No users found in the database. Check Firestore permissions and data.");
            }
            
            setAllUsers(users);
            // Initially set search results to all users
            setSearchResults(users);
        } catch (error) {
            console.error("Error fetching all users:", error);
            alert(`Failed to load users: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Search in Firestore when search query changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch();
            } else {
                // When search is cleared, show all users
                setSearchResults(allUsers);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, allUsers]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        // Show results as soon as the user starts typing or when input is focused
        setIsResultVisible(true);
    };

    const performSearch = async () => {
        if (!searchQuery.trim()) {
            // If search is empty, show all users
            setSearchResults(allUsers);
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            console.log("Searching for:", searchQuery);
            
            // First try to filter locally
            const lowercaseQuery = searchQuery.toLowerCase();
            const filteredUsers = allUsers.filter(user => 
                user.name.toLowerCase().includes(lowercaseQuery) ||
                (user.profession && user.profession.toLowerCase().includes(lowercaseQuery))
            );
            
            if (filteredUsers.length > 0) {
                console.log("Found users by local filtering:", filteredUsers.length);
                setSearchResults(filteredUsers);
                return;
            }
            
            // If local filtering doesn't yield results, search in Firestore
            const usersRef = collection(db, "users");
            
            // Create a case-insensitive search query
            const startsWithQuery = query(
                usersRef,
                orderBy("displayName"),
                startAt(searchQuery),
                endAt(searchQuery + '\uf8ff'),
                limit(20)
            );
            
            const querySnapshot = await getDocs(startsWithQuery);
            const users = [];
            
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                users.push({
                    id: doc.id,
                    name: userData.displayName || userData.name || "User",
                    photoURL: userData.photoURL || "/dp.jpg",
                    profession: userData.profession || "",
                    uid: userData.uid || doc.id
                });
            });
            
            console.log("Found users by Firestore query:", users.length);
            setSearchResults(users);
            
            if (users.length === 0) {
                // As a last resort, try a more general approach
                const allUsersQuery = query(
                    usersRef,
                    orderBy("displayName"),
                    limit(50)
                );
                
                const allUsersSnapshot = await getDocs(allUsersQuery);
                const allUsersResults = [];
                
                allUsersSnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.displayName && 
                        userData.displayName.toLowerCase().includes(searchQuery.toLowerCase())) {
                        allUsersResults.push({
                            id: doc.id,
                            name: userData.displayName || "User",
                            photoURL: userData.photoURL || "/dp.jpg",
                            profession: userData.profession || "",
                            uid: userData.uid || doc.id
                        });
                    }
                });
                
                console.log("Fallback search results:", allUsersResults.length);
                
                if (allUsersResults.length > 0) {
                    setSearchResults(allUsersResults);
                } else {
                    setSearchResults([]);
                    setErrorMessage("No users found matching your search.");
                }
            }
        } catch (error) {
            console.error("Error searching users:", error);
            setErrorMessage(`An error occurred while searching: ${error.message}`);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        performSearch();
    };

    const handleProfileClick = (userId) => {
        console.log("Navigating to profile with ID:", userId);
        navigate(`/profile/${userId}`);
        setIsResultVisible(false);
        setSearchQuery("");
    };

    const handleClose = () => {
        setIsResultVisible(false);
        setSearchQuery("");
    };

    // Show all users when input is focused
    const handleInputFocus = () => {
        setIsResultVisible(true);
        // If no search query, show all users
        if (!searchQuery.trim()) {
            setSearchResults(allUsers);
        }
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.stylesearch-container')) {
                setIsResultVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    onFocus={handleInputFocus}
                />
                <button className="stylesearch-button" onClick={handleSearch}>
                    <Search className="stylesearch-icon" />
                </button>
            </div>

            {isResultVisible && (
                <div className="search-result-container">
                    {isLoading ? (
                        <div className="loading-indicator">
                            <p>Loading profiles...</p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((user) => (
                            <div 
                                key={user.id}
                                className="search-result"
                                onClick={() => handleProfileClick(user.id)} 
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={user.photoURL || "/dp.jpg"}
                                    alt="avatar"
                                    className="search-result-avatar"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/dp.jpg";
                                    }}
                                />
                                <div className="search-result-info">
                                    <p className="search-result-name">{user.name}</p>
                                    {user.profession && (
                                        <p className="search-result-profession">{user.profession}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-result">
                            <p>{errorMessage || "No users found"}</p>
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