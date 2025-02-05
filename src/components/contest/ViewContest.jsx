import React from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import "../../assets/css/contest/contest.css";
import ContestCards from "./ContestCard";

// Button Component
const Button = ({ children, className, onClick }) => (
    <button className={`button ${className}`} onClick={onClick}>{children}</button>
);

const DesignContestPage = () => {
    const contests = [
        {
            id: 1,
            image: "src/assets/images/Contest-2.jpg",
            description: "Calling all creative minds! Showcase your talent, redefine fashion, and let your designs steal the spotlight in our ultimate clothing design contest. The runway is yours—will you take it?",
            designers: 36,
            designs: 63,
            prize: "$120",
        },
        {
            id: 2,
            image: "src/assets/images/Contest-1.jpg",
            description: "Calling all creative minds! Showcase your talent, redefine fashion, and let your designs steal the spotlight in our ultimate clothing design contest. The runway is yours—will you take it?",
            designers: 36,
            designs: 63,
            prize: "$120",
        },
    ];

    return (
        <div className="page">
            <header className="banner">
                <h1 className="banner-title">DESIGN CONTEST</h1>
                <p className="banner-subtitle">"Unleash your creativity, design your legacy!"</p>
                <Button className="button-signup" onClick={() => window.location.href = '/register'}>SIGN UP</Button>
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
