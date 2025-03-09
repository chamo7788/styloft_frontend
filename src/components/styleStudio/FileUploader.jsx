"use client"

import { useRef } from "react"

function FileUploader({ label, accept, onChange, preview }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="file-uploader">
      <label className="file-label">{label}</label>
      <div className="file-controls">
        <button className="file-button" onClick={() => fileInputRef.current.click()}>
          Choose File
        </button>
        <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden-input" />
        {preview && (
          <div className="file-preview">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="preview-image" />
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUploader

