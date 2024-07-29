import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us">
      <h1>About Us</h1>
      <p>
        Our institution is a leading provider of education and research in the field of [Field of Study]. We are committed to providing our students with a world-class education and preparing them for successful careers.
      </p>
      <h2>Our History</h2>
      <p>
        Our institution was founded in [Year] with a mission to provide high-quality education to students from all over the world. Since then, we have grown to become one of the largest and most respected institutions in the field.
      </p>
      <h2>Our Mission</h2>
      <p>
        Our mission is to provide students with a comprehensive education that prepares them for successful careers and lifelong learning. We are committed to excellence in teaching, research, and service to the community.
      </p>
      <h2>Our Values</h2>
      <ul>
        <li>Excellence in teaching and research</li>
        <li>Student-centered learning</li>
        <li>Diversity and inclusion</li>
        <li>Community engagement and service</li>
      </ul>
      <h2>Our Leadership</h2>
      <div className="leadership">
        <img src="https://example.com/president.jpg" alt="President" />
        <h3>President's Message</h3>
        <p>
          Welcome to our institution! I am proud to lead a team of dedicated faculty and staff who are committed to providing our students with a world-class education.
        </p>
      </div>
      <h2>Our Campus</h2>
      <p>
        Our campus is located in [City], [State] and features state-of-the-art facilities, including [list facilities].
      </p>
      <h2>Our Academic Programs</h2>
      <ul>
        <li>Bachelor's degree in [Field of Study]</li>
        <li>Master's degree in [Field of Study]</li>
        <li>Doctoral degree in [Field of Study]</li>
      </ul>
      <h2>Our Research</h2>
      <p>
        Our institution is committed to advancing knowledge in the field of [Field of Study] through research and innovation. Our faculty and students are engaged in a variety of research projects, including [list research projects].
      </p>
      <h2>Our Community</h2>
      <p>
        We are proud to be a part of the [City] community and are committed to serving the needs of our students, faculty, and staff.
      </p>
      <h2>Get in Touch</h2>
      <p>
        If you have any questions or would like to learn more about our institution, please don't hesitate to contact us.
      </p>
      <div className="contact-info">
        <p>
          Address: [Address]
        </p>
        <p>
          Phone: [Phone Number]
        </p>
        <p>
          Email: [Email Address]
        </p>
      </div>
    </div>
  );
}

export default AboutUs;