import React, { useState, useEffect } from "react"
import { X, Trash2, ShoppingBag } from "lucide-react"

const ShoppingCart = ({ isOpen, onClose, onCheckout }) => {
  const [cartItems, setCartItems] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load cart items from localStorage when the component mounts or cart is opened
    const savedCart = localStorage.getItem("shoppingCart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [isOpen])

  useEffect(() => {
    // Save cart items to localStorage whenever they change
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems))
  }, [cartItems])

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    )
  }

  const removeItem = (itemId) => {
    setIsAnimating(true)
    setTimeout(() => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
      setIsAnimating(false)
    }, 300)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.1 // 10% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  // Default image if product image is not available
  const defaultImage = "https://www.imghippo.com/i/QMsd7261qms.jpg"

  return (
    <div className={`shopping-cart-overlay ${isOpen ? "open" : ""}`}>
      <div className="shopping-cart-container">
        <div className="cart-header">
          <h3>
            <ShoppingBag size={20} />
            Your Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)
          </h3>
          <button className="close-cart" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} />
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={`cart-item ${isAnimating ? "fade-out" : ""}`}>
                <div className="item-image">
                  <img src={item.image || defaultImage} alt={item.name} />
                </div>
                <div className="item-details">
                  <h4 className="item-name">{item.description}</h4>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  {item.size && <p className="item-size">Size: {item.size}</p>}
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeItem(item.id)} aria-label="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShoppingCart