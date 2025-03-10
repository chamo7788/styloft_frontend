"use client"

import { useState, useRef } from "react"
import { Image, Upload, Trash2, Edit2 } from "lucide-react"

function LogoUploader({ onAddLogo, logoElements, onRemoveLogo, onUpdateLogo }) {
  const [logoName, setLogoName] = useState("")
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoSize, setLogoSize] = useState(1)
  const [selectedLogoIndex, setSelectedLogoIndex] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Preview the image
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoFile(e.target.result)
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddLogo = () => {
    if (logoFile) {
      // Default position for front of shirt
      const position = [0, 0, 0.51] // Slightly in front of the model and text

      onAddLogo({
        name: logoName || "Logo",
        image: logoFile,
        size: logoSize,
        position,
        rotation: [0, 0, 0],
      })

      // Reset form
      resetForm()
    }
  }

  const handleEditLogo = (index) => {
    const logo = logoElements[index]
    setLogoName(logo.name)
    setLogoFile(logo.image)
    setLogoPreview(logo.image)
    setLogoSize(logo.size)
    setSelectedLogoIndex(index)
    setIsEditing(true)
  }

  const handleUpdateLogo = () => {
    if (selectedLogoIndex !== null && logoFile) {
      const updatedLogo = {
        ...logoElements[selectedLogoIndex],
        name: logoName || "Logo",
        image: logoFile,
        size: logoSize,
      }

      onUpdateLogo(selectedLogoIndex, updatedLogo)

      // Reset form
      resetForm()
    }
  }

  const resetForm = () => {
    setLogoName("")
    setLogoFile(null)
    setLogoPreview(null)
    setLogoSize(1)
    setIsEditing(false)
    setSelectedLogoIndex(null)
  }

  return (
    <div>
      <div className="logo-uploader">
        <div className="logo-uploader-header">
          <h3 className="logo-uploader-title">
            <Image size={16} className="logo-icon" />
            {isEditing ? "Edit Logo" : "Add Logo"}
          </h3>
        </div>

        <div className="logo-input-group">
          <input
            type="text"
            value={logoName}
            onChange={(e) => setLogoName(e.target.value)}
            placeholder="Logo name (optional)"
            className="logo-name-input"
          />
        </div>

        <div className="logo-file-upload">
          <div className="logo-preview-container">
            {logoPreview ? (
              <div className="logo-preview">
                <img src={logoPreview || "/placeholder.svg"} alt="Logo preview" />
                <button
                  className="logo-preview-remove"
                  onClick={() => {
                    setLogoFile(null)
                    setLogoPreview(null)
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="logo-upload-placeholder" onClick={() => fileInputRef.current.click()}>
                <Upload size={24} />
                <span>Click to upload logo</span>
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden-input" />

          {!logoPreview && (
            <button className="logo-upload-button" onClick={() => fileInputRef.current.click()}>
              Select Image
            </button>
          )}
        </div>

        <div className="logo-controls">
          <div className="logo-control">
            <label className="logo-control-label">Size</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={logoSize}
              onChange={(e) => setLogoSize(Number(e.target.value))}
              className="logo-range"
              disabled={!logoPreview}
            />
            <span className="logo-value">{logoSize.toFixed(1)}x</span>
          </div>
        </div>

        <div className="logo-actions">
          {isEditing ? (
            <>
              <button className="logo-update-button" onClick={handleUpdateLogo} disabled={!logoFile}>
                Update Logo
              </button>
              <button className="logo-cancel-button" onClick={resetForm}>
                Cancel
              </button>
            </>
          ) : (
            <button className="logo-add-button" onClick={handleAddLogo} disabled={!logoFile}>
              Add Logo to Model
            </button>
          )}
        </div>
      </div>

      {logoElements && logoElements.length > 0 && (
        <div className="logo-elements">
          <h3 className="logo-elements-title">Logo Elements</h3>
          <div className="logo-elements-list">
            {logoElements.map((element, index) => (
              <div key={index} className={`logo-element ${selectedLogoIndex === index ? "logo-element-selected" : ""}`}>
                <div className="logo-element-preview">
                  <img src={element.image || "/placeholder.svg"} alt={element.name} />
                </div>
                <div className="logo-element-info">
                  <span className="logo-element-name">{element.name}</span>
                </div>
                <div className="logo-element-actions">
                  <button className="logo-element-edit" onClick={() => handleEditLogo(index)}>
                    <Edit2 size={14} />
                  </button>
                  <button className="logo-element-remove" onClick={() => onRemoveLogo(index)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LogoUploader

