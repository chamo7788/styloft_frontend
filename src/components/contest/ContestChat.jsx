"use client"

import { useState } from "react"

export function ContestChat() {
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [submissions, setSubmissions] = useState([
    // Dummy data for submissions
    { id: 1, title: "Submission 1", description: "Description 1" },
    { id: 2, title: "Submission 2", description: "Description 2" },
  ])

  const openSubmission = async (submissionId) => {
    const response = await fetch(`/api/submissions/${submissionId}`)
    const data = await response.json()
    setSelectedSubmission(data)
    loadMessages(submissionId)
  }

  const loadMessages = async (submissionId) => {
    const response = await fetch(`/api/submissions/${submissionId}/messages`)
    const data = await response.json()
    setMessages(data)
  }

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      const response = await fetch(`/api/submissions/${selectedSubmission.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: newMessage }),
        headers: { "Content-Type": "application/json" },
      })
      const message = await response.json()
      setMessages((prevMessages) => [...prevMessages, message])
      setNewMessage("")
    }
  }

  return (
    <div className="chat-content-container">
      <div className="chat-submissions">
        {submissions.map((submission) => (
          <div key={submission.id} onClick={() => openSubmission(submission.id)} className="submission-card">
            <h3>{submission.title}</h3>
            <p>{submission.description}</p>
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <div className="chat-container">
          <div className="chat-submission-details">
            <h4>{selectedSubmission.title}</h4>
            <p>{selectedSubmission.description}</p>
          </div>
          <div className="content-message-panel">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <strong>{message.senderName}</strong>: {message.content}
              </div>
            ))}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContestChat

