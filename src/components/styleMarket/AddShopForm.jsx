import React, { useState } from "react";
import "../../assets/css/StyleMarket/addShop.css"; 

export function AddShopForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState(null); // For displaying selected image

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

    setImagePreview(URL.createObjectURL(file)); // Show image preview

    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", "Styloft"); // Change to your actual Cloudinary preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dkonpzste/image/upload",
        {
          method: "POST",
          body: imageData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setFormData((prevData) => ({
          ...prevData,
          image: data.secure_url, // Save the hosted image URL
        }));
        console.log("Uploaded Image URL:", data.secure_url);
      } else {
        console.error("Image upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData); // Debugging

    try {
      const response = await fetch("http://localhost:3000/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        alert("Shop Created Successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          image: "",
        });
        setImagePreview(null); // Reset image preview
      } else {
        alert("Failed to create shop: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="add-shop-container">
      <h2 className="add-shop-title">Create a New Shop</h2>
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Shop Image
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
          Create Shop
        </button>
      </form>
    </div>
  );
}
