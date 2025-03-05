import React from "react";
import { ShoppingBag } from "lucide-react";
import "../../assets/css/StyleMarket/buy.css";

const Buy = ({
  product,
  selectedSize,
  quantity,
  formData,
  setFormData,
  setShowOrderForm,
}) => {
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
    setShowOrderForm(false); // Reset after order is placed
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      phone: "",
    });
  };

return (
    <div className="buy">
        <div className="buy-page-container">
            <div className="buy-page-form">
                <div className="icon-container">
                    <ShoppingBag className="icon" />
                </div>
                <h2 className="page-title">Place Your Order</h2>

                <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">${product.price}</p>
                    <p className="product-size">Size: {selectedSize}</p>
                    <p className="product-quantity">Quantity: {quantity}</p>
                </div>

                <form onSubmit={handleSubmit} className="order-form">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group two-column">
                        <div>
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>ZIP Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-buttons">
                        <button
                            type="button"
                            onClick={() => setShowOrderForm(false)}
                            className="back-button"
                        >
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
