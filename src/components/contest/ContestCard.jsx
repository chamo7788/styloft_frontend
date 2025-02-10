import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/contest/contest.css";

// Card Component
const Card = ({ children }) => <div className="card">{children}</div>;

// Card Content Component
const CardContent = ({ children }) => <div className="card-content">{children}</div>;

// Button Component
const Button = ({ children, className, onClick }) => (
    <button className={`button ${className}`} onClick={onClick}>{children}</button>
);

const ContestCards = ({ contests }) => {
    const navigate = useNavigate(); // React Router Navigation Hook

    if (!contests || contests.length === 0) {
        return <p>No contests available.</p>;
    }

    return (
        <div className="contest-cards">
            {contests.map((contest) => (
                <Card key={contest.id}>
                    <img src={contest.image} alt="Contest Banner" className="contest-image" />
                    <CardContent>
                        <p className="contest-description">{contest.description}</p>
                        <div className="contest-info">
                            <span className="contest-designers">👤 {contest.designers} Designers</span>
                            <span className="contest-designs">🌟 {contest.designs} Designs</span>
                            <span className="contest-prize">{contest.prize}</span>
                        </div>
                        <Button className="button-enter" onClick={() => navigate(`/contest/${contest.id}`)}>
                            Enter Contest
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ContestCards;