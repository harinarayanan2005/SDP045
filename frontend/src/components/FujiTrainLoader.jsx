import React, { useEffect, useState } from 'react';
import './FujiTrainLoader.css';

const INFERENCE_STEPS = [
  'Ingesting High-Resolution Audio Waveform...',
  'Executing Neural Speech-to-Text Tokenization...',
  'Extracting 6-Factor Vocal Emotion & Sentiment...',
  'Compiling Speech Telemetry & Delivery Report...'
];

export const FujiTrainLoader = ({ onComplete, duration = 1800, title = 'Processing Speech Intelligence' }) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const totalTime = duration;
    const intervalTime = 40;
    const increment = (intervalTime / totalTime) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        const step = Math.min(
          INFERENCE_STEPS.length - 1,
          Math.floor((next / 100) * INFERENCE_STEPS.length)
        );
        setCurrentStepIndex(step);

        if (next >= 100) {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 250);
          }
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fuji-loader-overlay">
      <div className="fuji-scenic-card">
        {/* Scenic Artwork Header */}
        <div className="fuji-stage">
          {/* Ambient Sun & Atmospheric Aura */}
          <div className="scenic-sun" />
          <div className="scenic-aurora" />

          {/* Minimalist Clouds */}
          <div className="scenic-clouds">
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
          </div>

          {/* Precision Mount Fuji Vector */}
          <svg className="mount-fuji-svg" viewBox="0 0 440 220" preserveAspectRatio="none">
            {/* Distant Mountain Ridges */}
            <polygon points="0,220 90,135 190,220" className="fuji-hill-back" />
            <polygon points="210,220 330,125 440,220" className="fuji-hill-back" />

            {/* Mount Fuji Volcanic Cone */}
            <polygon points="70,220 220,38 370,220" className="fuji-body" />
            
            {/* Pure Snow Cap */}
            <polygon points="190,74 220,38 250,74 238,84 220,76 202,84" className="fuji-snowcap" />

            {/* Autumn Foothill Silhouettes */}
            <path d="M 0,188 Q 110,160 220,192 Q 330,165 440,188 L 440,220 L 0,220 Z" className="fuji-foothills" />
          </svg>

          {/* Floating Sakura Blossom Petals */}
          <div className="fuji-floating-leaves">
            <span className="leaf leaf-1">🌸</span>
            <span className="leaf leaf-2">🌸</span>
            <span className="leaf leaf-3">🌸</span>
          </div>

          {/* Railway Viaduct & Speed Tracks */}
          <div className="railway-viaduct">
            <div className="bridge-track" />
            <div className="bridge-pillars">
              <div className="pillar" />
              <div className="pillar" />
              <div className="pillar" />
              <div className="pillar" />
              <div className="pillar" />
              <div className="pillar" />
            </div>
          </div>

          {/* Aerodynamic Full-Length 8-Car Shinkansen Bullet Train */}
          <div className="bullet-train-shinkansen">
            <div className="train-glow-trail" />
            {/* Nose Lead Car */}
            <div className="train-car train-lead">
              <div className="train-windshield" />
              <div className="train-stripe" />
              <div className="train-headlight" />
            </div>
            {/* Passenger Car 1 */}
            <div className="train-car train-middle">
              <div className="train-windows">
                <div className="window" />
                <div className="window" />
                <div className="window" />
              </div>
              <div className="train-stripe" />
            </div>
            {/* Passenger Car 2 (with Pantograph power collector) */}
            <div className="train-car train-middle has-pantograph">
              <div className="pantograph" />
              <div className="train-windows">
                <div className="window" />
                <div className="window" />
                <div className="window" />
              </div>
              <div className="train-stripe" />
            </div>
            {/* Passenger Car 3 */}
            <div className="train-car train-middle">
              <div className="train-windows">
                <div className="window" />
                <div className="window" />
                <div className="window" />
              </div>
              <div className="train-stripe" />
            </div>
            {/* Passenger Car 4 */}
            <div className="train-car train-middle">
              <div className="train-windows">
                <div className="window" />
                <div className="window" />
                <div className="window" />
              </div>
              <div className="train-stripe" />
            </div>
            {/* Passenger Car 5 (with Pantograph power collector) */}
            <div className="train-car train-middle has-pantograph">
              <div className="pantograph" />
              <div className="train-windows">
                <div className="window" />
                <div className="window" />
                <div className="window" />
              </div>
              <div className="train-stripe" />
            </div>
            {/* Passenger Car 6 */}
            <div className="train-car train-middle">
              <div className="train-windows">
                <div className="window" />
                <div className="window" />
                <div className="window" />
              </div>
              <div className="train-stripe" />
            </div>
            {/* Tail Car */}
            <div className="train-car train-tail">
              <div className="train-stripe" />
              <div className="train-taillight" />
            </div>
          </div>
        </div>

        {/* Processing State & Inference Telemetry */}
        <div className="fuji-loader-footer">
          <div className="loader-title-row">
            <div className="title-left">
              <span className="badge-tag">PROCESSING</span>
              <h4>{title}</h4>
            </div>
            <span className="loader-pct">{Math.round(progress)}%</span>
          </div>

          <p className="loader-msg">
            <span className="pulse-dot" /> {INFERENCE_STEPS[currentStepIndex]}
          </p>

          <div className="loader-progress-track">
            <div className="loader-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
