import React from "react";
import Navbar from "../components/home/Navbar/Navbar";
import "../assets/css/Home/home.css"

export default function Home() {
    return (
        <>
        <div className="home-container">
              {/* Hero Section */}
              <div className="hero-section">
                <div className="hero-image"></div>
            </div>

            {/* Features Section */}
            <div className="features-grid">
                <div className="feature-item feature-style-market">
                    STYLE Market
                </div>
                <div className="feature-item feature-style-studio">
                    STYLE Studio
                </div>
                <div className="feature-item feature-inspire-zone">
                    INSPIRE Zone
                </div>
                <div className="feature-item feature-style-society">
                    STYLE Society
                </div>
            </div>

        </div>
        
          {/* Detailed Sections */}
        <div className="section style-studio">
            <div className="style_studio_img"></div>
             <h2>STYLE STUDIO</h2>
                <p>
                    The Style Studio is your creative space to design custom
                    clothing and experiment with styles and fabrics.
                    Whether you're a beginner or a professional, showcase
                    your designs, collaborate with others, and explore new
                    trends. Unleash your creativity and redefine fashion!    
                </p>
                <button className="explore-button">Explore</button>
        </div>
        <div className="section style-market">
            <h2>STYLE MARKET</h2>
                <p>
                    The Style Market is your go-to marketplace for unique,
                    custom-made fashion. Connect with designers, explore
                    exclusive clothing collections, and shop one-of-a-kind
                    pieces. Whether you're looking for personalized designs
                    or the latest trends, the Style Market brings
                    creativity and style together in one place.
                </p>
                 
        </div>
        <div className="section inspire-zone">
          <div className="inspire_zone_img"></div>
        <h2>INSPIRE ZONE</h2>
        <p>
          The Style Market is your go-to marketplace for unique, custom-made
          fashion. Connect with designers, explore exclusive clothing
          collections, and shop one-of-a-kind pieces. Whether you're looking for
          personalized designs or the latest trends, the Style Market brings
          creativity and style together in one place.
        </p>
        <button className="explore-button">Explore</button>
      </div>

      {/* Style Society Section */}
      <div className="section style-society">
        <h2>STYLE SOCIETY</h2>
        <p>
          The Style Society is a vibrant community for fashion enthusiasts,
          designers, and fashion students. Share ideas, collaborate on
          projects, participate in design challenges, and connect with
          like-minded creatives. Join us to inspire and be inspired!
        </p>
        
      </div>

      {/* Design Contests Section */}
      <div className="section design-contests">
        <div className="design_contests_img"></div>
        <h2>DESIGN CONTESTS</h2>
        <p>
          Showcase your creativity, compete with the best, and win exciting
          rewards in our design challenges!
        </p>
        <button className="explore-button">Explore</button>
      </div>

      {/* About Us Section */}
      <div className="section about-us">
        <h2>About Us</h2>
        <p>
          Welcome to Styloft, a platform dedicated to transforming the world of
          fashion design. We provide a space where designers, students, and
          enthusiasts can unleash their creativity using advanced tools and
          collaborate seamlessly. At Styloft, we aim to bridge the gap between
          innovation and accessibility, empowering users to bring their unique
          fashion visions to life. Together, we inspire and shape the future of
          style.
        </p>
      </div>
               
                   
              
        </>   

                  
          
              
    );
}


