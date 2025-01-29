import React from 'react';
import { NavLink } from 'react-router-dom';
import logoLight from '../../../assets/images/styloft-logo.png';
import '../../../assets/css/Home/navbar.css';

const Navbar = () => {
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
                <li><a href="#contest">CONTEST</a></li>
                <li><a href="#inspire-zone">INSPIRE ZONE</a></li>
                <li><a href="stylesociety">STYLE SOCIETY</a></li>
                <li><a href="#style-market">STYLE MARKET</a></li>
            </ul>
            <div className="navbar-login">
                <button>Login</button>
            </div>
        </nav>
    );
};

export default Navbar;
