"use client"

import { useState } from "react"
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

  async function fetchDesigns() {
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
    const designData = onSaveDesign()
    saveDesignToBackend(designData)
  }

  const handleLoadDesignClick = () => {
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

  return (
    <div className="canvas-toolbar">
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={() => onRotate("left")} title="Rotate Left">
          <RotateCcw size={16} />
        </button>
        <button className="toolbar-button" onClick={() => onRotate("right")} title="Rotate Right">
          <RotateCw size={16} />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className={`toolbar-button ${!canUndo ? "disabled" : ""}`}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          className={`toolbar-button ${!canRedo ? "disabled" : ""}`}
          onClick={onRedo}
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
        <button className="toolbar-button" onClick={onScreenshotDownload} title="Take Screenshot">
          <Download size={16} />
        </button>
        <button
          className={`toolbar-button ${isLoading ? "loading" : ""} ${currentDesignId ? "has-update" : ""}`}
          onClick={handleSave}
          title={currentDesignId ? "Update Design" : "Save Design"}
          disabled={isLoading}
        >
          <Save size={16} />
          {currentDesignId && <span className="update-indicator"></span>}
        </button>
        <button
          className={`new-design-button ${isLoading ? "loading" : ""}`}
          title="Load Design"
          onClick={handleLoadDesignClick}
          disabled={isLoading}
        >
          <Upload size={16} />
          Your Designs
        </button>

        {/* New Publish button */}
        <button
          className={`new-design-button ${publishLoading ? "loading" : ""}`}
          onClick={handlePublish}
          title="Publish to Your Portfolio"
          disabled={publishLoading}
        >
          <Share2 size={16} />
          Publish Design
        </button>

        {/* Help button to show user guide */}
        <button className="toolbar-button" onClick={onShowUserGuide} title="Show User Guide">
          <HelpCircle size={16} />
        </button>
      </div>

      {currentDesignId && (
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

