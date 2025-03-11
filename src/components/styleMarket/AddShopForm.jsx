"use client"

import { useState, useRef } from "react"
import { Upload, AlertCircle, Check } from "lucide-react"

export function AddShopForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "", // Image URL from Cloudinary
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0])
    }
  }

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0])
    }
  }

  const handleImageFile = async (file) => {
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload a JPG or PNG image.")
      showToast("Invalid file type", "Please upload a JPG or PNG image.", "error")
      return
    }

    // Show preview
    setImagePreview(URL.createObjectURL(file))
    setUploading(true)
    setErrorMessage("")

    const imageData = new FormData()
    imageData.append("file", file)
    imageData.append("upload_preset", "Styloft") // Replace with your actual preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/ds0xdh85j/image/upload", {
        method: "POST",
        body: imageData,
      })

      const data = await response.json()

      if (data.secure_url) {
        setFormData((prevData) => ({
          ...prevData,
          image: data.secure_url, // Save image URL
        }))
        setErrorMessage("")
        showToast("Image uploaded successfully", "Your image has been uploaded to the cloud.", "success")
      } else {
        setErrorMessage("Image upload failed. Try again.")
        showToast("Upload failed", "Image upload failed. Please try again.", "error")
      }
    } catch (error) {
      setErrorMessage("Error uploading image. Check your network.")
      showToast("Upload error", "Error uploading image. Check your network connection.", "error")
    } finally {
      setUploading(false)
    }
  }

  const showToast = (title, message, type = "success") => {
    // Create toast element
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
      <div class="toast-header">${title}</div>
      <div class="toast-body">${message}</div>
    `
    document.body.appendChild(toast)

    // Show and hide toast with animation
    setTimeout(() => {
      toast.classList.add("show")
      setTimeout(() => {
        toast.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 300)
      }, 3000)
    }, 100)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus(null)

    // Check if all fields are filled
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      setErrorMessage("Please fill all fields before submitting.")
      showToast("Form incomplete", "Please fill all fields before submitting.", "error")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        showToast("Success!", "Shop created successfully.", "success")

        // Reset the form
        setFormData({ name: "", description: "", price: "", image: "" })
        setImagePreview(null)

        // Clear success status after 3 seconds
        setTimeout(() => setSubmitStatus(null), 3000)
      } else {
        setSubmitStatus("error")
        setErrorMessage(`Failed to create shop: ${result.message}`)
        showToast("Submission failed", `Failed to create shop: ${result.message}`, "error")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("An error occurred while submitting the form.")
      showToast("Submission error", "An error occurred while submitting the form.", "error")
    }
  }

  return (
    <div className="add-shop-container">
      <h2 className="add-shop-title">Create a New Shop</h2>

      {submitStatus === "success" && (
        <div className="success-message">
          <Check className="success-icon" />
          <p>Shop created successfully!</p>
        </div>
      )}

      <form className="add-shop-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Designer Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="form-label">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-input"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Shop Image</label>
          <div
            className={`image-upload-area ${dragActive ? "active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              className="hidden-input"
              accept="image/png, image/jpeg"
            />
            <div className="upload-content">
              <div className="upload-icon-container">
                <Upload className="upload-icon" />
              </div>
              <p className="upload-text">{imagePreview ? "Change image" : "Upload shop image"}</p>
              <p className="upload-subtext">Drag and drop or click to browse</p>
            </div>
          </div>

          {uploading && (
            <div className="upload-status">
              <div className="spinner"></div>
              <span className="upload-status-text">Uploading...</span>
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <p>{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="preview-img" />
          </div>
        )}

        <button
          type="submit"
          className={`submit-button ${submitStatus === "success" ? "success" : submitStatus === "error" ? "error" : ""}`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : submitStatus === "success" ? "Created Successfully!" : "Create Shop"}
        </button>
      </form>
    </div>
  )
}

