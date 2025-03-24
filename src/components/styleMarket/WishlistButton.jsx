import React, { useState, useEffect } from "react"
import { Heart } from "lucide-react"

const WishlistButton = ({ productId, className = "" }) => {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if product is in wishlist
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setIsInWishlist(wishlist.includes(productId))
  }, [productId])

  const toggleWishlist = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Get current wishlist
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

    // Toggle product in wishlist
    let newWishlist
    if (isInWishlist) {
      newWishlist = wishlist.filter((id) => id !== productId)
    } else {
      newWishlist = [...wishlist, productId]
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 700)
    }

    // Save updated wishlist
    localStorage.setItem("wishlist", JSON.stringify(newWishlist))
    setIsInWishlist(!isInWishlist)
  }

  return (
    <button
      className={`wishlist-button ${isInWishlist ? "active" : ""} ${isAnimating ? "animate" : ""} ${className}`}
      onClick={toggleWishlist}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className="wishlist-icon" size={20} fill={isInWishlist ? "currentColor" : "none"} />
    </button>
  )
}

export default WishlistButton