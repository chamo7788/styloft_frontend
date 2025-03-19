import React from "react";
import "../../assets/css/DashBoard/design-outfit.css"; // Regular CSS import (No styles object)

export default function DesignOutfit() {
  const designOptions = [
    {
      id: 1,
      title: "Create from Scratch",
      description: "Start with a blank canvas and bring your vision to life",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="2.5"></circle>
          <circle cx="17.5" cy="10.5" r="2.5"></circle>
          <circle cx="8.5" cy="7.5" r="2.5"></circle>
          <circle cx="6.5" cy="12.5" r="2.5"></circle>
          <path d="M12 22v-6"></path>
          <path d="M8 22h8"></path>
          <path d="M17.5 13a9 9 0 0 0-11 0"></path>
        </svg>
      ),
    },
    {
      id: 2,
      title: "Use Templates",
      description: "Choose from our curated collection of design templates",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46 16 2a4 4 0 0 1 1.46 3.46"></path>
          <path d="M9.69 2.49 11 7 9.69 2.49Z"></path>
          <path d="M14.31 2.49 13 7l1.31-4.51Z"></path>
          <path d="M16 2c0 2.6-1.2 5-3 5s-3-2.4-3-5"></path>
          <path d="M2 21c0-3 1.85-5.7 4.8-7l.2-.1"></path>
          <path d="M22 21c0-3-1.85-5.7-4.8-7l-.2-.1"></path>
          <path d="M12 7v5"></path>
          <path d="m9 9 3 3 3-3"></path>
          <path d="M9 17h6"></path>
        </svg>
      ),
    },
    {
      id: 3,
      title: "AI-Assisted Design",
      description: "Let our AI help you generate unique design concepts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
          <path d="M5 3v4"></path>
          <path d="M19 17v4"></path>
          <path d="M3 5h4"></path>
          <path d="M17 19h4"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="designOutfit">
      <h3 className="title">Design Your Outfit</h3>
      <p className="description">Use our intuitive design tools to create custom clothing that stands out.</p>
      <div className="optionsContainer">
        {designOptions.map((option) => (
          <div key={option.id} className="optionCard">
            <div className="optionIcon">{option.icon}</div>
            <h4 className="optionTitle">{option.title}</h4>
            <p className="optionDescription">{option.description}</p>
          </div>
        ))}
      </div>
      <button className="startButton">Start Designing</button>
    </div>
  );
}
