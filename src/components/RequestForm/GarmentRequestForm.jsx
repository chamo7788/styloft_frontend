import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import "../../assets/css/RequestForm/GarmentRequestForm.css"
import { db, auth } from "../../firebaseConfig"; 
import brandixImage from "../../assets/images/brandix.png"; 
import Hirdaramani from "../../assets/images/Hirdaramani.png"; 
import MAS from "../../assets/images/MAS.png"; 
import EAM from "../../assets/images/EAM.png"; 
import StarGarments from "../../assets/images/StarGarments.png";

// Keep the actual image imports and remove redundant image definitions
const GarmentRequestForm = () => {
  const [selectedGarment, setSelectedGarment] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [requestText, setRequestText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [submitMessage, setSubmitMessage] = useState({ text: "", type: "" })

  // Fetch authenticated user details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid, // Store user ID
          displayName: user.displayName || "Anonymous",
          photoURL: user.photoURL || "/placeholder.svg",
        })
        setCurrentUserId(user.uid)
      } else {
        setCurrentUser(null)
        setCurrentUserId(null)
      }
    })

    return () => unsubscribe()
  }, [])

  // Garment options with images
  const garments = [
    { value: "tshirt", label: "Brandix", image: brandixImage },
    { value: "jeans", label: "Hirdaramani", image: Hirdaramani },
    { value: "jacket", label: "MAS Holdings", image: MAS },
    { value: "dress", label: "EAM Maliban Textile", image: EAM },
    { value: "sweater", label: "Star Garments", image: StarGarments },
  ]

  const handleGarmentSelect = (garment) => {
    setSelectedGarment(garment)
    setIsDropdownOpen(false)
  }

  const handleSubmit = () => {
    if (!currentUser) {
      setSubmitMessage({ text: "Please log in to submit a request", type: "error" });
      return;
    }
    
    if (!selectedGarment) {
      setSubmitMessage({ text: "Please select a garment", type: "error" });
      return;
    }
    
    if (!requestText.trim()) {
      setSubmitMessage({ text: "Please enter request details", type: "error" });
      return;
    }

    // Create a new request object
    const newRequest = {
      id: Date.now(), // Use timestamp as a simple unique ID
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userPhoto: currentUser.photoURL,
      garment: selectedGarment,
      garmentLabel: garments.find((g) => g.value === selectedGarment)?.label,
      garmentImage: garments.find((g) => g.value === selectedGarment)?.image,
      requestText: requestText,
      date: new Date().toISOString(),
      status: "pending" // Adding a status field for tracking
    }

    // Get existing requests from localStorage
    const existingRequests = JSON.parse(localStorage.getItem("garmentRequests") || "[]")

    // Add new request to the array
    const updatedRequests = [newRequest, ...existingRequests]

    // Save to localStorage for persistence
    localStorage.setItem("garmentRequests", JSON.stringify(updatedRequests))
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("storage"));

    // Reset form
    setSelectedGarment("");
    setRequestText("");
    setSubmitMessage({ text: "Request submitted successfully!", type: "success" });
    setSubmitted(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSubmitMessage({ text: "", type: "" });
    }, 3000);
  }

  return (
    <div className="garment-form-container">
      <h1 className="Garmentform-title">Garment Request Form</h1>

      <div className="Garmentform-content">
        <div className="Garmentform-group">
          <label className="Garmentform-label">Select a Garment</label>
          <div className="Garmentcustom-select">
            <button className="Garmentselect-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {selectedGarment ? garments.find((g) => g.value === selectedGarment)?.label : "Select garment..."}
              <span className="Garmentdropdown-icon">▼</span>
            </button>

            {isDropdownOpen && (
              <div className="Garmentdropdown-menu">
                <input type="text" className="Garmentdropdown-search" placeholder="Search garment..." />
                <div className="Garmentdropdown-items">
                  {garments.map((garment) => (
                    <div
                      key={garment.value}
                      className={`Garmentdropdown-item ${selectedGarment === garment.value ? "selected" : ""}`}
                      onClick={() => handleGarmentSelect(garment.value)}
                    >
                      <div className="Garmentdropdown-item-content">
                        <img src={garment.image} alt={garment.label} className="garment-image" />
                        {garment.label}
                      </div>
                      {selectedGarment === garment.value && <span className="Garmentcheck-icon">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="Garmentform-group">
          <label className="Garmentform-label">Request Details</label>
          <textarea
            className="Garmentrequest-textarea"
            placeholder="Type your request here..."
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
          />
        </div>

        {submitMessage.text && (
          <div className={`submit-message ${submitMessage.type}`}>
            {submitMessage.text}
          </div>
        )}

        <button className="Garmentsubmit-button" onClick={handleSubmit}>
          Submit Request
        </button>
      </div>
    </div>
  )
}

export default GarmentRequestForm