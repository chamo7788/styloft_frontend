<<<<<<< HEAD
"use client"

import { useState } from "react"
import { ArrowLeft, ShoppingBag, Minus, Plus } from "lucide-react"
import Buy from "./buy"
=======
import React, { useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import "../../assets/css/StyleMarket/buyNow.css";
import defaultImage from "../../assets/images/default-placeholder.png"; // Ensure you have a fallback image
>>>>>>> 1e2660c644ec86990fb1374cf6e2d197749dcd46

const BuyNow = ({ product, onBack }) => {
  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)
  const [imageLoaded, setImageLoaded] = useState(false)
  const sizes = ["XS", "S", "M", "L", "XL"]

<<<<<<< HEAD
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  })

  // Use product image or default fallback
  const defaultImage = "https://www.imghippo.com/i/QMsd7261qms.jpg"
  const productImage = product.image || defaultImage
=======
  const productImage = product.image || defaultImage; // Use product image or default fallback
>>>>>>> 1e2660c644ec86990fb1374cf6e2d197749dcd46

  const handleBuyNow = () => {
    console.log("Buying Now:", {
      product: product.name,
      size: selectedSize,
      quantity: quantity,
<<<<<<< HEAD
    })
    setShowOrderForm(true)
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

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
    )
  }
=======
    });

    // Here, you can add checkout functionality or API call
  };
>>>>>>> 1e2660c644ec86990fb1374cf6e2d197749dcd46

  return (
    <div className="buynow">
      <div className="buy-now-container">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Products
        </button>

        <div className="buy-now-content">
          {/* Product Image */}
          <div className="product-image-container">
            {!imageLoaded && (
              <div className="image-placeholder">
                <div className="spinner"></div>
              </div>
            )}
            <img
              src={productImage || "/placeholder.svg"}
              alt={product.name}
              className={`product-image ${imageLoaded ? "loaded" : ""}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = defaultImage
                setImageLoaded(true)
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
                    aria-label={`Select size ${size}`}
                    aria-pressed={selectedSize === size}
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
<<<<<<< HEAD
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
=======
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
>>>>>>> 1e2660c644ec86990fb1374cf6e2d197749dcd46
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  aria-label="Quantity"
                />
<<<<<<< HEAD
                <button onClick={() => handleQuantityChange(quantity + 1)} aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
=======
                <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
>>>>>>> 1e2660c644ec86990fb1374cf6e2d197749dcd46
              </div>
            </div>

            {/* Buy Now Button */}
            <button className="buy-now-button" onClick={handleBuyNow}>
<<<<<<< HEAD
              <ShoppingBag size={18} /> Buy Now
=======
              <ShoppingBag className="icon" /> Buy Now
>>>>>>> 1e2660c644ec86990fb1374cf6e2d197749dcd46
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyNow

