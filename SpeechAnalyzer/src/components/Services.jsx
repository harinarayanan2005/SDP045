import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleExploreClick = (service) => {
    if (!isAuthenticated) {
      alert('You need to be logged in to access this service.');
      navigate('/login');
    } else {
      navigate(`/services/${service}`);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="services">
      <header className="services-header">
        <button className="home-button" onClick={handleGoHome}>
          <i className="fa fa-home"></i>
        </button>
        <h1>Our Services</h1>
        <p>Explore our range of advanced speech analysis solutions tailored to meet your needs.</p>
      </header>
      <section className="services-list">
        <div className="service-card">
          <h2>Speech-to-Text</h2>
          <p>
            Convert spoken language into written text with high accuracy and efficiency. Our Speech-to-Text service
            supports multiple languages and dialects, making it perfect for transcription, note-taking, and more.
          </p>
          <button className="explore-button" onClick={() => handleExploreClick('speech-to-text')}>Explore</button>
        </div>
        <div className="service-card">
          <h2>Sentiment Analysis</h2>
          <p>
            Understand the emotions and sentiments behind spoken or written content. Our Sentiment Analysis tool
            helps you gauge opinions, feedback, and emotional tone from various types of content.
          </p>
          <button className="explore-button" onClick={() => handleExploreClick('sentiment-analyzer')}>Explore</button>
        </div>
        <div className="service-card">
          <h2>Grammar Rectifier</h2>
          <p>
            Enhance the quality of your text by detecting and correcting grammatical errors. Our Grammar Rectifier
            service ensures that your content is clear, professional, and error-free.
          </p>
          <button className="explore-button" onClick={() => handleExploreClick('grammar-rectifier')}>Explore</button>
        </div>
      </section>
    </div>
  );
};

export default Services;
