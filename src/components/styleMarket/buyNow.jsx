import React, { useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import "../../assets/css/StyleMarket/buyNow.css";
import defaultImage from "../../assets/images/default-placeholder.png"; // Ensure you have a fallback image
import Buy from "./buy";

const BuyNow = ({ product, onBack }) => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const sizes = ["XS", "S", "M", "L", "XL"];

  const [showOrderForm, setShowOrderForm] = useState(false); // Track visibility of order form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  const productImage = product.image || defaultImage; // Use product image or default fallback

  const handleBuyNow = () => {
    console.log("Buying Now:", {
      product: product.name,
      size: selectedSize,
      quantity: quantity,
    });
    setShowOrderForm(true); // Show order form when "Buy Now" is clicked
  };

  if (showOrderForm) {
    return (
      <Buy
        product={product}
        selectedSize={selectedSize}
        quantity={quantity}
        formData={formData}
        setFormData={setFormData}
        setShowOrderForm={setShowOrderForm}
      />
    );
  }

  return (
    <div className="buynow">
      <div className="buy-now-container">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="icon" /> Back to Products
        </button>

        <div className="buy-now-content">
          {/* Product Image */}
          <div className="product-image-container">
            <img
              src={productImage}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage; // Set default if error occurs
              }}
            />
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">${product.price}</p>

            {/* Size Selection */}
            <div className="size-selection">
              <h3>Size</h3>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-button ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
              </div>
            </div>

            {/* Buy Now Button */}
            <button className="buy-now-button" onClick={handleBuyNow}>
              <ShoppingBag className="icon" /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
