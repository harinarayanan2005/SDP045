import React, { useEffect, useState } from 'react';
import './Snackbar.css';

const Snackbar = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <div className={`snackbar ${type} ${isVisible ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default Snackbar;
