import React from "react";
import "../../assets/css/StyleMarket/styleMarket.css";

// Import images
import redDress from "../../assets/images/red-dress.jpg";
import denimJacket from "../../assets/images/denim-jacket.jpg";
import eveningGown from "../../assets/images/evening-gown.jpg";
import beigeSweater from "../../assets/images/beige-sweater.jpg";

// Map product names to imported images
const imageMap = {
  "Red Dress": redDress,
  "Denim Jacket": denimJacket,
  "Evening Gown": eveningGown,
  "Beige Sweater": beigeSweater,
};

const ProductCard = ({ product, onExplore }) => {
  return (
    <div className="product-card">
      {/* Product Image */}
      <img
        src={imageMap[product.name] || product.image}
        alt={`Image of ${product.name}`}
        className="product-image"
      />

      {/* Product Details */}
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">Price: ${product.price.toFixed(2)}</p>
      </div>

      {/* Actions */}
      <div className="button-group">
        <button className="quick-view" onClick={() => onExplore(product)}>
          Quick View
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
