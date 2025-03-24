import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../../../assets/css/Home/footer.css";
import logo from "../../../assets/images/Styloft-white.png";
import { FaFacebookF, FaGoogle, FaInstagram } from "react-icons/fa";

export default function Footer() {
    useEffect(() => {
        const handleScroll = () => {
            const scrollToTopButton = document.querySelector(".scroll-to-top");
            if (window.scrollY > 300) {
                scrollToTopButton.classList.add("show");
            } else {
                scrollToTopButton.classList.remove("show");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <footer className="footer-container">
            <div className="footer-left">
                <div className="footer-logo">
                    <img src={logo} alt="Styloft Logo" />
                </div>
                <p className="footer-email">styloft.work@gmail.com</p>
                <p className="footer-phone">+94 76 002 9769</p>
                <div className="footer-social-icons">
                    <a href="https://www.facebook.com/profile.php?id=61573425719039&rdid=GS4gbjCtoHpWhgoc&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F15rfSTq2Ka%2F#" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF className="social-logo" style={{ color: "white" }} />
                    </a>
                    <a href="https://pinsara20.github.io/Styloft_Marketing_Web/" target="_blank" rel="noopener noreferrer">
                        <FaGoogle className="social-logo" style={{ color: "white" }} />
                    </a>
                    <a href="https://www.instagram.com/styloft._/?igsh=MXhmaHcyOWttdTNlbA%3D%3D#" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="social-logo" style={{ color: "white" }} />
                    </a>
                </div>
            </div>

            <div className="footer-middle">
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/features">Features</NavLink></li>
                    <li><NavLink to="/pricing">Pricing</NavLink></li>
                    <li><NavLink to="/reviews">Reviews</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                </ul>
            </div>

            <div className="footer-right">
                <h2>Create Your Fashion</h2>
                <h2 className="highlight">Inspire the World!!</h2>
            </div>

            <div className="footer-bottom">
                <p>2025© SE-Group-32 Styloft.live</p>
            </div>

            <button className="scroll-to-top" onClick={scrollToTop}>↑</button>
        </footer>
    );
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
