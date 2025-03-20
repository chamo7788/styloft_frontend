import "../../assets/css/DashBoard/purchase-history.css";
import React from "react";

export default function PurchaseHistory() {
  const purchases = [
    {
      id: "ORD-7291",
      date: "Mar 14, 2023",
      item: "Minimalist Summer Dress",
      amount: "$89.99",
      profit: "$12.50",
      status: "Delivered",
    },
    {
      id: "ORD-6432",
      date: "Feb 28, 2023",
      item: "Urban Denim Jacket",
      amount: "$129.99",
      profit: "$18.75",
      status: "Delivered",
    },
    {
      id: "ORD-5109",
      date: "Feb 12, 2023",
      item: "Eco-friendly T-shirt",
      amount: "$34.99",
      profit: "$5.25",
      status: "Delivered",
    },
    {
      id: "ORD-4872",
      date: "Jan 25, 2023",
      item: "Vintage Leather Bag",
      amount: "$159.99",
      profit: "$22.50",
      status: "Delivered",
    },
  ];

  return (
    <div className="purchase-history">
      <div className="purchase-history-header">
        <h3 className="purchase-history-title">Purchase History</h3>
        <button className="purchase-history-view-all">
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>
      </div>
      <div className="purchase-history-content">
        <div className="purchase-history-list">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="purchase-history-item">
              <div className="purchase-history-details">
                <div className="purchase-history-main">
                  <h4 className="purchase-history-title">{purchase.item}</h4>
                  <p className="purchase-history-id">{purchase.id}</p>
                </div>
                <div className="purchase-history-info">
                  <p className="purchase-history-date">{purchase.date}</p>
                  <span className="purchase-history-status">{purchase.status}</span>
                </div>
              </div>
              <div className="purchase-history-financials">
                <div className="purchase-history-amount">
                  <span className="amount-label">Amount</span>
                  <span className="amount-value">{purchase.amount}</span>
                </div>
                <div className="purchase-history-profit">
                  <span className="profit-label">Profit</span>
                  <span className="profit-value">{purchase.profit}</span>
                </div>
                <button className="purchase-history-download">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="purchase-history-total-profit">
          <span className="total-profit-label">Total Profit</span>
          <span className="total-profit-value">$59.00</span>
        </div>
      </div>
    </div>
  );
}
