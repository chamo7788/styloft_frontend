import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../../assets/css/StyleMarket/buy.css";


const stripePromise = loadStripe("pk_test_51R0PouFKqSRL4Eus1nQLaIYdWsBCGb0rkCZeSXivdL1aI4zxn3bqQOGmXuxZRL9im9UTRmBZnujboCXn2Mwu97aG00QUvxvr91");

const CheckoutForm = ({ formData, setShowOrderForm, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    try {
      const response = await fetch("http://localhost:3000/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: formData.country,
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        alert("Payment successful! Order placed.");
        setShowOrderForm(false);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h3>Payment Info</h3>
      <div className="card-element-container">
        <CardElement className="card-input" />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={!stripe || loading} className="submit-button">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Buy = ({ product, selectedSize, quantity, setShowOrderForm }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
    companyName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalAmount = product.price * quantity;

  return (
    <div className="buy">
      <div className="buy-page-container">
        <div className="buy-page-form">
          <div className="icon-container">
            <ShoppingBag className="icon" />
          </div>
          <h2 className="page-title">Checkout</h2>

          <div className="product-details">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            <p className="product-size">Size: {selectedSize}</p>
            <p className="product-quantity">Quantity: {quantity}</p>
            <p className="total-amount">Total: ${totalAmount}</p>
          </div>

          {/* Billing Info */}
          <form className="order-form">
            <div className="section">
              <h3>Billing Info</h3>
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} />
              </div>
              <div className="form-group row">
                <div>
                  <label>First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>
              <div className="form-group row">
                <div>
                  <label>City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>State *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group row">
                <div>
                  <label>ZIP/Postal Code *</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Country *</label>
                  <select name="country" value={formData.country} onChange={handleInputChange} required>
                    <option value="SL">Sri Lanka</option>
                    <option value="US">United States</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
            </div>
          </form>

          {/* Stripe Payment Form */}
          <Elements stripe={stripePromise}>
            <CheckoutForm formData={formData} setShowOrderForm={setShowOrderForm} amount={totalAmount} />
          </Elements>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="button" onClick={() => setShowOrderForm(false)} className="back-button">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;