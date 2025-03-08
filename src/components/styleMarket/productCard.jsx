import React from "react";
import "../../assets/css/StyleMarket/styleMarket.css";

// Default placeholder image
const defaultImage = "https://www.imghippo.com/i/QMsd7261qms.jpg";

const ProductCard = ({ product, onExplore }) => {
  if (!product) return null;

  const imageSrc = product.image || defaultImage;
  const formattedPrice =
    product.price && !isNaN(product.price) ? `$${Number(product.price).toFixed(2)}` : "Price Not Available";

  return (
    <div className="product-card">
      <img src={imageSrc} alt={`Image of ${product.name || "Product"}`} className="product-image" />

      <div className="product-details">
        <h3 className="product-name">{product.name || "Unnamed Product"}</h3>
        <p className="product-price">{formattedPrice}</p>
      </div>

      <div className="button-group">
        <button className="quick-view" onClick={() => onExplore(product)}>
          Quick View
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
