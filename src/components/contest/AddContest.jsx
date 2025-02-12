import React, { useEffect, useState } from 'react';
import "../../assets/css/contest/addContest.css"
import "firebase/auth";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    console.log("Current User:", user); // Add this line to log the current user
  
    if (user && user.uid) {
      const contestData = {
        ...formData,
        createdBy: user.uid, // Add UID from localStorage to the form data
      };
      // Send the form data to your backend
      const response = await fetch("http://localhost:3000/contest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contestData),
      });
      const result = await response.json();
      console.log("Form submitted:", result);
      // Reset form after submission
      setFormData({
        title: "",
        description: "",
        prize: "",
        deadline: "",
        image: "",
      });
    } else {
      console.log("User not authenticated");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // Ensure a file is selected
  
    const imageData = new FormData();
    imageData.append('file', file);
    imageData.append('upload_preset', 'Styloft'); // Replace with your actual upload preset
  
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dkonpzste/image/upload', {
        method: 'POST',
        body: imageData,
      });
  
      const data = await response.json();
      
      if (data.secure_url) {
        setFormData((prevData) => ({
          ...prevData,
          image: data.secure_url, // Save direct hosted URL
        }));
        console.log("Uploaded Image URL:", data.secure_url);
      } else {
        console.error("Image upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  

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
            min="0"
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
            Contest Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageUpload}
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

