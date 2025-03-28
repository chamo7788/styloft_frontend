import { useState, useEffect, useRef } from "react"
import { User, Send, ImageIcon, Clock } from "lucide-react"
import "@/assets/css/contest/SubmissionChatView.css"

export default function SubmissionChatView({ submission, contest, isContestCreator }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages()

    // Set up polling for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [submission.id])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      // Use the messages endpoint
      const response = await fetch(`https://styloftbackendnew-production.up.railway.app/messages/submission/${submission.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      // Make sure we have the current user
      if (!currentUser || !currentUser.uid) {
        console.error("User not logged in")
        alert("You must be logged in to send messages")
        return
      }

      const messageData = {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || "User",
        content: newMessage,
      }

      console.log("Sending message:", messageData)
      console.log("To submission ID:", submission.id)

      // Use the messages endpoint
      const response = await fetch(`https://styloftbackendnew-production.up.railway.app/messages/submission/${submission.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Failed to send message: ${errorText}`)
      }

      const newMessageData = await response.json()
      console.log("New message data:", newMessageData)

      // Add the new message to the list
      setMessages((prevMessages) => [...prevMessages, newMessageData])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      alert(`Error sending message: ${error.message}`)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="submission-chat-container">
      <div className="submission-chat-left">
        <div className="submission-image-wrapper">
          <img
            src={submission.fileUrl || "/placeholder.svg"}
            alt="Submission Design"
            className="submission-full-image"
          />
        </div>
        <div className="submission-details">
          <div className="submission-meta">
            <div className="submission-creator">
              <User size={16} className="meta-icon" />
              <span>Designer: {submission.userName}</span>
            </div>
            <div className="submission-date">
              <Clock size={16} className="meta-icon" />
              <span>Submitted: {new Date(submission.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
          {submission.message && (
            <div className="submission-message-box">
              <h4>Designer's Notes:</h4>
              <p>{submission.message}</p>
            </div>
          )}
        </div>
      </div>

      <div className="submission-chat-right">
        <div className="chat-header">
          <h3>{isContestCreator ? `Chat with ${submission.userName}` : `Chat with Contest Creator`}</h3>
          <p className="chat-subtitle">Discuss the submission details privately</p>
        </div>

        <div className="chat-messages">
          {loading && messages.length === 0 ? (
            <div className="chat-loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <ImageIcon size={32} />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.senderId === currentUser?.uid ? "sent" : "received"}`}
                >
                  <div className="message-content">
                    <div className="message-sender">{message.senderName}</div>
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">{formatTimestamp(message.timestamp)}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="chat-input-container">
          <textarea
            className="chat-input"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <button className="chat-send-button" onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

