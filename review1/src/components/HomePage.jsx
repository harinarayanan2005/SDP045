import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';

function HomePage() {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleUserClick = () => {
    navigate('/user');
  };

  return (
    <div>
      <header>
        <div className="logo">
          <img src={require('./images/logo2.jpeg')} alt="Logo" width="80" height="80" />
        </div>
        <nav>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/admin" onClick={handleAdminClick}>Admin</Link></li>
            <li><Link to="/user" onClick={handleUserClick}>User</Link></li>
          </ul>
        </nav>
        <button className="login-btn"><Link to="/login">Log In</Link></button>
      </header>
      <main>
        <div className="background-image"></div>
      </main>
      <footer>
        <div className="footer-container">
          <h2>CONTACT INFO</h2>
          <p>Kovaipudur,Coimbatore - 641042,TamilNadu</p>
          <p>Phone: 0422-2984567 / 0422-2984568</p>
          <p>Email: <a href="mailto:info@skct.edu.in">info@skct.edu.in</a></p>
          <p><a href="mailto:principal@skct.edu.in">principal@skct.edu.in</a></p>
          <div className="social-media-links">
            <p className="follow-us">Follow us on:</p>
            <a href="https://www.linkedin.com/school/skctofficial/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a href="https://www.instagram.com/skct__official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
