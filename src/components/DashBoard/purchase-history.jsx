import React, { useEffect, useState } from 'react';
import "../../assets/css/DashBoard/purchase-history.css";

const PurchaseHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const fetchPurchaseHistory = async () => {
    try {
      // Retrieve current user information from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser || !currentUser.uid) {
        throw new Error("User not logged in");
      }

      // Fetch the purchase history from the backend API
      const response = await fetch(`https://styloftbackendnew-production.up.railway.app/payments/user-orders/${currentUser.uid}`);

      if (!response.ok) {
        throw new Error("Failed to fetch purchase history");
      }

      // Parse the JSON response and set the state
      const data = await response.json();
      setPurchaseHistory(data);  // Assuming the response contains an array of orders
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      setError('Error fetching purchase history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="purchase-history">
      {loading ? (
        <p>Loading purchase history...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Amount</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.length === 0 ? (
              <tr>
                <td colSpan="3">No purchase history available</td>
              </tr>
            ) : (
              purchaseHistory.map((purchase, index) => (
                <tr key={index}>
                  <td>{purchase.productDescription || 'N/A'}</td>
                  <td>{purchase.amount ? `$${purchase.amount.toFixed(2)}` : 'N/A'}</td>
                  <td>{purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'Invalid Date'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchaseHistory;
