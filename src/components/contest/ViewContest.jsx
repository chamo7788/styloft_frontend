import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import "../../assets/css/contest/contest.css";
import ContestCards from "./ContestCard";

const Button = ({ children, className, onClick }) => (
    <button className={`button ${className}`} onClick={onClick}>{children}</button>
);

const DesignContestPage = () => {
    const [contests, setContests] = useState([]);
    const [isBannerFixed, setIsBannerFixed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const contestCardsRef = useRef(null);

    const fetchContests = async (query = "") => {
        try {
            const url = query ? `http://localhost:3000/contest/search?query=${query}` : "http://localhost:3000/contest";
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch contests");
            }
            const data = await response.json();
            setContests(data);
        } catch (error) {
            console.error("Error fetching contests:", error);
        }
    };

    useEffect(() => {
        fetchContests();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (contestCardsRef.current) {
                const rect = contestCardsRef.current.getBoundingClientRect();
                if (rect.top <= 0) {
                    setIsBannerFixed(true);
                } else {
                    setIsBannerFixed(false);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        fetchContests(query);
    };

    return (
        <div className="page">
            <div className={`banner-container ${isBannerFixed ? "fixed" : ""}`}>
                <header className="banner">
                    <h1 className="banner-title">DESIGN CONTEST</h1>
                    <p className="banner-subtitle">"Unleash your creativity, design your legacy!"</p>
                    {!localStorage.getItem("authToken") && (
                        <Button className="button-signup" onClick={() => window.location.href = "/register"}>
                            SIGN UP
                        </Button>
                    )}
                </header>
            </div>

            <div className="search-bar-contest">
                <div className="search">
                    <input
                        type="text"
                        placeholder="Search Contests"
                        className="search-input-contest"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <Search className="search-icon" />
                </div>
            </div>

            <div>
                <Link to="/contest/add-contest" className="add-contest-link">
                    Add New Contest
                </Link>
            </div>

            <div className="scrollable-content" ref={contestCardsRef}>
                <ContestCards contests={contests} />
            </div>
        </div>
    );
};

export default DesignContestPage;