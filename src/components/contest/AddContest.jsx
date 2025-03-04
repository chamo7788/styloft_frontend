import React, { useState } from 'react';
import "../../assets/css/contest/addContest.css";
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

export function AddContestForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    deadline: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const cld = new Cloudinary({ cloud: { cloudName: 'ds0xdh85j' } });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload a JPG or PNG image.");
      return;
    }

    // Show preview
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", "Styloft"); // Replace with your actual preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/ds0xdh85j/image/upload", {
        method: "POST",
        body: imageData,
      });

      const data = await response.json();

      if (data.secure_url) {
        setFormData((prevData) => ({
          ...prevData,
          image: data.secure_url, // Save image URL
        }));
        console.log("Uploaded Image URL:", data.secure_url);
        setErrorMessage("");
      } else {
        setErrorMessage("Image upload failed. Try again.");
      }
    } catch (error) {
      setErrorMessage("Error uploading image. Check your network.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user.uid) {
      console.log("User not authenticated");
      return;
    }

    if (!formData.image) {
      setErrorMessage("Please upload an image before submitting.");
      return;
    }

    const contestData = {
      ...formData,
      createdBy: user.uid,
    };

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
            accept="image/png, image/jpeg"
            required
          />
        </div>

        {uploading && <p className="uploading-text">Uploading image...</p>}

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" className="preview-img" />
          </div>
        )}

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button type="submit" className="submit-button" disabled={uploading}>
          {uploading ? "Uploading..." : "Create Contest"}
        </button>
      </form>
    </div>
  );
}