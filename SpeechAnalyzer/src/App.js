// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Features from './components/Features'; // Import the Features component
import AboutUs from './components/AboutUs'; // Import the AboutUs component
import Services from './components/Services'; // Import the Services component
import SentimentAnalyser from './components/SentimentAnalyser'; // Import the SentimentAnalyser component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem('isAuthenticated', 'true'); // Update local storage
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated'); // Remove from local storage
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              isAuthenticated={isAuthenticated}
              user={user}
              onLogout={handleLogout}
            />
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/features" element={<Features />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/sentiment-analyzer" element={<SentimentAnalyser userEmail={user?.email} />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App;
