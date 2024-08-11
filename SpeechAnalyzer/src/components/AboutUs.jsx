import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css'; // Import the CSS file

// Import images from the components/images directory
import manImage from './images/profile.png';
import jamieImage from './images/man.png';
import jordanImage from './images/user.png';
import taylorImage from './images/boy.png';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1>About Us</h1>
        <p>Meet the passionate team behind our innovation.</p>
      </header>
      <section className="about-us-intro">
        <h2>Our Story</h2>
        <p>
          We are a vibrant team of four innovators dedicated to creating a standout web application. Our goal was to blend cutting-edge technology with sleek design to deliver an exceptional user experience.
        </p>
        <p>
          Our journey involved intense collaboration, where each member contributed unique skills to shape the project from concept to launch. This synergy enabled us to overcome challenges and achieve our vision.
        </p>
      </section>
      <section className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src={manImage} alt="Anish Ram" className="team-photo" />
            <div className="team-member-details">
              <h3>Anish Ram</h3>
              <p><strong>Degree:</strong> B.E Computer Science and Engineering</p>
              <p><strong>Year:</strong> Third Year</p>
              <p>Anish’s innovative thinking and technical expertise were key to our application's core development.</p>
            </div>
          </div>
          <div className="team-member">
            <img src={jamieImage} alt="Adarsh M S" className="team-photo" />
            <div className="team-member-details">
              <h3>Adarsh M S</h3>
              <p><strong>Degree:</strong> B.E Computer Science and Engineering</p>
              <p><strong>Year:</strong> Third Year</p>
              <p>Adarsh’s design skills ensured that our application is visually captivating and user-friendly.</p>
            </div>
          </div>
          <div className="team-member">
            <img src={jordanImage} alt="Aswin M" className="team-photo" />
            <div className="team-member-details">
              <h3>Aswin M</h3>
              <p><strong>Degree:</strong> B.E Computer Science and Engineering</p>
              <p><strong>Year:</strong> Third Year</p>
              <p>Aswin’s problem-solving abilities were crucial in tackling technical hurdles.</p>
            </div>
          </div>
          <div className="team-member">
            <img src={taylorImage} alt="Harinarayanan N" className="team-photo" />
            <div className="team-member-details">
              <h3>Harinarayanan N</h3>
              <p><strong>Degree:</strong> B.E Computer Science and Engineering</p>
              <p><strong>Year:</strong> Third Year</p>
              <p>Hari’s strategic vision and leadership were instrumental in guiding the project to completion.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="about-us-footer">
        <p>&copy; {new Date().getFullYear()} Our Web Application. All rights reserved.</p>
      </footer>
      <div className="back-button-container">
        <Link to="/" className="back-button">Back to Homepage</Link>
      </div>
    </div>
  );
};

export default AboutUs;