"use client"
import { Upload, Trash2, Edit2 } from "lucide-react"

const LogoUploader = ({ onAddLogo, logoElements, onRemoveLogo, onUpdateLogo, selectedLogoIndex, onLogoSelect }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onAddLogo({ image: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="logo-uploader">
      <h3 className="logo-uploader-title">Logo Elements</h3>
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
            <img src={logo.image || "/placeholder.svg"} alt={`Logo ${index + 1}`} className="logo-preview" />
            <div className="logo-element-actions">
              <button
                className="logo-element-edit"
                onClick={(e) => {
                  e.stopPropagation()
                  onLogoSelect(index)
                }}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="logo-element-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveLogo(index)
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LogoUploader

