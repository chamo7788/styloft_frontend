import React, { useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import "../../assets/css/StyleMarket/buyNow.css";

import redDress from "../../assets/images/red-dress.jpg";
import denimJacket from "../../assets/images/denim-jacket.jpg";
import eveningGown from "../../assets/images/evening-gown.jpg";
import beigeSweater from "../../assets/images/beige-sweater.jpg";
import defaultImage from "../../assets/images/default-placeholder.png"; 

// Map product names to imported images
const imageMap = {
  "Red Dress": redDress,
  "Denim Jacket": denimJacket,
  "Evening Gown": eveningGown,
  "Beige Sweater": beigeSweater,
};

const BuyNow = ({ product, onBack }) => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const sizes = ["XS", "S", "M", "L", "XL"];

  
  const productImage = imageMap[product.name] || product.image || defaultImage;

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
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Buy Now Button */}
            <button className="buy-now-button">
              <ShoppingBag className="icon" /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
