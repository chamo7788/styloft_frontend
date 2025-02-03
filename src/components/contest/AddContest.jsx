import React, { useState } from "react"
import "../../assets/css/contest/addContest.css"

export function AddContestForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    deadline: "",
    image: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)
    // Reset form after submission
    setFormData({
      title: "",
      description: "",
      prize: "",
      deadline: "",
      image: "",
    })
  }

  const previewContest = {
    id: 1,
    image: formData.image || "/placeholder.svg",
    description: formData.description || "Contest description will appear here",
    designers: 0,
    designs: 0,
    prize: Number(formData.prize) || 0,
  }

  return (
    <div className="add-contest-container">
      <h2 className="add-contest-title">Add New Contest</h2>
      <form className="add-contest-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Contest Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
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
          <label htmlFor="prize" className="form-label">
            Prize Amount ($)
          </label>
          <input
            type="number"
            id="prize"
            name="prize"
            value={formData.prize}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deadline" className="form-label">
            Submission Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Contest Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Create Contest
        </button>
      </form>
    </div>
  )
}

