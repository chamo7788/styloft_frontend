import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronRight, Facebook, Instagram, Mail, Phone, Scissors, Sparkles, Palette, Zap, Star } from "lucide-react"
import TypewriterComponent from "typewriter-effect"
import "../assets/css/Home/home.css"

import Stylemarket from "../assets/images/StyleMarket.jpg"
import Stylestudio from "../assets/images/StyleStudio.jpg"
import Stylesociety from "../assets/images/style_society.jpg"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="home-container">
      <div
        className="cursor-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      ></div>

      <FloatingElements />
      <HeroSection />
      <AboutSection />
      <StyleSection />

      <CTASection />
    </div>
  )
}

function FloatingElements() {

}

function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="hero-section">
      {/* Hero Background with Parallax */}
      <div className="hero-background" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>



      {/* Decorative Elements */}
      <div className="hero-decorative-elements">
        <div className="decorative-circle circle-1"></div>
        <div className="decorative-circle circle-2"></div>
        <div className="decorative-line line-1"></div>
        <div className="decorative-line line-2"></div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text-container"
        >
          <div className="hero-badge">Fashion Design Platform</div>

          <h1 className="hero-title">
            <span className="hero-title-animation">Styloft</span>
          </h1>

          <div className="hero-divider">
            <div className="divider-accent"></div>
          </div>

          <p className="hero-description" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Your all-in-one fashion design platform that empowers creators to design,
            collaborate, and showcase innovative fashion concepts in a vibrant community.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hero-buttons"
          >
            <Link to="/register" className="button primary-button">
              <span className="button-text">Get Started</span>
              <span className="button-icon">→</span>
            </Link>
            <a href="https://styloft.live" target="_blank" rel="noopener noreferrer" className="button outline-button">
              <span className="button-text">Learn More</span>
            </a>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
      >
        <span className="scroll-text">Scroll</span>
        <ChevronRight className="scroll-icon" />
      </motion.div>
    </section>
  )
}

function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const features = [
    {
      icon: <Sparkles className="feature-icon" />,
      title: "Creative Freedom",
      description:
        "Express your unique vision with our intuitive design tools that empower your creativity without limitations.",
    },
    {
      icon: <Scissors className="feature-icon" />,
      title: "Collaboration",
      description:
        "Connect with designers and manufacturers to bring your fashion concepts to life through seamless teamwork.",
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Innovation",
      description: "Stay ahead with cutting-edge tools and technologies that push the boundaries of fashion design.",
    },
    {
      icon: <Palette className="feature-icon" />,
      title: "Global Reach",
      description: "Showcase your work to a worldwide audience and connect with fashion enthusiasts across the globe.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section ref={ref} className="about-section" id="about">
      {/* Background Elements */}
      <div className="about-bg-pattern"></div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="section-header"
        >
          <div className="section-badge">Who We Are</div>
          <h2 className="section-title">About Styloft</h2>
          <div className="section-divider">
            <div className="divider-accent"></div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2 } },
          }}
          className="about-intro"
        >
          Welcome to <span className="highlight">Styloft</span> – a platform where creativity and innovation come
          together in fashion design. We empower designers, students, and businesses to create, collaborate, and
          showcase their unique designs through our comprehensive suite of tools and vibrant community.
        </motion.p>

        <motion.div variants={containerVariants} initial="hidden" animate={controls} className="feature-grid">
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="feature-card">
                <div className="feature-icon-container">
                  {feature.icon}
                  <div className="icon-glow"></div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-card-accent"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.6, delay: 0.8 } },
          }}
          className="about-cta"
        >
          <p className="cta-text">Join Styloft today and be part of the future of fashion design.</p>
        </motion.div>
      </div>
    </section>
  )
}

function StyleSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const styles = [
    {
      title: "STYLE MARKET",
      image: Stylemarket,
      description:
        "Connect with designers, explore exclusive clothing collections, and shop one-of-a-kind pieces in our vibrant marketplace.",
      link: "/stylemarket",
      accent: "#FF6B6B",
    },
    {
      title: "STYLE STUDIO",
      image: Stylestudio,
      description: "Design and customize your own fashion pieces with our intuitive tools and professional features.",
      link: "/stylestudio",
      accent: "#4ECDC4",
    },
    {
      title: "STYLE SOCIETY",
      image: Stylesociety,
      description: "Join our community of fashion enthusiasts, share ideas, and collaborate with fellow designers.",
      link: "/stylesociety",
      accent: "#FFD166",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section ref={ref} className="style-section" id="explore">
      {/* Background Elements */}
      <div className="bg-circle top-right"></div>
      <div className="bg-circle bottom-left"></div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="section-header"
        >
          <div className="section-badge">Our Services</div>
          <h2 className="section-title">Explore Now</h2>
          <div className="section-divider">
            <div className="divider-accent"></div>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate={controls} className="style-grid">
          {styles.map((style, index) => (
            <motion.div key={index} variants={itemVariants} className="style-card-container">
              <div className="style-card">
                <div className="style-image">
                  <img src={style.image || "/placeholder.svg"} alt={style.title} className="style-img" />
                </div>

                <div className="style-overlay"></div>

                <div className="style-content">
                  <div className="style-tag" style={{ backgroundColor: style.accent }}>
                    {index + 1}
                  </div>
                  <h3 className="style-title">{style.title}</h3>
                  <p className="style-description">{style.description}</p>
                  <Link to={style.link} className="style-button" style={{ backgroundColor: style.accent }}>
                    <span>Explore</span>
                    <ChevronRight className="button-icon-small" />
                  </Link>
                </div>

                <div className="card-corner" style={{ borderColor: style.accent }}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CreativeShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const showcaseItems = [
    {
      title: "Trending Designs",
      description: "Explore the latest fashion trends and designs from our creative community.",
      image: Stylemarket,
      stats: [
        { label: "New Designs", value: "250+" },
        { label: "Trending Styles", value: "45" },
      ],
    },
    {
      title: "Designer Spotlight",
      description: "Discover talented designers and their unique fashion creations.",
      image: Stylemarket,
      stats: [
        { label: "Featured Designers", value: "120" },
        { label: "Countries", value: "35+" },
      ],
    },
    {
      title: "Fashion Events",
      description: "Stay updated with upcoming fashion shows, exhibitions, and events.",
      image: Stylemarket,
      stats: [
        { label: "Upcoming Events", value: "18" },
        { label: "Past Events", value: "200+" },
      ],
    },
  ]

  return (
    <section ref={ref} className="creative-showcase" id="showcase">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="section-header"
        >
          <div className="section-badge">Creative Showcase</div>
          <h2 className="section-title">Discover Inspiration</h2>
          <div className="section-divider">
            <div className="divider-accent"></div>
          </div>
        </motion.div>

        <div className="showcase-tabs">
          <div className="tab-headers">
            {showcaseItems.map((item, index) => (
              <button
                key={index}
                className={`tab-header ${activeTab === index ? "active" : ""}`}
                onClick={() => setActiveTab(index)}
              >
                {item.title}
                {activeTab === index && <div className="tab-indicator"></div>}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {showcaseItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: activeTab === index ? 1 : 0,
                  x: activeTab === index ? 0 : 20,
                  display: activeTab === index ? "flex" : "none",
                }}
                transition={{ duration: 0.5 }}
                className="tab-panel"
              >
                <div className="tab-image">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} />
                  <div className="image-overlay"></div>
                </div>

                <div className="tab-info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <div className="tab-stats">
                    {item.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="tab-stat">
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <button className="button primary-button tab-button">
                    <span className="button-text">View All</span>
                    <ChevronRight className="button-icon-small" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="cta-section">
      {/* Pattern Background */}
      <div className="cta-pattern-bg"></div>

      {/* Animated Shapes */}
      <div className="cta-shapes">
        <div className="cta-shape shape-1"></div>
        <div className="cta-shape shape-2"></div>
        <div className="cta-shape shape-3"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container cta-container"
      >
        <div className="cta-badge">
          <Star className="badge-icon" />
          <span>Join Our Community</span>
        </div>

        <h2 className="cta-title">Ready to Transform Your Fashion Ideas?</h2>
        <p className="cta-description">
          Join Styloft today and become part of a growing community of fashion innovators. Create, collaborate, and
          showcase your designs to the world.
        </p>

        <div className="cta-buttons">
          <Link to="/register" className="button primary-button">
            <span className="button-text">Sign Up Now</span>
            <span className="button-icon">→</span>
          </Link>
          <Link to="/login" className="button outline-button white-outline">
            <span className="button-text">Sign In</span>
          </Link>
        </div>

        <div className="cta-testimonial">
          <div className="testimonial-avatars">
            <div className="avatar avatar-1"></div>
            <div className="avatar avatar-2"></div>
            <div className="avatar avatar-3"></div>
            <div className="avatar avatar-more">+</div>
          </div>
          <div className="testimonial-text">
            <div className="testimonial-stars">
              ★★★★★ <span className="testimonial-rating">4.9/5</span>
            </div>
            <p>from over 1,000 designer reviews</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

