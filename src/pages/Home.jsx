import React from "react";
import "../assets/css/Home/home.css";

export default function Home() {
  return (
    <>
      <div className="home-container">
        {/* Hero Section */}
        <HeroSection />
        {/* Features Section */}
        <FeaturesSection />
        {/* Detailed Sections */}
        <DetailedSections />
      </div>
    </>
  );
}

function HeroSection() {
  return (
    <div className="hero-section">
      <div className="hero-image"></div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="features-grid">
      <FeatureItem className="feature-style-market" title="STYLE Market" />
      <FeatureItem className="feature-style-studio" title="STYLE Studio" />
      <FeatureItem className="feature-inspire-zone" title="INSPIRE Zone" />
      <FeatureItem className="feature-style-society" title="STYLE Society" />
    </div>
  );
}

function FeatureItem({ className, title }) {
  return <div className={`feature-item ${className}`}>{title}</div>;
}

function DetailedSections() {
  return (
    <>
      <Section className="style-studio" title="STYLE STUDIO" imgClass="style_studio_img" link="/stylestudio">
        The Style Studio is your creative space to design custom clothing and experiment with styles and fabrics. Whether you're a beginner or a professional, showcase your designs, collaborate with others, and explore new trends. Unleash your creativity and redefine fashion!
      </Section>
      <Section className="style-market" title="STYLE MARKET">
        The Style Market is your go-to marketplace for unique, custom-made fashion. Connect with designers, explore exclusive clothing collections, and shop one-of-a-kind pieces. Whether you're looking for personalized designs or the latest trends, the Style Market brings creativity and style together in one place.
      </Section>
      <Section className="inspire-zone" title="INSPIRE ZONE" imgClass="inspire_zone_img" link="/inspirezone">
        The Style Market is your go-to marketplace for unique, custom-made fashion. Connect with designers, explore exclusive clothing collections, and shop one-of-a-kind pieces. Whether you're looking for personalized designs or the latest trends, the Style Market brings creativity and style together in one place.
      </Section>
      <Section className="style-society" title="STYLE SOCIETY" imgClass="style_society_img" link="/stylesociety">
        The Style Society is a vibrant community for fashion enthusiasts, designers, and fashion students. Share ideas, collaborate on projects, participate in design challenges, and connect with like-minded creatives. Join us to inspire and be inspired!
      </Section>
      <Section className="design-contests" title="DESIGN CONTESTS" imgClass="design_contests_img" link="/contest">
        Showcase your creativity, compete with the best, and win exciting rewards in our design challenges!
      </Section>
      <Section className="about-us" title="About Us">
        Welcome to Styloft, a platform dedicated to transforming the world of fashion design. We provide a space where designers, students, and enthusiasts can unleash their creativity using advanced tools and collaborate seamlessly. At Styloft, we aim to bridge the gap between innovation and accessibility, empowering users to bring their unique fashion visions to life. Together, we inspire and shape the future of style.
      </Section>
    </>
  );
}

function Section({ className, title, imgClass, children, link }) {
  return (
    <div className={`section ${className}`}>
      {imgClass && <div className={imgClass}></div>}
      <h2>{title}</h2>
      <p>{children}</p>
      <a href={link} className="explore-button">Explore</a>
    </div>
  );
}