import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

const ProductGallery = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [imagesLoaded, setImagesLoaded] = useState([])

  // Default image if no images are provided
  const defaultImage = "https://www.imghippo.com/i/QMsd7261qms.jpg"
  const galleryImages = images && images.length > 0 ? images : [defaultImage]

  useEffect(() => {
    setImagesLoaded(new Array(galleryImages.length).fill(false))
  }, [galleryImages])

  const handleImageLoad = (index) => {
    const newImagesLoaded = [...imagesLoaded]
    newImagesLoaded[index] = true
    setImagesLoaded(newImagesLoaded)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
    setIsZoomed(false)
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
  }

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed)
  }

  const handleMouseMove = (e) => {
    if (!isZoomed) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  const zoomStyle = isZoomed
    ? {
        transform: "scale(2.5)",
        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
      }
    : {}

  return (
    <div className="product-gallery">
      <div
        className={`main-image-container ${isZoomed ? "zoomed" : ""}`}
        onMouseMove={handleMouseMove}
        onClick={handleZoomToggle}
      >
        {!imagesLoaded[currentImageIndex] && (
          <div className="image-placeholder">
            <div className="spinner"></div>
          </div>
        )}
        <img
          src={galleryImages[currentImageIndex] || "/placeholder.svg"}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className={`main-image ${imagesLoaded[currentImageIndex] ? "loaded" : ""}`}
          style={zoomStyle}
          onLoad={() => handleImageLoad(currentImageIndex)}
        />
        <button className="zoom-button" onClick={handleZoomToggle} aria-label="Zoom image">
          <ZoomIn size={20} />
        </button>
      </div>

      {galleryImages.length > 1 && (
        <>
          <div className="gallery-navigation">
            <button className="gallery-nav-button prev" onClick={handlePrevImage} aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button className="gallery-nav-button next" onClick={handleNextImage} aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="thumbnail-container">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${currentImageIndex === index ? "active" : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${productName} thumbnail ${index + 1}`}
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ProductGallery