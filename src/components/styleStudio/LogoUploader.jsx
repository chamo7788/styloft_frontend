"use client"
import { Upload, Trash2, Edit2 } from "lucide-react"
import AILogoGenerator from "./AILogoGenerator" // Import the new component

const LogoUploader = ({ onAddLogo, logoElements, onRemoveLogo, onUpdateLogo, selectedLogoIndex, onLogoSelect }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Create an image to get dimensions
        const img = new Image()
        img.onload = () => {
          // Calculate aspect ratio
          const aspectRatio = img.width / img.height
          let width = 100
          let height = 100

          // Maintain aspect ratio
          if (aspectRatio > 1) {
            height = width / aspectRatio
          } else {
            width = height * aspectRatio
          }

          onAddLogo({
            image: e.target.result,
            x: 100, // Default position
            y: 100,
            width: width, // Size based on aspect ratio
            height: height,
            rotation: 0,
          })
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAILogoGenerated = (logoUrl) => {
    // Create an image to get dimensions
    const img = new Image()
    img.onload = () => {
      // Calculate aspect ratio
      const aspectRatio = img.width / img.height
      let width = 100
      let height = 100

      // Maintain aspect ratio
      if (aspectRatio > 1) {
        height = width / aspectRatio
      } else {
        width = height * aspectRatio
      }

      onAddLogo({
        image: logoUrl,
        x: 100, // Default position
        y: 100,
        width: width, 
        height: height,
        rotation: 0,
      })
    }
    img.src = logoUrl
  }

  return (
    <div className="logo-uploader">
      <h3 className="logo-uploader-title">Logo Elements</h3>
      
      {/* Existing upload button */}
      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="logo-upload" />
      <label htmlFor="logo-upload" className="logo-upload-button">
        <Upload size={16} />
        <span>Upload New Logo</span>
      </label>

      <div className="logo-elements-list">
        {logoElements.map((logo, index) => (
          <div
            key={index}
            className={`logo-element ${selectedLogoIndex === index ? "logo-element-selected" : ""}`}
            onClick={() => onLogoSelect(index)}
          >
            <div className="logo-preview-container">
              <img src={logo.image || "/placeholder.svg"} alt={`Logo ${index + 1}`} className="logo-preview" />
              {selectedLogoIndex === index && <div className="logo-selected-indicator"></div>}
            </div>
            <div className="logo-element-actions">
              <button
                className="logo-element-edit"
                onClick={(e) => {
                  e.stopPropagation()
                  onLogoSelect(index)
                }}
                title="Edit Logo"
              >
                <Edit2 size={16} />
              </button>
              <button
                className="logo-element-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveLogo(index)
                }}
                title="Remove Logo"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="logo-instructions">
        <p>Click on a logo to select it, then use the canvas to:</p>
        <ul>
          <li>
            <strong>Drag center:</strong> Move the logo
          </li>
          <li>
            <strong>Drag corners:</strong> Resize proportionally
          </li>
          <li>
            <strong>Drag top handle:</strong> Rotate freely
          </li>
        </ul>
        <p className="logo-tip">Tip: Hold Shift while resizing to maintain aspect ratio</p>
      </div>
    </div>
  )
}

export default LogoUploader

