import React from 'react';
import { useNavigate } from 'react-router-dom';
import speechToTextImg from './images/speech-to-text-icon.jpeg'; 
import sentimentAnalysisImg from './images/sentiment-analysis.jpeg';
import realTimeTranscriptionImg from './images/realtime.jpeg'; 
import languageTranslationImg from './images/language transalting.jpeg'; 
import voiceRecognitionImg from './images/keyword spotting.jpeg'; 
import keywordSpottingImg from './images/voic.jpeg'; 
import './Features.css';

const Features = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="features-page">
      <header className="features-header">
        <h1>Our Features</h1>
        <p>Explore the powerful capabilities of our speech analyzing application.</p>
      </header>
      <section className="features-section">
        <div className="feature">
          <img src={speechToTextImg} alt="Speech to Text" className="feature-icon" />
          <h2>Speech to Text</h2>
          <p>Convert spoken words into written text with high accuracy.</p>
        </div>
        <div className="feature">
          <img src={sentimentAnalysisImg} alt="Sentiment Analysis" className="feature-icon" />
          <h2>Sentiment Analysis</h2>
          <p>Analyze the sentiment of a speech to determine its emotional tone.</p>
        </div>
        <div className="feature">
          <img src={realTimeTranscriptionImg} alt="Real-Time Transcription" className="feature-icon" />
          <h2>Real-Time Transcription</h2>
          <p>Get live transcription of speech in real-time.</p>
        </div>
        <div className="feature">
          <img src={languageTranslationImg} alt="Language Translation" className="feature-icon" />
          <h2>Language Translation</h2>
          <p>Translate speech into multiple languages instantly.</p>
        </div>
        <div className="feature">
          <img src={voiceRecognitionImg} alt="Voice Recognition" className="feature-icon" />
          <h2>Voice Recognition</h2>
          <p>Identify speakers and recognize different voices accurately.</p>
        </div>
        <div className="feature">
          <img src={keywordSpottingImg} alt="Keyword Spotting" className="feature-icon" />
          <h2>Keyword Spotting</h2>
          <p>Detect specific keywords or phrases in a speech.</p>
        </div>
      </section>
      <div className="back-button-container">
        <button className="back-button" onClick={handleHomeClick}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Features;
