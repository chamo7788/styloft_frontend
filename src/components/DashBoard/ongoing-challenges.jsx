import "/src/assets/css/DashBoard/ongoing-challenges.css";

export default function OngoingChallenges() {
  const challenges = [
    {
      id: 1,
      title: "Summer Collection Challenge",
      deadline: "Apr 15, 2023",
      daysLeft: 7,
      progress: 65,
      prize: "$1,000",
    },
    {
      id: 2,
      title: "Sustainable Fashion Contest",
      deadline: "May 2, 2023",
      daysLeft: 24,
      progress: 30,
      prize: "$750",
    },
    {
      id: 3,
      title: "Streetwear Design Battle",
      deadline: "Apr 22, 2023",
      daysLeft: 14,
      progress: 45,
      prize: "$500",
    },
  ];

  return (
    <div className="ongoing-challenges">
      <div className="card-header">
        <h3 className="card-title">Ongoing Challenges</h3>
        <button className="view-all-btn">
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>
      </div>
      <div className="card-content">
        <div className="challenge-list">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="challenge-item">
              <div className="challenge-header">
                <h4 className="challenge-title">{challenge.title}</h4>
                <div className="challenge-prize">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                  <span>{challenge.prize}</span>
                </div>
              </div>
              <div className="challenge-info">
                <div className="challenge-deadline">
                  <span>{challenge.deadline}</span>
                </div>
                <div className="challenge-days-left">
                  <span>{challenge.daysLeft} days left</span>
                </div>
              </div>
              <div className="challenge-progress">
                <div className="progress-info">
                  <span>Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${challenge.progress}%` }}></div>
                </div>
              </div>
              <button className="continue-btn">Continue Design</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
