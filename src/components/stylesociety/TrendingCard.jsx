import React from "react";
import { Sparkles, Heart, Star } from "lucide-react";
import "../../assets/css/StyleSociety/trendingCard.css";

const fashionCards = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
    title: "Runway Collection",
    tagline: "Elegance Redefined",
    designer: "Haute Couture"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    title: "Summer Essentials",
    tagline: "Bold & Beautiful",
    designer: "Chic Designs"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    title: "Evening Glamour",
    tagline: "Timeless Sophistication",
    designer: "Luxe Fashion"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800",
    title: "Urban Street Style",
    tagline: "Edgy & Trendsetting",
    designer: "Metro Vibes"
  }
];

export function TrendingCard() {
  return (
    <div className="trending-section">
      <div className="trending-container">
        <h1 className="trending-title">
          👗 <span className="trending-title-gradient">Wear Your Confidence, Share Your Passion!</span>
        </h1>

        <p className="trending-subtitle">
          👠 Walk the Digital Runway, Own the Trend!
        </p>

        <div className="fashion-card-container">
          {fashionCards.map((card) => (
            <div key={card.id} className="fashion-card">
              <div className="like-button-container">
                <button className="like-button">
                  <Heart className="heart-icon" />
                </button>
              </div>

              <div className="image-container">
                <img
                  src={card.image}
                  alt={card.title}
                  className="card-image"
                />
                <div className="image-overlay"></div>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{card.title}</h3>
                  <Sparkles className="sparkles-icon" />
                </div>

                <p className="card-tagline">{card.tagline}</p>

                <div className="card-footer">
                  <span className="designer-name">{card.designer}</span>
                  <div className="rating">
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                    <Star className="star-icon" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrendingCard;