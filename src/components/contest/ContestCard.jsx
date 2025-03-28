import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Users, Star, ArrowRight } from "lucide-react";
import "@/assets/css/contest/contest.css";

// Card Component
const Card = ({ children }) => <div className="contest-card">{children}</div>;

// Card Content Component
const CardContent = ({ children }) => <div className="contest-card-content">{children}</div>;

// Button Component
const Button = ({ children, className, onClick }) => (
  <button className={`contest-button ${className}`} onClick={onClick}>
    <span>{children}</span>
    <ArrowRight className="button-icon" size={16} />
  </button>
);

const ContestCards = ({ contests }) => {
  const navigate = useNavigate(); // React Router Navigation Hook
  const [submissionCounts, setSubmissionCounts] = useState({});
  const [designerCounts, setDesignerCounts] = useState({});

  useEffect(() => {
    // Fetch submission counts from the backend
    const fetchSubmissionCounts = async () => {
      try {
        const response = await fetch('http://localhost:3000/submission/count-by-contest');
        const data = await response.json();
        const counts = data.reduce((acc, item) => {
          acc[item.contestId] = item.count;
          return acc;
        }, {});
        setSubmissionCounts(counts);
      } catch (error) {
        console.error('Error fetching submission counts:', error);
      }
    };

    fetchSubmissionCounts();

    // Fetch designer counts from the backend
    const fetchDesignerCounts = async () => {
      try {
        const response = await fetch('http://localhost:3000/submission/designers-by-contest');
        const data = await response.json();
        const counts = data.reduce((acc, item) => {
          acc[item.contestId] = item.count;
          return acc;
        }, {});
        setDesignerCounts(counts);
      } catch (error) {
        console.error('Error fetching designer counts:', error);
      }
    };

    fetchDesignerCounts();
  }, []);

  if (!contests || contests.length === 0) {
    return (
      <div className="no-contests">
        <div className="no-contests-icon">🏆</div>
        <p>No contests available at the moment.</p>
        <p className="no-contests-sub">Check back soon or create your own!</p>
      </div>
    );
  }

  return (
    <div className="contest-cards-grid">
      {contests.map((contest) => (
        <Card key={contest.id}>
          <div className="contest-card-image-container">
            <img src={contest.image || "/placeholder.svg"} alt="Contest Banner" className="contest-card-image" />
            <div className="contest-card-badge">${contest.prize}</div>
          </div>
          <CardContent>
            <h3 className="contest-card-title">{contest.title || "Design Contest"}</h3>
            <p className="contest-card-description">{contest.description}</p>
            <div className="contest-card-info">
              <div className="contest-card-stat">
                <Users size={16} className="contest-card-icon" />
                <span>{designerCounts[contest.id] || 0} Designers</span>
              </div>
              <div className="contest-card-stat">
                <Star size={16} className="contest-card-icon" />
                <span>{submissionCounts[contest.id] || 0} Designs</span>
              </div>
              <div className="contest-card-stat">
                <Trophy size={16} className="contest-card-icon trophy-icon" />
                <span>${contest.prize}</span>
              </div>
            </div>
            <Button
              className="contest-card-button"
              onClick={() => window.open(`/contest/${contest.id}`, "_blank", "noopener,noreferrer")}
            >
              Enter Contest
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContestCards;