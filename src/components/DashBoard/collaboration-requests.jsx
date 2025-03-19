import React from "react";
import "../../assets/css/DashBoard/collaboration.css";

export default function CollaborationRequests() {
  const requests = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Fashion Brand",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
      message: "Would like to collaborate on a summer collection",
      date: "2 days ago",
      status: "pending",
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Textile Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
      message: "Interested in co-designing eco-friendly fabrics",
      date: "5 days ago",
      status: "pending",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Photographer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      message: "Looking for designs to feature in an upcoming magazine",
      date: "1 week ago",
      status: "accepted",
    },
  ];

  return (
    <div className="collaboration-card">
      <div className="collaboration-cardHeader">
        <h3 className="collaboration-cardTitle">Collaboration Requests</h3>
        <button className="collaboration-viewAllBtn">
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
      <div className="collaboration-cardContent">
        <div className="collaboration-requestList">
          {requests.map((request) => (
            <div key={request.id} className="collaboration-requestItem">
              <div className="collaboration-requestHeader">
                <div className="collaboration-requestUser">
                  <div className="collaboration-userAvatar">
                    <img src={request.avatar || "/placeholder.svg"} alt={request.name} />
                  </div>
                  <div className="collaboration-userInfo">
                    <h4 className="collaboration-userName">{request.name}</h4>
                    <p className="collaboration-userRole">{request.role}</p>
                  </div>
                </div>
                <div className="collaboration-requestDate">
                  <span>{request.date}</span>
                </div>
              </div>
              <p className="collaboration-requestMessage">{request.message}</p>
              <div className="collaboration-requestActions">
                {request.status === "pending" ? (
                  <>
                    <button className="collaboration-acceptBtn">Accept</button>
                    <button className="collaboration-declineBtn">Decline</button>
                  </>
                ) : (
                  <span className="collaboration-statusBadge">
                    {request.status === "accepted" ? "Accepted" : "Declined"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
