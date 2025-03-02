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

  const [imagePreview, setImagePreview] = useState(null);

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
  
    if (!user || !user.uid) {
      console.log("User not authenticated");
      return;
    }
  
    if (!formData.image) {
      console.log("Image upload is not completed!");
      alert("Please wait for the image to finish uploading before submitting.");
      return;
    }
  
    const contestData = {
      ...formData,
      createdBy: user.uid, // Add UID from localStorage to the form data
    };
  
    try {
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
  
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting contest:", error);
    }
  };
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return; 
  
    setImagePreview(URL.createObjectURL(file)); 
  
    const imageData = new FormData();
    imageData.append('file', file);
    imageData.append('upload_preset', 'Styloft'); 
  
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dkonpzste/image/upload', {
        method: 'POST',
        body: imageData,
      });
  
      const data = await response.json();
      console.log("Upload response:", data); // Debugging line
  
      if (data.secure_url) {
        setFormData((prevData) => ({
          ...prevData,
          image: data.secure_url, 
        }));
        console.log("Uploaded Image URL:", data.secure_url);
      } else {
        console.error("Image upload failed. Response:", data);
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

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" className="preview-img" />
          </div>
        )}

        <button type="submit" className="submit-button">
          Create Contest
        </button>
      </form>
    </div>
  )
}

