"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import Success from "../Subscription/PaymentSuccess.jsx" // Import Success Page
import "../../assets/css/subscription/paymentPage.css"

// Replace with your actual publishable key
const stripePromise = loadStripe(
  "pk_test_51R0PouFKqSRL4Eus1nQLaIYdWsBCGb0rkCZeSXivdL1aI4zxn3bqQOGmXuxZRL9im9UTRmBZnujboCXn2Mwu97aG00QUvxvr91",
)

const CheckoutForm = ({ plan, buyerDetails, setBuyerDetails, setPaymentSuccessful }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3000/payments/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: buyerDetails.email, // Use email as unique identifier
        planName: plan.name,
        amount: plan.price,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError("Failed to get payment authorization.")
        }
      })
      .catch((err) => {
        console.error("Error fetching clientSecret:", err)
        setError("Payment service unavailable.")
      })
  }, [plan, buyerDetails.email])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBuyerDetails({ ...buyerDetails, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system is not ready. Please try again.")
      setLoading(false)
      return
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: buyerDetails.name,
          email: buyerDetails.email,
        },
      },
    })

    if (result.error) {
      setError(result.error.message)
      setLoading(false)
    } else {
      setPaymentSuccessful(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form animate-fade-up">
      <div className="form-group animate-slide-in" style={{ animationDelay: "0.1s" }}>
        <label className="form-label">Full Name</label>
        <input
          type="text"
          name="name"
          className={`form-input ${focused === "name" ? "input-focused" : ""}`}
          value={buyerDetails.name}
          onChange={handleInputChange}
          required
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div className="form-group animate-slide-in" style={{ animationDelay: "0.2s" }}>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          name="email"
          className={`form-input ${focused === "email" ? "input-focused" : ""}`}
          value={buyerDetails.email}
          onChange={handleInputChange}
          required
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div
        className={`card-element-container animate-slide-in ${focused === "card" ? "input-focused" : ""}`}
        style={{ animationDelay: "0.3s" }}
      >
        <CardElement
          className="card-input"
          onFocus={() => setFocused("card")}
          onBlur={() => setFocused(null)}
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {error && <p className="error-message animate-fade-in">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`payment-button payment-button-${plan.color} animate-fade-up`}
        style={{ animationDelay: "0.4s" }}
      >
        {loading ? (
          <span className="button-loading">
            <span className="loading-spinner"></span>
            Processing...
          </span>
        ) : (
          "Subscribe Now"
        )}
      </button>
    </form>
  )
}

const PaymentPage = () => {
  const { planId } = useParams()
  const [paymentSuccessful, setPaymentSuccessful] = useState(false)
  const [buyerDetails, setBuyerDetails] = useState({ name: "", email: "" })

  const getPlanDetails = () => {
    switch (planId) {
      case "pro":
        return { name: "Silver Plan", price: 3, color: "silver" }
      case "commercial":
        return { name: "Gold Plan", price: 20, color: "gold" }
      default:
        return { name: "Bronze Plan", price: 0, color: "bronze" }
    }
  }

  const plan = getPlanDetails()
  const totalAmount = plan.price * 1.1 // Including tax

  if (paymentSuccessful) {
    return (
      <Success
        orderDetails={{
          planName: plan.name,
          amount: totalAmount.toFixed(2),
        }}
        onContinueShopping={() => setPaymentSuccessful(false)}
        onViewOrder={() => setPaymentSuccessful(false)}
      />
    )
  }

  return (
    <div className="payment-container">
      <div className="payment-header animate-fade-down">
        <h1 className="payment-title">Complete Your Purchase</h1>
        <p className="payment-subtitle">Please review your order and enter your payment details</p>
      </div>

      <div className="payment-content">
        <div className="payment-form-container animate-slide-in-left">
          <div className={`payment-card payment-card-${plan.color}`}>
            <div className="card-header">
              <h2 className="card-title">Payment Details</h2>
              <p className="card-description">Enter your card information securely</p>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                plan={plan}
                buyerDetails={buyerDetails}
                setBuyerDetails={setBuyerDetails}
                setPaymentSuccessful={setPaymentSuccessful}
              />
            </Elements>
          </div>
        </div>

        <div className="order-summary-container animate-slide-in-right">
          <div className={`order-card order-card-${plan.color}`}>
            <div className="card-header">
              <h2 className="card-title">Order Summary</h2>
            </div>
            <div className="card-content">
              <div className="summary-item animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <h3 className={`summary-title summary-title-${plan.color}`}>{plan.name}</h3>
                <p className="summary-description">Monthly subscription</p>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <span>Subtotal</span>
                <span>${plan.price.toFixed(2)}</span>
              </div>

              <div className="summary-row animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <span>Tax</span>
                <span>${(plan.price * 0.1).toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total animate-fade-in" style={{ animationDelay: "0.7s" }}>
                <span>Total</span>
                <span className="price-pulse">${totalAmount.toFixed(2)}/month</span>
              </div>

              <div className="terms-text animate-fade-in" style={{ animationDelay: "0.8s" }}>
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

