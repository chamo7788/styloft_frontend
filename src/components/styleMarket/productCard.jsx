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

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={imageMap[product.name] || product.image} 
        alt={product.name}
        className="product-image"
      />
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button className="quick-view">Quick View</button>
    </div>
  );
};

export default ProductCard;
