import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoLight from '../../../assets/images/styloft-logo.png';
import '../../../assets/css/Home/navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const profilePic = localStorage.getItem('profilePicture');

    if (token) {
      setIsLoggedIn(true);
      setProfilePicture(profilePic || `https://robohash.org/${token}.png?set=set5`);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Hide navbar when scrolling down
      } else {
        setIsVisible(true); // Show navbar when scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('profilePicture');
    setIsLoggedIn(false);
    setProfilePicture('');
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
      setProfilePicture('/path/to/fallback-image.png'); // Use a fallback image
    }
  };

  return (
    <nav className={`navbar ${isVisible ? 'show' : 'hide'}`}>
      <div className="navbar-logo">
        <NavLink to="/">
          <img src={logoLight} alt="Logo" className="logo" />
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/">HOMEPAGE</NavLink></li>
        <li><NavLink to="/stylestudio">STYLE STUDIO</NavLink></li>
        <li><NavLink to="/contest">CONTEST</NavLink></li>
        <li><NavLink to="#inspire-zone">INSPIRE ZONE</NavLink></li>
        <li><NavLink to="/stylesociety">STYLE SOCIETY</NavLink></li>
        <li><NavLink to="/styleMarket">STYLE MARKET</NavLink></li>
      </ul>
      <div className="navbar-login">
        {isLoggedIn ? (
          <div className="profile-section">
            <img 
              src={profilePicture} 
              alt="Profile" 
              className="profile-picture" 
              onClick={toggleLogout} 
              onError={handleImageError} 
            />
            {showLogout && <button className='logout' onClick={handleLogout}>Logout</button>}
          </div>
        ) : (
          <button onClick={() => window.location.href = '/login'}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;