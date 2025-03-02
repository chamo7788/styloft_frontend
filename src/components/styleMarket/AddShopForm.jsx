import React, { useState } from "react";
import "../../assets/css/StyleMarket/addShop.css"; 

export function AddShopForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "", // Image URL from ImgHippo
  });

  const [imagePreview, setImagePreview] = useState(null); // For displaying selected image

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // If updating image field, update preview
    if (name === "image") {
      setImagePreview(value);
    }
  };

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
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        alert("Shop Created Successfully!");

        // ✅ Reset the form
        setFormData({ name: "", description: "", price: "", image: "" });
        setImagePreview(null);
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
