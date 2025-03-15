"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CreditCard, Calendar, Lock, Shield } from "lucide-react"
import "../../assets/css/subscription/paymentPage.css"

const PaymentPage = () => {
  const navigate = useNavigate()
  const { planId } = useParams()

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  })

  const [errors, setErrors] = useState({})

  // Get plan details based on planId
  const getPlanDetails = () => {
    switch (planId) {
      case "pro":
        return {
          name: "Silver Plan",
          price: 3,
          color: "silver",
        }
      case "commercial":
        return {
          name: "Gold Plan",
          price: 20,
          color: "gold",
        }
      default:
        return {
          name: "Bronze Plan",
          price: 0,
          color: "bronze",
        }
    }
  }

  const plan = getPlanDetails()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    if (!formData.cardholderName || formData.cardholderName.length < 3) {
      newErrors.cardholderName = "Cardholder name is required"
      isValid = false
    }

    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = "Card number must be at least 16 digits"
      isValid = false
    }

    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      newErrors.expiryDate = "Expiry date is required"
      isValid = false
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "CVV must be at least 3 digits"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handlePayment = () => {
    if (validateForm()) {
      // For now, just simulate payment success and redirect
      navigate("/payment-success")
    }
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1 className="payment-title">Complete Your Purchase</h1>
        <p className="payment-subtitle">Please review your order and enter your payment details</p>
      </div>

      <div className="payment-content">
        <div className="payment-form-container">
          <div className={`payment-card payment-card-${plan.color}`}>
            <div className="card-header">
              <h2 className="card-title">Payment Details</h2>
              <p className="card-description">Enter your card information securely</p>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="cardholderName" className="form-label">
                  Cardholder Name
                </label>
                <input
                  id="cardholderName"
                  name="cardholderName"
                  className={`form-input ${errors.cardholderName ? "input-error" : ""}`}
                  placeholder="John Smith"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                />
                {errors.cardholderName && <p className="error-message">{errors.cardholderName}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber" className="form-label">
                  Card Number
                </label>
                <div className="input-with-icon">
                  <CreditCard className="input-icon" />
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    className={`form-input ${errors.cardNumber ? "input-error" : ""}`}
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate" className="form-label">
                    Expiry Date
                  </label>
                  <div className="input-with-icon">
                    <Calendar className="input-icon" />
                    <input
                      id="expiryDate"
                      name="expiryDate"
                      className={`form-input ${errors.expiryDate ? "input-error" : ""}`}
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="cvv" className="form-label">
                    CVV
                  </label>
                  <div className="input-with-icon">
                    <Lock className="input-icon" />
                    <input
                      id="cvv"
                      name="cvv"
                      className={`form-input ${errors.cvv ? "input-error" : ""}`}
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                </div>
              </div>

              <div className="secure-payment-notice">
                <Shield className="secure-icon" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
            <div className="card-footer">
              <button onClick={handlePayment} className={`payment-button payment-button-${plan.color}`}>
                Complete Payment
              </button>
            </div>
          </div>
        </div>

        <div className="order-summary-container">
          <div className={`order-card order-card-${plan.color}`}>
            <div className="card-header">
              <h2 className="card-title">Order Summary</h2>
            </div>
            <div className="card-content">
              <div className="summary-item">
                <h3 className={`summary-title summary-title-${plan.color}`}>{plan.name}</h3>
                <p className="summary-description">Monthly subscription</p>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${plan.price.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <span>${(plan.price * 0.1).toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${(plan.price * 1.1).toFixed(2)}/month</span>
              </div>

              <div className="terms-text">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

