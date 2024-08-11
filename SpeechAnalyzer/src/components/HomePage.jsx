import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import './HomePage.css';

const HomePage = ({ isAuthenticated, user, onLogout }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  const handleFeaturesClick = () => {
    if (!isAuthenticated) {
      setPopupVisible(true);
    } else {
      navigate('/features');
    }
  };

  const handleServicesClick = () => {
    if (!isAuthenticated) {
      setPopupVisible(true);
    } else {
      navigate('/services');
    }
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  const handleGoToLogin = () => {
    navigate('/login');
    setPopupVisible(false);
  };

  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">TalkTrack</div>
        <nav className="nav">
          <Link to="/about" className="nav-link">About Us</Link>
          <a href="#services" className="nav-link" onClick={handleServicesClick}>Services</a>
          <button onClick={handleFeaturesClick} className="nav-link">Features</button>
          {isAuthenticated ? (
            <ProfileIcon user={user} onLogout={onLogout} />
          ) : (
            <Link to="/login" className="cta-button">Get Started</Link>
          )}
        </nav>
      </header>
      <section className="hero">
        <h1>Welcome to TalkTrack</h1>
        <p>Your ultimate solution for speech analysis.</p>
        {!isAuthenticated && <Link to="/login" className="cta-button">Get Started</Link>}
      </section>
      <footer className="footer">
        <p>© 2024 TalkTrack. All rights reserved.</p>
        <p>Contact us: narayananh147@gmail.com</p>
        <p>Follow us on social media:</p>
        <div className="social-media">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
        </div>
      </footer>

      {/* Popup Message */}
      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>You need to be logged in to access this page.</p>
            <button onClick={handleGoToLogin} className="popup-button">Go to Login</button>
            <button onClick={handlePopupClose} className="popup-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
