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
    const contestCardsRef = useRef(null);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await fetch("http://localhost:3000/contest");
                if (!response.ok) {
                    throw new Error("Failed to fetch contests");
                }
                const data = await response.json();
                setContests(data);
            } catch (error) {
                console.error("Error fetching contests:", error);
            }
        };

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
                    <input type="text" placeholder="Search Contests" className="search-input-contest" />
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
