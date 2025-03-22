import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import "../../assets/css/RequestForm/GarmentRequestForm.css";
import brandixImage from "../../assets/images/brandix.png";
import Hirdaramani from "../../assets/images/Hirdaramani.png";
import MAS from "../../assets/images/MAS.png";
import EAM from "../../assets/images/EAM.png";
import StarGarments from "../../assets/images/StarGarments.png";
import { auth } from "../../firebaseConfig";

const GarmentRequestForm = () => {
  const [selectedGarment, setSelectedGarment] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch authenticated user details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid, // Store user ID
          displayName: user.displayName || "Anonymous",
          photoURL: user.photoURL || "/placeholder.svg",
        });
        setCurrentUserId(user.uid);
      } else {
        setCurrentUser(null);
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Garment options with images
  const garments = [
    { value: "tshirt", label: "Brandix", image: brandixImage },
    { value: "jeans", label: "Hirdaramani", image: Hirdaramani },
    { value: "jacket", label: "MAS Holdings", image: MAS },
    { value: "dress", label: "EAM Maliban Textile", image: EAM },
    { value: "sweater", label: "Star Garments", image: StarGarments },
  ];

  const handleGarmentSelect = (garment) => {
    setSelectedGarment(garment);
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    if (selectedGarment && requestText) {
      setSubmitted(true);
    }
  };

  return (
    <div className="garment-form-container">
      <h1 className="Garmentform-title">Garment Request Form</h1>

      <div className="Garmentform-content">
        <div className="Garmentform-group">
          <label className="Garmentform-label">Select a Garment</label>
          <div className="Garmentcustom-select">
            <button className="Garmentselect-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {selectedGarment
                ? garments.find((g) => g.value === selectedGarment)?.label
                : "Select garment..."}
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
                        <img src={garment.image || "/placeholder.svg"} alt={garment.label} className="garment-image" />
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

        <button className="Garmentsubmit-button" onClick={handleSubmit}>
          Submit Request
        </button>
      </div>

      {submitted && currentUser && (
        <div className="Garmentresult-container">
          <p className="Garmentdetail-label">Dashboard Profile:</p>
          <br />
          <div className="Garmentuser-info">
            <div className="Garmentavatar">
              <img src={currentUser.photoURL} alt={currentUser.displayName} className="garment-user-image" />
            </div>
            <div className="Garmentusername">
              <p>{currentUser.displayName}</p>
            </div>
          </div>

          <div className="Garmentrequest-details">
            <p className="Garmentdetail-label">Request:</p>
            <p className="Garmentrequest-text">{requestText}</p>
          </div>
        </div>
      )}

      {submitted && currentUser && (
        <div className="Garmentresult-container">
          <p className="Garmentdetail-label">Designer Profile:</p>
          <br />
          <div className="Garmentrequest-details">
            <p className="Garmentdetail-label">Selected Garment:</p>
            <div className="Garmentselected-garment">
              <img
                src={garments.find((g) => g.value === selectedGarment)?.image || "/placeholder.svg"}
                alt={selectedGarment}
                className="garment-image"
              />
              <span>{garments.find((g) => g.value === selectedGarment)?.label}</span>
            </div>
            <p className="Garmentdetail-label">Request:</p>
            <p className="Garmentrequest-text">{requestText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarmentRequestForm;
