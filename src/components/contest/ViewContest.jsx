import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import "../../assets/css/contest/contest.css";
import ContestCards from "./ContestCard";

// Button Component
const Button = ({ children, className, onClick }) => (
    <button className={`button ${className}`} onClick={onClick}>{children}</button>
);

const DesignContestPage = () => {
    const [contests, setContests] = useState([]);

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

    return (
        <div className="page">
            <header className="banner">
                <h1 className="banner-title">DESIGN CONTEST</h1>
                <p className="banner-subtitle">"Unleash your creativity, design your legacy!"</p>
                {!localStorage.getItem('authToken') && (
                    <Button className="button-signup" onClick={() => window.location.href = '/register'}>SIGN UP</Button>
                )}
            </header>

            <div className="search-bar-container">
                <div className="search-bar">
                    <input type="text" placeholder="Search Contests" className="search-input" />
                    <Search className="search-icon" />
                </div>
            </div>

            <div>
                <Link to="/contest/add-contest" className="add-contest-link">
                    Add New Contest
                </Link>
            </div>

            {/* Pass contests as a prop */}
            <ContestCards contests={contests} />
        </div>
    );
};

export default DesignContestPage;