"use client"

import { useState } from "react"
import { FaEye } from "react-icons/fa"
import "../../assets/css/RequestForm/ViewSentRequests.css"

const ViewSentRequests = () => {
  const [showRequests, setShowRequests] = useState(false)

  const handleClick = () => {
    setShowRequests(!showRequests)
  }

  // Function to get requests from localStorage
  const getSentRequests = () => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("garmentRequests") || "[]")
    }
    return []
  }

  const sentRequests = getSentRequests()

  return (
    <div className="reqView">
      <button onClick={handleClick} className="ViewSentBtn">
        <FaEye />
        {showRequests ? "Hide Sent Requests" : "View Sent Requests"}
      </button>

      {showRequests && (
        <div className="sentRequestsContainer">
          <h2 className="sentRequestsTitle">Your Sent Requests</h2>

          {sentRequests.length === 0 ? (
            <p className="noRequestsMessage">No requests have been sent yet.</p>
          ) : (
            <div className="requestsList">
              {sentRequests.map((request) => (
                <div key={request.id} className="requestItem">
                  <div className="requestHeader">
                    <div className="requestUser">
                      <img
                        src={request.userPhoto || "/placeholder.svg"}
                        alt={request.userName}
                        className="requestUserImage"
                      />
                      <div className="requestUserInfo">
                        <p className="requestUserName">{request.userName}</p>
                        <p className="requestDate">{new Date(request.date).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="requestGarment">
                  <p className="noRequestsMessage">Selected Garment:</p>
                  <br/>
                    <img
                      src={request.garmentImage || "/placeholder.svg"}
                      alt={request.garmentLabel}
                      className="requestGarmentImage"
                    />
                    <span className="requestGarmentName">{request.garmentLabel}</span>
                  </div>

                  <div className="requestContent">
                    <p className="requestText">Request: {request.requestText}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ViewSentRequests

