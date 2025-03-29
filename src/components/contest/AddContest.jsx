import { useState, useRef } from "react"
import { Cloudinary } from "@cloudinary/url-gen"
import { format } from "date-fns"
import { CalendarIcon, Upload, ImageIcon, Trophy, Clock, AlertCircle } from "lucide-react"
import "@/assets/css/contest/addContest.css"

export function AddContestForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    deadline: "",
    image: "",
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [date, setDate] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const fileInputRef = useRef(null)
  const calendarRef = useRef(null)

  const cld = new Cloudinary({ cloud: { cloudName: "ds0xdh85j" } })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    setFormData((prevData) => ({
      ...prevData,
      deadline: format(selectedDate, "yyyy-MM-dd"),
    }))
    setCalendarOpen(false)
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
    // Simple toast implementation
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
      <div class="toast-header">${title}</div>
      <div class="toast-body">${message}</div>
    `
    document.body.appendChild(toast)
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
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (!user || !user.uid) {
      showToast("Authentication error", "You must be logged in to create a contest.", "error")
      return
    }

    if (!formData.image) {
      setErrorMessage("Please upload an image before submitting.")
      showToast("Image required", "Please upload an image before submitting.", "error")
      return
    }

    const contestData = {
      ...formData,
      createdBy: user.uid,
    }

    try {
      const response = await fetch("https://styloftbackendnew-production.up.railway.app/contest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contestData),
      })

      const result = await response.json()

      showToast("Contest created!", "Your contest has been successfully created.", "success")

      // Reset form after submission
      setFormData({
        title: "",
        description: "",
        prize: "",
        deadline: "",
        image: "",
      })
      setImagePreview(null)
      setDate(null)
    } catch (error) {
      showToast("Submission error", "There was an error creating your contest. Please try again.", "error")
    }
  }

  // Simple calendar component
  const renderCalendar = () => {
    if (!calendarOpen) return null

    const today = new Date()
    const currentMonth = date ? date.getMonth() : today.getMonth()
    const currentYear = date ? date.getFullYear() : today.getFullYear()

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentYear, currentMonth, i)
      const isDisabled = dayDate < today
      const isSelected =
        date && date.getDate() === i && date.getMonth() === currentMonth && date.getFullYear() === currentYear

      days.push(
        <div
          key={`day-${i}`}
          className={`calendar-day ${isDisabled ? "disabled" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => !isDisabled && handleDateSelect(dayDate)}
        >
          {i}
        </div>,
      )
    }

    return (
      <div className="calendar-popup" ref={calendarRef}>
        <div className="calendar-header">
          <button
            className="calendar-nav-btn"
            onClick={() => {
              const newDate = new Date(currentYear, currentMonth - 1, 1)
              setDate((prevDate) =>
                prevDate ? new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, prevDate.getDate()) : newDate,
              )
            }}
          >
            &lt;
          </button>
          <div className="calendar-title">
            {new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
          <button
            className="calendar-nav-btn"
            onClick={() => {
              const newDate = new Date(currentYear, currentMonth + 1, 1)
              setDate((prevDate) =>
                prevDate ? new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()) : newDate,
              )
            }}
          >
            &gt;
          </button>
        </div>
        <div className="calendar-days-header">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className="calendar-days-grid">{days}</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="contest-grid">
        <div className="form-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Create New Contest</h2>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit} className="contest-form">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Contest Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging title"
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
                    placeholder="Describe your contest in detail"
                    className="form-textarea"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prize" className="form-label">
                    Prize Amount ($)
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon">$</span>
                    <input
                      id="prize"
                      name="prize"
                      type="number"
                      value={formData.prize}
                      onChange={handleChange}
                      placeholder="1000"
                      className="form-input with-icon"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="deadline" className="form-label">
                    Submission Deadline
                  </label>
                  <div className="date-picker-container">
                    <button type="button" className="date-picker-button" onClick={() => setCalendarOpen(!calendarOpen)}>
                      <CalendarIcon className="icon" />
                      <span>{date ? format(date, "PPP") : "Select deadline date"}</span>
                    </button>
                    {renderCalendar()}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contest Image</label>
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
                      <p className="upload-text">{imagePreview ? "Change image" : "Upload contest image"}</p>
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

                <button type="submit" className="submit-button" disabled={uploading}>
                  {uploading ? "Uploading..." : "Create Contest"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <div className="card preview-card">
            <div className="card-header preview-header">
              <h2 className="card-title">Contest Preview</h2>
            </div>
            <div className="preview-content">
              {imagePreview ? (
                <div className="preview-image-container">
                  <img src={imagePreview || "/placeholder.svg"} alt="Contest Preview" className="preview-image" />
                </div>
              ) : (
                <div className="preview-image-placeholder">
                  <ImageIcon className="placeholder-icon" />
                </div>
              )}

              <div className="preview-details">
                {formData.title ? (
                  <h3 className="preview-title">{formData.title}</h3>
                ) : (
                  <div className="title-placeholder"></div>
                )}

                {formData.description ? (
                  <p className="preview-description">{formData.description}</p>
                ) : (
                  <div className="description-placeholder">
                    <div className="placeholder-line"></div>
                    <div className="placeholder-line short"></div>
                  </div>
                )}

                <div className="preview-meta">
                  <div className="meta-item">
                    <Trophy className="meta-icon prize-icon" />
                    <div className="meta-content">
                      <p className="meta-label">Prize</p>
                      <p className="meta-value">{formData.prize ? `$${formData.prize}` : "Not specified"}</p>
                    </div>
                  </div>

                  <div className="meta-item">
                    <Clock className="meta-icon deadline-icon" />
                    <div className="meta-content">
                      <p className="meta-label">Deadline</p>
                      <p className="meta-value">{date ? format(date, "MMM d, yyyy") : "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <div className="preview-banner">
                  <div className="banner-trophy"></div>
                  <p className="banner-text">
                    {formData.title
                      ? `Join "${formData.title}" and showcase your talent!`
                      : "Complete the form to create your contest"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="tips-container">
            <h4 className="tips-title">Tips for a successful contest</h4>
            <ul className="tips-list">
              <li>• Use a clear, descriptive title that explains the contest</li>
              <li>• Set a reasonable deadline to attract more participants</li>
              <li>• Upload a high-quality image that represents your contest</li>
              <li>• Provide detailed instructions in the description</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddContestForm;

