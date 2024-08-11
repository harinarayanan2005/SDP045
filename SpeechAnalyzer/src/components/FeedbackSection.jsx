// FeedbackSection.jsx
import React, { useState } from 'react';
import './FeedbackSection.css';

const FeedbackSection = ({ user }) => {
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    // You can replace this URL with your actual backend endpoint
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user ? user.email : '',
          feedback,
        }),
      });

      if (response.ok) {
        setFeedback('');
        setFeedbackSubmitted(true);
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <section className="feedback-section">
      <h2>We Value Your Feedback</h2>
      {feedbackSubmitted ? (
        <p>Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleFeedbackSubmit} className="feedback-form">
          {error && <p className="error-message">{error}</p>}
          <textarea
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Enter your feedback here..."
            rows="4"
            required
          ></textarea>
          <button type="submit">Submit Feedback</button>
        </form>
      )}
    </section>
  );
};

export default FeedbackSection;
