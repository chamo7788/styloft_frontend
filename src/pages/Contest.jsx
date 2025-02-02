import React from "react";
import { Search } from "lucide-react";
import "../assets/css/contest/contest.css"; // Import the CSS file

// Card Component
const Card = ({ children }) => (
  <div className="card">
    {children}
  </div>
);

// Card Content Component
const CardContent = ({ children }) => (
  <div className="card-content">{children}</div>
);

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
    {/* Banner Section */}
    <header className="banner">
        <h1 className="banner-title">DESIGN CONTEST</h1>
        <p className="banner-subtitle">"Unleash your creativity, design your legacy!"</p>
        <Button className="button-signup" onClick={() => window.location.href = '/register'}>SIGN UP</Button>
    </header>

    {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Contests"
            className="search-input"
          />
          <Search className="search-icon" />
        </div>
      </div>

      {/* Contest Cards */}
      <div className="contest-cards">
        {contests.map((contest) => (
          <Card key={contest.id}>
            <img
              src={contest.image}
              alt="Contest Banner"
              className="contest-image"
            />
            <CardContent>
              <p className="contest-description">{contest.description}</p>
              <div className="contest-info">
                <span className="contest-designers">👤 {contest.designers} Designers</span>
                <span className="contest-designs">🌟 {contest.designs} Designs</span>
                <span className="contest-prize">{contest.prize}</span>
              </div>
              <Button className="button-enter">Enter Contest</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DesignContestPage;