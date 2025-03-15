import { useState } from "react"
import { Eye } from "lucide-react"

// Default placeholder image
const defaultImage = "https://www.imghippo.com/i/QMsd7261qms.jpg"

const ProductCard = ({ product, onExplore }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!product) return null

  const imageSrc = imageError ? defaultImage : product.image || defaultImage
  const formattedPrice =
    product.price && !isNaN(product.price) ? `$${Number(product.price).toFixed(2)}` : "Price Not Available"

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  return (
    <div className="product-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="product-image-container">
        {!imageLoaded && (
          <div className="image-placeholder">
            <div className="spinner"></div>
          </div>
        )}
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={`Image of ${product.name || "Product"}`}
          className={`product-image ${imageLoaded ? "loaded" : ""}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      <div className="product-details">
        <h3 className="product-name">{product.name || "Unnamed Product"}</h3>
        <p className="product-price">{formattedPrice}</p>
      </div>

      <div className="button-group">
        <button
          className="quick-view"
          onClick={() => onExplore(product)}
          aria-label={`Quick view ${product.name || "product"}`}
        >
          <Eye size={16} className="icon" />
          <span>Quick View</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard