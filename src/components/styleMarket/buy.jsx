import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../../assets/css/StyleMarket/buy.css";
import PaymentSuccess from "../styleMarket/payment-success.jsx";
import "../../assets/css/StyleMarket/payment-success.css";

// Load Stripe
const stripePromise = loadStripe("pk_test_51R0PouFKqSRL4Eus1nQLaIYdWsBCGb0rkCZeSXivdL1aI4zxn3bqQOGmXuxZRL9im9UTRmBZnujboCXn2Mwu97aG00QUvxvr91");

const CheckoutForm = ({ formData, setFormData, amount, setPaymentSuccessful, product, selectedSize, quantity }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user.uid) {
      console.error("Authentication error: User must be logged in to buy a product.");
      return;
    }

    if (!clientSecret) {  // Prevent duplicate API calls
      fetch("http://localhost:3000/payments/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          productId: product.id.toString(), // Use the actual product ID
          amount: amount,
          size: selectedSize,
          quantity: quantity,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingState: formData.state,
          shippingZip: formData.zipCode,
          shippingCountry: formData.country
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => console.error("Error fetching clientSecret:", err));
    }
  }, [amount, clientSecret, product, selectedSize, quantity, formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) return;

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
      setPaymentSuccessful(true);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h3>Payment Info</h3>

      <div className="form-group">
        <label>First Name *</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
      </div>

      <div className="form-group">
        <label>Last Name *</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
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
    country: "SL",
  });

  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const totalAmount = product.price * quantity;

  if (paymentSuccessful) {
    return (
      <PaymentSuccess
        orderDetails={{
          productName: product.name,
          size: selectedSize,
          quantity: quantity,
          amount: totalAmount,
        }}
        onContinueShopping={() => setShowOrderForm(false)}
        onViewOrder={() => setShowOrderForm(false)}
      />
    );
  }

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

          {/* Stripe Payment Form */}
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              formData={formData} 
              setFormData={setFormData} 
              amount={totalAmount} 
              setPaymentSuccessful={setPaymentSuccessful}
              product={product}
              selectedSize={selectedSize}
              quantity={quantity}
            />
          </Elements>

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
