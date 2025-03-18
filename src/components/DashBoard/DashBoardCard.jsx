import React, { useState, useEffect } from "react";
import "../../assets/css/DashBoard/DashBoardCard.css"

export default function DashBoardCard() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
  
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen)
    }
  
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <button className="Dashmenu-button" onClick={toggleMenu}>
            <span className="Dashmenu-icon">{isMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
  
        {isMenuOpen && (
          <div className="DashSidebar-menu">
            <ul className="Dashmenu-list">
              <li className="Dashmenu-item">
                <a href="#">Home</a>
              </li>
              <li className="Dashmenu-item">
                <a href="#">Analytics</a>
              </li>
              <li className="Dashmenu-item">
                <a href="#">Settings</a>
              </li>
              <li className="Dashmenu-item">
                <a href="#">Profile</a>
              </li>
              <li className="Dashmenu-item">
                <a href="#">Help</a>
              </li>
            </ul>
          </div>
        )}
  
        <div className="dashboard-cards">
          <div className="Dashcard earning-card">
            <div className="Dashcard-header">
              <div className="Dashicon-container earning-icon-container">
                <span className="Dashcard-icon earning-icon">↗</span>
              </div>
              <h3 className="Dashcard-title">Earnings</h3>
            </div>
            <div className="Dashcard-content">
              <div className="Dashcard-value-container">
                <span className="currency-symbol">$</span>
                <span className="Dashcard-value">24,563</span>
                <span className="Dashpercentage-change positive">+12.5%</span>
              </div>
              <p className="Dashcard-description">Total earnings this month</p>
            </div>
          </div>
  
          <div className="Dashcard share-card">
            <div className="Dashcard-header">
              <div className="Dashicon-container share-icon-container">
                <span className="Dashcard-icon share-icon">↗</span>
              </div>
              <h3 className="Dashcard-title">Shares</h3>
            </div>
            <div className="Dashcard-content">
              <div className="Dashcard-value-container">
                <span className="Dashcard-value">1,248</span>
                <span className="Dashpercentage-change positive">+18.2%</span>
              </div>
              <p className="Dashcard-description">Total shares this month</p>
            </div>
          </div>
  
          <div className="Dashcard likes-card">
            <div className="Dashcard-header">
              <div className="Dashicon-container likes-icon-container">
                <span className="Dashcard-icon likes-icon">♥</span>
              </div>
              <h3 className="Dashcard-title">Likes</h3>
            </div>
            <div className="Dashcard-content">
              <div className="Dashcard-value-container">
                <span className="Dashcard-value">8,942</span>
                <span className="Dashpercentage-change positive">+32.7%</span>
              </div>
              <p className="Dashcard-description">Total likes this month</p>
            </div>
          </div>
  
          <div className="Dashcard rating-card">
            <div className="Dashcard-header">
              <div className="Dashicon-container rating-icon-container">
                <span className="Dashcard-icon rating-icon">★</span>
              </div>
              <h3 className="Dashcard-title">Rating</h3>
            </div>
            <div className="Dashcard-content">
              <div className="Dashcard-value-container">
                <span className="Dashcard-value">4.8</span>
                <span className="Dashpercentage-change positive">+0.3</span>
              </div>
              <p className="Dashcard-description">Average rating this month</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  