import React, { useRef, useEffect, useState } from 'react';
import './AutumnWaveVisualizer3D.css';
import { useApp } from '../context/AppContext';

export const AutumnWaveVisualizer3D = ({ isRecording = false }) => {
  const canvasRef = useRef(null);
  const { theme } = useApp();
  const [visualizerMode, setVisualizerMode] = useState('blossoms'); // 'blossoms', 'ripples', 'mandala'
  const [sensitivity, setSensitivity] = useState(1.2);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameId = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.parentElement.clientWidth;
    let height = 230;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = 230;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => {
      mousePos.current = { x: -1000, y: -1000 };
    });

    // 3D Sakura Blossom Petals
    const petalCount = 42;
    const petals = [];
    const colorsLight = ['#f472b6', '#fb7185', '#f43f5e', '#ec4899', '#fda4af', '#f9a8d4'];
    const colorsDark = ['#fb7185', '#f472b6', '#f43f5e', '#fda4af', '#e11d48', '#fbcfe8'];
    const activeColors = theme === 'dark' ? colorsDark : colorsLight;

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.35, // Depth factor
        size: Math.random() * 8 + 6,
        speedX: Math.random() * 1.4 - 0.7,
        speedY: Math.random() * 0.9 + 0.6,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.05,
        color: activeColors[Math.floor(Math.random() * activeColors.length)],
        flutter: Math.random() * Math.PI
      });
    }

    // Audio stream connection if recording
    if (isRecording && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
          }
          if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
          }
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
          sourceRef.current.connect(analyserRef.current);
        } catch (e) {
          console.warn('AudioContext init error:', e);
        }
      }).catch(() => {});
    }

    const dataArray = new Uint8Array(128);

    // Draw Delicate Sakura Cherry Blossom Petal
    const drawSakuraPetal = (cx, cy, size, angle, color, z) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.globalAlpha = Math.min(1, 0.4 + z * 0.6);
      ctx.fillStyle = color;
      ctx.beginPath();
      
      // Sakura petal with gentle notched top
      ctx.moveTo(0, size * 0.9);
      ctx.bezierCurveTo(-size * 0.8, size * 0.3, -size * 0.9, -size * 0.5, -size * 0.3, -size * 0.9);
      ctx.quadraticCurveTo(0, -size * 0.65, size * 0.3, -size * 0.9);
      ctx.bezierCurveTo(size * 0.9, -size * 0.5, size * 0.8, size * 0.3, 0, size * 0.9);
      ctx.closePath();
      ctx.fill();

      // Subtle petal vein highlight
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.7);
      ctx.lineTo(0, -size * 0.4);
      ctx.stroke();

      ctx.restore();
    };

    let time = 0;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      let avgVolume = 0;
      if (analyserRef.current && isRecording) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        avgVolume = sum / dataArray.length;
      } else {
        avgVolume = Math.sin(time * 2) * 12 + 18;
      }

      const volumeBoost = (avgVolume / 255) * sensitivity * 2.2;

      // MODE 1 & Background: Spring Blossom Sound Wave Lines
      if (visualizerMode === 'ripples' || visualizerMode === 'blossoms') {
        const waveCount = 3;
        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const baseOffset = height * 0.5 + (w - 1) * 22;
          ctx.moveTo(0, baseOffset);

          for (let x = 0; x < width; x += 4) {
            const freqIndex = Math.floor((x / width) * 32);
            const freqVal = (dataArray[freqIndex] || 15) * sensitivity;
            const amp = isRecording ? (freqVal / 255) * 45 : Math.sin(x * 0.015 + time * 3 + w) * 14;

            const y = baseOffset + Math.sin(x * 0.012 + time * 2 + w * 1.5) * amp;
            ctx.lineTo(x, y);
          }

          if (w === 0) {
            ctx.strokeStyle = theme === 'dark' ? 'rgba(251, 113, 133, 0.75)' : 'rgba(225, 29, 72, 0.65)';
            ctx.lineWidth = 2.5;
          } else if (w === 1) {
            ctx.strokeStyle = theme === 'dark' ? 'rgba(244, 114, 182, 0.6)' : 'rgba(236, 72, 153, 0.55)';
            ctx.lineWidth = 2;
          } else {
            ctx.strokeStyle = theme === 'dark' ? 'rgba(253, 164, 175, 0.45)' : 'rgba(244, 63, 94, 0.35)';
            ctx.lineWidth = 1.5;
          }
          ctx.stroke();
        }
      }

      // MODE 2: Circular Sakura Audio Mandala
      if (visualizerMode === 'mandala') {
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = 45 + avgVolume * 0.35;
        const barCount = 44;

        for (let b = 0; b < barCount; b++) {
          const angle = (b / barCount) * Math.PI * 2 + time * 0.45;
          const freqVal = (dataArray[b % dataArray.length] || 15) * sensitivity;
          const barLen = 8 + (freqVal / 255) * 48;

          const x1 = cx + Math.cos(angle) * baseRadius;
          const y1 = cy + Math.sin(angle) * baseRadius;
          const x2 = cx + Math.cos(angle) * (baseRadius + barLen);
          const y2 = cy + Math.sin(angle) * (baseRadius + barLen);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = b % 2 === 0 ? (theme === 'dark' ? '#fb7185' : '#e11d48') : '#f472b6';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }

      // Render Floating 3D Sakura Blossom Petals
      petals.forEach((petal) => {
        petal.flutter += 0.035;
        petal.y += (petal.speedY + volumeBoost * 1.6) * petal.z;
        petal.x += (petal.speedX + Math.sin(time + petal.y * 0.02) * (1 + volumeBoost)) * petal.z;
        petal.angle += petal.angularSpeed + volumeBoost * 0.05;

        // Mouse Breeze Interaction: Petals scatter away from cursor
        const dx = petal.x - mousePos.current.x;
        const dy = petal.y - mousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          petal.x += (dx / dist) * force * 7;
          petal.y += (dy / dist) * force * 7;
          petal.angle += 0.15;
        }

        // Boundary wrap
        if (petal.y > height + 25) {
          petal.y = -25;
          petal.x = Math.random() * width;
        }
        if (petal.x > width + 25) petal.x = -25;
        if (petal.x < -25) petal.x = width + 25;

        const dynamicSize = petal.size * petal.z * (1 + volumeBoost * 0.45);
        drawSakuraPetal(petal.x, petal.y, dynamicSize, petal.angle, petal.color, petal.z);
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try { audioContextRef.current.close(); } catch (e) {}
      }
    };
  }, [isRecording, theme, visualizerMode, sensitivity]);

  return (
    <div className="aki-visualizer-wrapper">
      <div className="visualizer-header">
        <div className="visualizer-title">
          <span className="badge-tag">AUDIO WAVE</span>
          <span>Sakura Acoustic Resonance Canvas</span>
          {isRecording ? (
            <span className="live-pulse" title="Live audio stream active" />
          ) : (
            <span className="idle-indicator">🌸 Blossom Petal Breeze</span>
          )}
        </div>

        <div className="visualizer-controls-bar">
          {/* Mode switch pills */}
          <div className="mode-toggle-group">
            <button
              className={`vis-toggle-btn ${visualizerMode === 'blossoms' ? 'active' : ''}`}
              onClick={() => setVisualizerMode('blossoms')}
              type="button"
            >
              🌸 Blossom Petals
            </button>
            <button
              className={`vis-toggle-btn ${visualizerMode === 'ripples' ? 'active' : ''}`}
              onClick={() => setVisualizerMode('ripples')}
              type="button"
            >
              🌊 Spring Ripples
            </button>
            <button
              className={`vis-toggle-btn ${visualizerMode === 'mandala' ? 'active' : ''}`}
              onClick={() => setVisualizerMode('mandala')}
              type="button"
            >
              🎡 Sakura Mandala
            </button>
          </div>

          {/* Sensitivity Slider */}
          <div className="sensitivity-control" title="Adjust voice sensitivity gain">
            <span className="sens-label">Sensitivity:</span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="sens-slider"
            />
            <span className="sens-val">{sensitivity}x</span>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="aki-canvas" />
    </div>
  );
};
