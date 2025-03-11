"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "../assets/css/Home/home.css"
import { ReactTyped } from "react-typed"
 
import Stylemarket from "../assets/images/StyleMarket.jpg"
import Stylestudio from "../assets/images/StyleStudio.jpg"
import Stylesociety from "../assets/images/style_society.jpg"

export default function Home() {
  return (
    <div className="home-container">
      <HeroSection />
      <AboutSection />
      <StyleSection />
      <CTASection />
    </div>
  )
}

function HeroSection() {
  return (
    <div className="hero-section" id="hero-section">
      <div className="hero-overlay"></div>

      <div className="intro">
       
        <h1>Styloft</h1>
        <div className="hero-divider"></div>
        <ReactTyped
          className="typed-text"
          strings={["Design Your Style", "Create Your Fashion", "Inspire the World"]}
          typeSpeed={60}
          backSpeed={80}
          loop
        />
      </div>
    </div>
  )
}

function AboutSection() {
  const aboutRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")
          }
        })
      },
      { threshold: 0.2 },
    )

    if (aboutRef.current) {
      observer.observe(aboutRef.current)
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current)
      }
    }
  }, [])

  const features = [
    { icon: "✨", title: "Creative Freedom", text: "Express your unique vision" },
    { icon: "🔄", title: "Collaboration", text: "Connect with designers" },
    { icon: "🚀", title: "Innovation", text: "Stay ahead with cutting-edge tools" },
    { icon: "🌐", title: "Global Reach", text: "Showcase your work worldwide" },
  ]

  return (
    <div ref={aboutRef} className="about-section" id="about-section">
      <div className="about-container">
        <h2 className="about-title">About Styloft</h2>
        <div className="about-content">
          <p className="about-intro">
            Welcome to <strong>Styloft</strong> – a platform where creativity and innovation come together in fashion
            design. Styloft empowers designers, students, and businesses to create, collaborate, and showcase their
            unique designs.
          </p>

          <div className="about-features">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>

          <p className="about-cta">Join Styloft today and be part of the future of fashion design.</p>
        </div>
      </div>
    </div>
  )
}

function StyleSection() {
  const sectionRef = useRef(null); 

  const styles = [
    {
      title: "STYLE MARKET",
      image: Stylemarket,
      description:
        "Connect with designers, explore exclusive clothing collections, and shop one-of-a-kind pieces in our vibrant marketplace.",
    },
    {
      title: "STYLE STUDIO",
      image: Stylestudio,
      description: "Design and customize your own fashion pieces with our intuitive tools and professional features.",
    },
    {
      title: "STYLE SOCIETY",
      image: Stylesociety,
      description: "Join our community of fashion enthusiasts, share ideas, and collaborate with fellow designers.",
    },
  ];

 
  return (
    <section ref={sectionRef} className="style-section" id="style-section">
      <div className="style-header">
        <h2 className="style-title">Explore Now</h2>
        <div className="style-title-divider"></div>
      </div>

      <div className="style-grid">
        {styles.map((style, index) => (
          <div key={index} className="style-card" style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="style-image">
              <img src={style.image || "/placeholder.svg"} alt={style.title} />
            </div>
            <div className="style-overlay">
              <h3>{style.title}</h3>
              <p>{style.description}</p>
              <Link
                to={
                  style.title === "STYLE MARKET"
                    ? "/stylemarket"
                    : style.title === "STYLE STUDIO"
                      ? "/stylestudio"
                      : "/stylesociety"
                }
                className="style-button"
              >
                Explore
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>Ready to Transform Your Fashion Ideas?</h2>
        <p>Join Styloft today and become part of a growing community of fashion innovators.</p>
        <div className="cta-buttons">
          <Link to="/register" className="primary-button">
            Sign Up Now
          </Link>
          <Link to="/login" className="secondary-button">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  )
}

