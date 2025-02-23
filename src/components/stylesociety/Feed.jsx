import React from "react";
import "../../assets/css/StyleSociety/Feed.css";

const Notifi = () => {
  const notifications = [
    {
      id: 1,
      name: "Informatics Institute of Technology (IIT Campus)",
      category: "Company",
      type: "Higher Education",
      avatar: "/dp.jpg", // Replace with actual image URL
    },
    {
      id: 2,
      name: "Informatics Institute of Technology (IIT Campus)",
      category: "Company",
      type: "Higher Education",
      avatar: "/dp.jpg", // Replace with actual image URL
    },
    {
      id: 3,
      name: "Informatics Institute of Technology (IIT Campus)",
      category: "Company",
      type: "Higher Education",
      avatar: "/dp.jpg", // Replace with actual image URL
    },
    {
      id: 4,
      name: "Informatics Institute of Technology (IIT Campus)",
      category: "Company",
      type: "Higher Education",
      avatar: "/dp.jpg", // Replace with actual image URL
    },
  ];

  return (
    <div className="notifi-container">
      <div className="notifi-header">
        <p>Add to your feed</p>
        <button className="add-btn">+</button>
      </div>
      {notifications.map((item) => (
        <div key={item.id} className="notifi-item">
          <img src={item.avatar} alt="avatar" className="notifi-avatar" />
          <div className="notifi-info">
            <p className="notifi-title">{item.name}</p>
            <p className="notifi-category">
              <span>{item.category}</span> • <span>{item.type}</span>
            </p>
            <button className="follow-btn">+ Follow</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifi;