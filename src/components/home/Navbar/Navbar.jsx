import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoLight from '../../../assets/images/styloft-logo.png';
import '../../../assets/css/Home/navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const profilePic = localStorage.getItem('profilePicture');

    if (token) {
      setIsLoggedIn(true);

      // Set profile picture or fallback to an auto-generated one
      setProfilePicture(
        profilePic || `https://robohash.org/${token}.png?set=set5`
      );
    }
  }, []);

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
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/home">
          <img src={logoLight} alt="Logo" className="logo" />
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li><a href="homepage">HOMEPAGE</a></li>
        <li><a href="stylestudio">STYLE STUDIO</a></li>
        <li><a href="contest">CONTEST</a></li>
        <li><a href="#inspire-zone">INSPIRE ZONE</a></li>
        <li><a href="stylesociety">STYLE SOCIETY</a></li>
        <li><a href="styleMarket">STYLE MARKET</a></li>
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
