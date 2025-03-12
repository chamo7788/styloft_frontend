"use client"

import { useState, useRef } from "react"
import { Upload, AlertCircle, Check } from "lucide-react"

export function AddShopForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "", // Image URL from ImgHippo
  });

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
    }));

    // If updating image field, update preview
    if (name === "image") {
      setImagePreview(value);
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
    e.preventDefault();

    // ✅ Check if all fields are filled
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      alert("Please fill all fields before submitting.");
      return;
    }

    console.log("Submitting Form Data:", formData); // Debugging

    try {
      const response = await fetch("http://localhost:3000/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Shop Created Successfully!");

        // ✅ Reset the form
        setFormData({ name: "", description: "", price: "", image: "" });
        setImagePreview(null);
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
          <label htmlFor="image" className="form-label">
            Image URL (Upload to ImgHippo)
          </label>
          <input
            type="text"
            id="image"
            name="image"
            placeholder="Paste ImgHippo image link here"
            value={formData.image}
            onChange={handleChange}
            className="form-input"
            required
          />
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

