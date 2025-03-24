import { useState, useEffect, useRef } from "react"
import { CheckCircle, ShoppingBag, FileText } from 'lucide-react'

const PaymentSuccess = ({ orderDetails, onContinueShopping, onViewOrder }) => {
  const [isVisible, setIsVisible] = useState(false)
  const canvasRef = useRef(null)
  
  // Function to create confetti effect
  const createConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const width = canvas.width = window.innerWidth
    const height = canvas.height = window.innerHeight
    
    const particles = []
    const colors = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0']
    
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        size: Math.random() * 8 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 3,
        gravity: 0.1 + Math.random() * 0.1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5
      })
    }
    
    let animationFrame
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      let particlesLeft = false
      
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.rotation += p.rotationSpeed
        
        if (p.y < height && p.x > 0 && p.x < width) {
          particlesLeft = true
          
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation * Math.PI / 180)
          ctx.fillStyle = p.color
          
          // Draw different shapes for variety
          if (Math.random() > 0.3) {
            // Rectangle
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
          } else {
            // Circle
            ctx.beginPath()
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
            ctx.fill()
          }
          
          ctx.restore()
        }
      })
      
      if (particlesLeft) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        cancelAnimationFrame(animationFrame)
      }
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsVisible(true)
      createConfetti()
    }, 100)
    
    // Clean up animation frames on unmount
    return () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }, [])

  return (
    <div className={`payment-success-container ${isVisible ? 'visible' : ''}`}>
      <canvas ref={canvasRef} className="confetti-canvas"></canvas>
      
      <div className="success-card">
        <div className="checkmark-container">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        
        <h2 className="success-title">Payment Successful!</h2>
        <div className="success-badge">
          <span>Thank you for your purchase</span>
        </div>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-details">
            <div className="detail-row animate-item">
              <span>Order ID:</span>
              <span>#{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="detail-row animate-item">
              <span>Product:</span>
              <span>{orderDetails.productName}</span>
            </div>
            <div className="detail-row animate-item">
              <span>Size:</span>
              <span>{orderDetails.size}</span>
            </div>
            <div className="detail-row animate-item">
              <span>Quantity:</span>
              <span>{orderDetails.quantity}</span>
            </div>
            <div className="detail-row total animate-item">
              <span>Total Amount:</span>
              <span className="amount-highlight">${orderDetails.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="success-message">
          <p>Your order has been placed successfully. You will receive a confirmation email shortly.</p>
        </div>
        
        <div className="success-actions">
          <button className="action-button continue" onClick={onContinueShopping}>
            <ShoppingBag size={18} />
            Continue Shopping
          </button>
          <button className="action-button view-order" onClick={onViewOrder}>
            <FileText size={18} />
            View Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
