import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import "../../assets/css/StyleMarket/buy.css";

import visaImage from "../../assets/images/visa.png";
import masterCardImage from "../../assets/images/mastercard.png";

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
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    companyName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
    setShowOrderForm(false);
  };

  return (
    <div className="buy">
      <div className="buy-page-container">
        <div className="buy-page-form">
          <div className="icon-container">
            <ShoppingBag className="icon" />
          </div>
          <h2 className="page-title">Checkout</h2>

          {/* Product Details */}
          <div className="product-details">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            <p className="product-size">Size: {selectedSize}</p>
            <p className="product-quantity">Quantity: {quantity}</p>
          </div>

          <form onSubmit={handleSubmit} className="order-form">
            {/* Payment Info */}
            <div className="section">
              <h3>Payment Info</h3>
              <div className="payment-method">
                <button type="button" className="selected">Credit Card</button>
              </div>
              <div className="form-group">
                <label>Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group row">
                <div>
                  <label>Expiration Date *</label>
                  <div className="expiration">
                    <select name="expiryMonth" value={formData.expiryMonth} onChange={handleInputChange} required>
                      <option value="">MM</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select name="expiryYear" value={formData.expiryYear} onChange={handleInputChange} required>
                      <option value="">YYYY</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={2024 + i}>{2024 + i}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label>Security Code (CVV) *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="card-icons">
                <img src={visaImage} alt="Visa" />
                <img src={masterCardImage} alt="MasterCard" />
              </div>
            </div>

            {/* Billing Info */}
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
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="United States">United States</option>
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

            {/* Buttons */}
            <div className="form-buttons">
              <button type="button" onClick={() => setShowOrderForm(false)} className="back-button">
                Back
              </button>
              <button type="submit" className="submit-button">
                <ShoppingBag className="button-icon" />
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Buy;
