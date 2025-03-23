"use client"

import { useState, useEffect } from "react"
import {
  RotateCcw,
  RotateCw,
  Undo,
  Redo,
  Download,
  Save,
  Upload,
  Layers,
  X,
  Plus,
  Share2,
  HelpCircle,
  Lock,
} from "lucide-react"
import CloudinaryService from "../../utils/CloudinaryService"

function Toolbar({
  onRotate,
  onUndo,
  onRedo,
  onScreenshot,
  onScreenshotDownload,
  onSaveDesign,
  onLoadDesign,
  onToggleLayerManager,
  onShowUserGuide,
  canUndo,
  canRedo,
  showLayerManager,
}) {
  const [designs, setDesigns] = useState([])
  const [showDesigns, setShowDesigns] = useState(false)
  const [designName, setDesignName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentDesignId, setCurrentDesignId] = useState(null)
  const [publishLoading, setPublishLoading] = useState(false)
  const [publishError, setPublishError] = useState(null)
  const [subscriptionPlan, setSubscriptionPlan] = useState(null)
  const [showPremiumFeatureMsg, setShowPremiumFeatureMsg] = useState(false)

  // Check subscription status on component mount
  useEffect(() => {
    checkSubscriptionStatus()
  }, [])

  const checkSubscriptionStatus = () => {
    try {
      // Get subscription data from localStorage
      const subscriptionDataString = localStorage.getItem("subscriptionData")
      if (subscriptionDataString) {
        const subscriptionData = JSON.parse(subscriptionDataString)
        setSubscriptionPlan(subscriptionData.planName || "Free")
      } else {
        setSubscriptionPlan("Free")
      }
    } catch (error) {
      console.error("Error checking subscription status:", error)
      setSubscriptionPlan("Free")
    }
  }

  // Fix the premium user check - the logical OR operator was used incorrectly
  const isPremiumUser = subscriptionPlan === "Silver Plan" || subscriptionPlan === "Gold Plan"

  const showPremiumFeatureAlert = () => {
    setShowPremiumFeatureMsg(true)
    setTimeout(() => setShowPremiumFeatureMsg(false), 3000)
  }

  // Fix the rotation handler functions
  const handleRotateLeft = () => {
    console.log("Rotate left button clicked")
    if (onRotate) {
      onRotate("left")
    }
  }

  const handleRotateRight = () => {
    console.log("Rotate right button clicked")
    if (onRotate) {
      onRotate("right")
    }
  }

  async function fetchDesigns() {
    if (!isPremiumUser) {
      showPremiumFeatureAlert()
      return
    }

    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (!user || !user.uid) {
      setError("Please login to view your designs")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:3000/design/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId: user.uid,
        },
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`)
      }

      const designs = await response.json()
      console.log("Fetched designs:", designs)
      setDesigns(designs)
      setShowDesigns(true)
    } catch (error) {
      console.error("Error fetching designs:", error)
      setError("Failed to load designs. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  async function saveDesignToBackend(designData) {
    if (!isPremiumUser) {
      showPremiumFeatureAlert()
      return
    }

    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (!user || !user.uid) {
      alert("Please login to save your design")
      return
    }

    // If we're updating an existing design, use the current name as default
    const defaultName = currentDesignId ? designName : designData.model ? `${designData.model} design` : "My Design"

    // Prompt user for design name if not already set
    const name = designName || prompt("Enter a name for your design:", defaultName)
    if (!name) return // User cancelled

    setIsLoading(true)
    setError(null)

    try {
      // First take a screenshot and upload to Cloudinary
      const screenshotBlob = await onScreenshot(true) // Pass true to get the blob instead of downloading
      if (!screenshotBlob) {
        throw new Error("Failed to capture design preview")
      }

      // Upload to Cloudinary
      const uploadResult = await CloudinaryService.uploadImage(screenshotBlob)
      const imageUrl = uploadResult.url

      // Now save the design with the image URL
      let response
      let url
      let method

      // If we have a current design ID, update that design
      if (currentDesignId) {
        url = `http://localhost:3000/design/update/${currentDesignId}`
        method = "PUT"
        console.log("Updating existing design:", currentDesignId)
      } else {
        url = "http://localhost:3000/design/save"
        method = "POST"
        console.log("Creating new design")
      }

      response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          userId: user.uid,
        },
        body: JSON.stringify({
          designData,
          designName: name,
          imageUrl: imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`)
      }

      const result = await response.json()

      // Save the current design ID for future updates
      if (result.result && result.result.id) {
        setCurrentDesignId(result.result.id)
      }

      console.log(`Design ${currentDesignId ? "updated" : "saved"} successfully:`, result)
      setDesignName(name) // Save the name for next time
      alert(`Design ${currentDesignId ? "updated" : "saved"} successfully!`)
    } catch (error) {
      console.error(`Error ${currentDesignId ? "updating" : "saving"} design:`, error)
      setError(`Failed to ${currentDesignId ? "update" : "save"} design. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!isPremiumUser) {
      showPremiumFeatureAlert()
      return
    }

    const designData = onSaveDesign()
    saveDesignToBackend(designData)
  }

  const handleLoadDesignClick = () => {
    if (!isPremiumUser) {
      showPremiumFeatureAlert()
      return
    }

    fetchDesigns()
  }

  const handleDesignSelect = (design) => {
    console.log("Design selected:", design)

    if (!design || !design.designData) {
      console.error("Invalid design data:", design)
      return
    }

    try {
      // Pass the design data to the parent component
      onLoadDesign(design.designData)

      // Store the selected design's information
      setCurrentDesignId(design.id)
      setDesignName(design.designName || "")

      // Hide the designs list after selection
      setShowDesigns(false)

      console.log("Design loaded successfully, ID:", design.id)
    } catch (error) {
      console.error("Error loading design:", error)
      setError("Failed to load design. The format may be incompatible.")
    }
  }

  // Add a function to create a new design (reset current design ID)
  const handleNewDesign = () => {
    if (
      currentDesignId &&
      !window.confirm("This will start a new design. Any unsaved changes to the current design will be lost. Continue?")
    ) {
      return
    }

    setCurrentDesignId(null)
    setDesignName("")
    // Call any reset function from parent component if needed
    // onResetDesign();
  }

  // Add publish functionality
  const handlePublish = async () => {
    if (!isPremiumUser) {
      showPremiumFeatureAlert()
      return
    }

    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (!user || !user.uid) {
      alert("Please login to publish your design")
      return
    }

    setPublishLoading(true)
    setPublishError(null)

    try {
      // Take a screenshot if needed or use the existing one from the current design
      let imageUrl

      if (currentDesignId) {
        // If we have a current design, use its existing image URL
        const design = designs.find((d) => d.id === currentDesignId)
        imageUrl = design?.imageUrl
      }

      // If no imageUrl from existing design, generate a new screenshot
      if (!imageUrl) {
        const screenshotBlob = await onScreenshot(true)
        if (!screenshotBlob) {
          throw new Error("Failed to capture design preview")
        }

        // Upload to Cloudinary
        const uploadResult = await CloudinaryService.uploadImage(screenshotBlob)
        imageUrl = uploadResult.url
      }

      // Send to backend to publish as a design
      const response = await fetch("http://localhost:3000/design/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl: imageUrl,
          userId: user.uid,
          description: designName || "Style Studio design",
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Design published successfully:", result)
      alert("Design published successfully to your portfolio!")
    } catch (error) {
      console.error("Error publishing design:", error)
      setPublishError("Failed to publish design. Please try again.")
      alert("Failed to publish design. Please try again.")
    } finally {
      setPublishLoading(false)
    }
  }

  const handleScreenshotDownload = () => {
    if (!isPremiumUser) {
      showPremiumFeatureAlert()
      return
    }

    onScreenshotDownload()
  }

  return (
    <div className="canvas-toolbar">
      {showPremiumFeatureMsg && (
        <div className="premium-feature-alert">
          This feature requires a Silver Plan subscription. Please upgrade to access.
        </div>
      )}

      <div className="toolbar-group">
        <button className="toolbar-button" onClick={handleRotateLeft} title="Rotate Left">
          <RotateCcw size={16} />
        </button>
        <button className="toolbar-button" onClick={handleRotateRight} title="Rotate Right">
          <RotateCw size={16} />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className={`toolbar-button ${!canUndo ? "disabled" : ""}`}
          onClick={() => {
            console.log("Undo button clicked")
            if (canUndo && onUndo) onUndo()
          }}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          className={`toolbar-button ${!canRedo ? "disabled" : ""}`}
          onClick={() => {
            console.log("Redo button clicked")
            if (canRedo && onRedo) onRedo()
          }}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className={`toolbar-button ${showLayerManager ? "active" : ""}`}
          onClick={onToggleLayerManager}
          title="Toggle Layer Manager"
        >
          <Layers size={16} />
        </button>
        <button
          className={`toolbar-button ${!isPremiumUser ? "premium-locked" : ""}`}
          onClick={handleScreenshotDownload}
          title={isPremiumUser ? "Take Screenshot" : "Premium Feature - Take Screenshot"}
        >
          <Download size={16} />
          {!isPremiumUser && <Lock size={10} className="lock-icon" />}
        </button>
        <button
          className={`toolbar-button ${isLoading ? "loading" : ""} ${currentDesignId ? "has-update" : ""} ${!isPremiumUser ? "premium-locked" : ""}`}
          onClick={handleSave}
          title={isPremiumUser ? (currentDesignId ? "Update Design" : "Save Design") : "Premium Feature - Save Design"}
          disabled={isLoading || !isPremiumUser}
        >
          <Save size={16} />
          {currentDesignId && <span className="update-indicator"></span>}
          {!isPremiumUser && <Lock size={10} className="lock-icon" />}
        </button>
        <button
          className={`new-design-button ${isLoading ? "loading" : ""} ${!isPremiumUser ? "premium-locked" : ""}`}
          title={isPremiumUser ? "Load Design" : "Premium Feature - Load Design"}
          onClick={handleLoadDesignClick}
          disabled={isLoading || !isPremiumUser}
        >
          <Upload size={16} />
          Your Designs
          {!isPremiumUser && <Lock size={10} className="lock-icon" />}
        </button>

        {/* Publish button */}
        <button
          className={`new-design-button ${publishLoading ? "loading" : ""} ${!isPremiumUser ? "premium-locked" : ""}`}
          onClick={handlePublish}
          title={isPremiumUser ? "Publish to Your Portfolio" : "Premium Feature - Publish to Portfolio"}
          disabled={publishLoading || !isPremiumUser}
        >
          <Share2 size={16} />
          Publish Design
          {!isPremiumUser && <Lock size={10} className="lock-icon" />}
        </button>

        {/* Help button to show user guide */}
        <button className="toolbar-button" onClick={onShowUserGuide} title="Show User Guide">
          <HelpCircle size={16} />
        </button>
      </div>

      {currentDesignId && isPremiumUser && (
        <div className="current-design-indicator">
          <span className="design-name-label">Editing:</span>
          <span className="design-name-value">{designName}</span>
          <button className="new-design-button" onClick={handleNewDesign} title="Start New Design">
            <Plus size={12} />
            <span>New</span>
          </button>
        </div>
      )}

      {showDesigns && (
        <div className="designs-list">
          <div className="designs-list-header">
            <h3>Your Saved Designs</h3>
            <button className="close-button" onClick={() => setShowDesigns(false)}>
              <X size={16} />
            </button>
          </div>

          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading designs...</div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!isLoading && !error && designs.length > 0 ? (
            <div className="designs-items">
              {designs.map((design, index) => (
                <div
                  key={design.id || index}
                  className={`design-item ${design.id === currentDesignId ? "current-design" : ""}`}
                  onClick={() => handleDesignSelect(design)}
                >
                  <div className="design-name">{design.designName || `Design ${index + 1}`}</div>
                  <div className="design-date">
                    {new Date(design.createdAt).toLocaleDateString()} {new Date(design.createdAt).toLocaleTimeString()}
                  </div>
                  {design.id === currentDesignId && <div className="current-indicator">Current</div>}
                </div>
              ))}
            </div>
          ) : (
            !isLoading &&
            !error && (
              <div className="no-designs">
                <div className="no-designs-icon">📁</div>
                <div className="no-designs-text">No saved designs found</div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default Toolbar

