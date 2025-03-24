import { Heart, Star } from "lucide-react"
import "../../assets/css/StyleSociety/trendingCard.css"

const fashionCards = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
    title: "Runway Collection",
    tagline: "Elegance Redefined",
    designer: "Haute Couture",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    title: "Summer Essentials",
    tagline: "Bold & Beautiful",
    designer: "Chic Designs",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    title: "Evening Glamour",
    tagline: "Timeless Sophistication",
    designer: "Luxe Fashion",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800",
    title: "Urban Street Style",
    tagline: "Edgy & Trendsetting",
    designer: "Metro Vibes",
  },
]

export function TrendingCard() {
  return (
    <div className="trending-section">
      <div className="trending-container">
        <h1 className="trending-title">Wear Your Confidence, Share Your Passion</h1>

        <p className="trending-subtitle">Discover the latest fashion trends</p>

        <div className="fashion-card-container">
          {fashionCards.map((card) => (
            <div key={card.id} className="fashion-card">
              <div className="like-button-container">
                <button className="like-button">
                  <Heart className="heart-icon" />
                </button>
              </div>

              <div className="image-container">
                <img src={card.image || "/placeholder.svg"} alt={card.title} className="card-image" />
              </div>

              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-tagline">{card.tagline}</p>

                <div className="card-footer">
                  <span className="designer-name">{card.designer}</span>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="star-icon" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrendingCard

