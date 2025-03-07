import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../../assets/css/Home/navbar.css";
import logoLight from "../../../assets/images/styloft-logo.png";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLastScrollY(window.scrollY);
    const token = localStorage.getItem("authToken");
    const profilePic = localStorage.getItem("profilePicture");

    if (token) {
      setIsLoggedIn(true);
      setProfilePicture(profilePic || `https://robohash.org/${token}.png?set=set5`);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false); // Hide navbar when scrolling down
      } else {
        setIsVisible(true); // Show navbar when scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("profilePicture");
    setIsLoggedIn(false);
    setProfilePicture("");
    setShowLogout(false);
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleImageError = () => {
    if (retryCount < 3) {
      setRetryCount(retryCount + 1);
      setTimeout(() => {
        setProfilePicture(profilePicture + `?retry=${retryCount}`);
      }, 1000);
    } else {
      setProfilePicture("/path/to/fallback-image.png"); // Use a fallback image
    }
  };

  const navLinks = [
    { path: "/", label: "HOMEPAGE" },
    { path: "/stylestudio", label: "STYLE STUDIO" },
    { path: "/contest", label: "CONTEST" },
    { path: "/inspire-zone", label: "INSPIRE ZONE" },
    { path: "/stylesociety", label: "STYLE SOCIETY" },
    { path: "/styleMarket", label: "STYLE MARKET" },
  ];

  return (
    <nav className={`navbar ${isVisible ? "visible" : "hidden"} ${window.scrollY > 50 ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <NavLink to="/">
              <img src={logoLight || "/placeholder.svg"} alt="Logo" className="logo" />
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-button">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Login/Profile */}
          <div className="navbar-login">
            {isLoggedIn ? (
              <div className="profile-section">
                <button onClick={toggleLogout} className="profile-button">
                  <div className="profile-picture-container">
                    <img
                      src={profilePicture || "/placeholder.svg"}
                      alt="Profile"
                      className="profile-picture"
                      onError={handleImageError}
                    />
                  </div>
                </button>

                {/* Logout dropdown */}
                {showLogout && (
                  <div className="logout-dropdown">
                    <div className="dropdown-header">
                      <NavLink to="/profile" className="profile-link">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="profile-icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                        Your Profile
                      </NavLink>
                    </div>
                    <button onClick={handleLogout} className="logout-button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="logout-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => (window.location.href = "/login")} className="login-button">
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;