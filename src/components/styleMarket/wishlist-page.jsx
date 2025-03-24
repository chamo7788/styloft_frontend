import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Heart, Trash2, ShoppingCart } from "lucide-react"
import ProductCard from "./productCard.jsx"
import "../../assets/css/StyleMarket/enhanced-features.css"

const WishlistPage = () => {
  const allProducts = useSelector((state) => state.products.products)
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Get wishlist IDs from localStorage
      const wishlistIds = JSON.parse(localStorage.getItem("wishlist") || "[]")

      // Filter products that are in the wishlist
      const products = allProducts.filter((product) => wishlistIds.includes(product.id))

      setWishlistProducts(products)
      setIsLoading(false)
    }
  }, [allProducts])

  const removeFromWishlist = (productId) => {
    // Get current wishlist
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

    // Remove product from wishlist
    const newWishlist = wishlist.filter((id) => id !== productId)

    // Save updated wishlist
    localStorage.setItem("wishlist", JSON.stringify(newWishlist))

    // Update state
    setWishlistProducts((prev) => prev.filter((product) => product.id !== productId))
  }

  const addToCart = (product) => {
    // Get current cart
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]")

    // Check if product already in cart
    const existingItemIndex = cart.findIndex((item) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += 1
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        size: "M", // Default size
        quantity: 1,
      })
    }

    // Save updated cart
    localStorage.setItem("shoppingCart", JSON.stringify(cart))

    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product.id);

    alert("Product added to cart!")
  }

  const clearWishlist = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      localStorage.setItem("wishlist", "[]")
      setWishlistProducts([])
    }
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h2>
            <Heart className="wishlist-icon" /> My Wishlist
          </h2>

          {wishlistProducts.length > 0 && (
            <button className="clear-wishlist" onClick={clearWishlist}>
              <Trash2 size={16} /> Clear Wishlist
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        ) : (
          <>
            {wishlistProducts.length === 0 ? (
              <div className="empty-wishlist">
                <Heart size={48} />
                <h3>Your wishlist is empty</h3>
                <p>Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
                <a href="/shop" className="continue-shopping-link">
                  Continue Shopping
                </a>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="wishlist-item">
                    <ProductCard product={product} onExplore={() => {}} />
                    <div className="wishlist-item-actions">
                      <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                      <button className="remove-button" onClick={() => removeFromWishlist(product.id)}>
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default WishlistPage