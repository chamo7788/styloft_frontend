import React from "react";
import "../../assets/css/DashBoard/past-submissions.css";

export default function PastSubmissions() {
  const submissions = [
    {
      id: 1,
      title: "Urban Eco Jacket",
      challenge: "Sustainable Winter Collection",
      date: "Jan 15, 2023",
      image: "/placeholder.svg?height=80&width=80",
      result: "Winner",
      views: 342,
    },
    {
      id: 2,
      title: "Minimalist Evening Dress",
      challenge: "Formal Wear Challenge",
      date: "Dec 10, 2022",
      image: "/placeholder.svg?height=80&width=80",
      result: "Runner-up",
      views: 287,
    },
    {
      id: 3,
      title: "Casual Summer Set",
      challenge: "Beach Collection",
      date: "Aug 22, 2022",
      image: "/placeholder.svg?height=80&width=80",
      result: "Finalist",
      views: 215,
    },
  ];

  return (
    <div className="past-submission">
      <div className="past-submission-cardHeader">
        <h3 className="past-submission-cardTitle">Past Submissions</h3>
        <button className="past-submission-viewAllBtn">
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
      <div className="past-submission-cardContent">
        <div className="past-submission-submissionList">
          {submissions.map((submission) => (
            <div key={submission.id} className="past-submission-submissionItem">
              <div className="past-submission-submissionImage">
                <img
                  src={submission.image || "/placeholder.svg"}
                  alt={submission.title}
                  className="past-submission-designImage"
                />
              </div>
              <div className="past-submission-submissionDetails">
                <h4 className="past-submission-submissionTitle">{submission.title}</h4>
                <p className="past-submission-submissionChallenge">{submission.challenge}</p>
                <div className="past-submission-submissionInfo">
                  <span className="past-submission-submissionDate">{submission.date}</span>
                  <div className="past-submission-submissionViews">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>{submission.views}</span>
                  </div>
                </div>
              </div>
              <div className="past-submission-submissionResult">
                <span
                  className={`past-submission-resultBadge ${
                    submission.result === "Winner" ? "past-submission-winner" : "past-submission-runnerUp"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                  {submission.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
