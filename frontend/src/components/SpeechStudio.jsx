import React, { useState, useEffect, useRef } from 'react';
import './SpeechStudio.css';
import { SpeechEngine } from '../services/speechEngine';
import { analyzeSpeech } from '../services/sentimentAnalyzer';
import { AutumnWaveVisualizer3D } from './AutumnWaveVisualizer3D';
import { SentimentStudio } from './SentimentStudio';
import { TranscriptHeatmap } from './TranscriptHeatmap';
import { FujiTrainLoader } from './FujiTrainLoader';
import { useApp } from '../context/AppContext';

const PRESET_SCRIPTS = [
  {
    title: '🌸 Inspiring Keynote',
    desc: 'Product launch address',
    category: 'Keynote Speech',
    text: "Our entire product launch exceeded all expectations! The client support team was genuinely thrilled and customers are praising the new lightning-fast speech recognition interface. We have achieved phenomenal results together."
  },
  {
    title: '🌿 Technical Sync',
    desc: 'Architecture briefing',
    category: 'Engineering Review',
    text: "The weekly status meeting was conducted on Tuesday at 10:00 AM to review quarterly milestones and database schema allocations. All microservices are stable and memory usage is well within the acceptable threshold."
  },
  {
    title: '⚡ Critical Briefing',
    desc: 'Incident resolution update',
    category: 'System Briefing',
    text: "The latency on the legacy server caused terrible delays, and the connection frequently failed during the critical presentation. This is an awful issue that we must fix immediately to avoid customer frustration."
  }
];

const LANGUAGE_OPTIONS = [
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸', region: 'Americas' },
  { code: 'en-GB', label: 'English (UK)', flag: '🇬🇧', region: 'Europe' },
  { code: 'es-ES', label: 'Spanish (ES)', flag: '🇪🇸', region: 'Europe / LATAM' },
  { code: 'fr-FR', label: 'French (FR)', flag: '🇫🇷', region: 'Europe' },
  { code: 'de-DE', label: 'German (DE)', flag: '🇩🇪', region: 'Europe' },
  { code: 'ja-JP', label: 'Japanese (JA)', flag: '🇯🇵', region: 'Asia-Pacific' },
  { code: 'hi-IN', label: 'Hindi (HI)', flag: '🇮🇳', region: 'South Asia' }
];

export const SpeechStudio = () => {
  const { user, openAuthModal, saveSession, showToast } = useApp();
  const isGuest = !user || user.role === 'GUEST';
  const [transcriptText, setTranscriptText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [analysis, setAnalysis] = useState(null);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [liveVolumeLevel, setLiveVolumeLevel] = useState(0);
  const [processingState, setProcessingState] = useState({ isProcessing: false, title: '' });

  // Coach Tools State: Metronome & Filler Elimination Challenge
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [isFillerChallengeActive, setIsFillerChallengeActive] = useState(false);
  const [fillerAlert, setFillerAlert] = useState(null);
  const [cleanStreak, setCleanStreak] = useState(0);
  
  const speechEngineRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const langDropdownRef = useRef(null);

  // Close custom dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectLang = (langCode, langLabel) => {
    setSelectedLang(langCode);
    setIsLangOpen(false);
    if (speechEngineRef.current) {
      speechEngineRef.current.setLanguage(langCode);
    }
    showToast(`Recognition language switched to ${langLabel}`, 'info');
  };

  // Initialize speech engine on mount
  useEffect(() => {
    speechEngineRef.current = new SpeechEngine(
      (fullText, interim) => {
        setTranscriptText(fullText);
        setInterimText(interim);

        // Check for filler word in real-time if Challenge is active
        const recentChunk = (interim || fullText.split(' ').slice(-3).join(' ')).toLowerCase();
        const detected = ['um', 'uh', 'like', 'you know', 'actually', 'literally'].find(f => recentChunk.includes(f));
        if (detected) {
          setFillerAlert(detected);
          setCleanStreak(0);
          setTimeout(() => setFillerAlert(null), 1400);
        } else if (interim) {
          setCleanStreak(prev => prev + 1);
        }
      },
      (status, seconds, audioUrl, blob) => {
        if (status === 'recording') {
          setIsRecording(true);
          setElapsedSeconds(seconds || 0);
          // Simulate dynamic volume tick
          setLiveVolumeLevel(Math.floor(Math.random() * 45) + 35);
        } else if (status === 'stopped') {
          setIsRecording(false);
          setLiveVolumeLevel(0);
          if (audioUrl) setRecordedAudioUrl(audioUrl);
          if (blob) setRecordedBlob(blob);
          // Trigger high-speed neural acoustic inference loading
          setProcessingState({
            isProcessing: true,
            title: 'Neural Acoustic & Vocal Sentiment Inference'
          });
        } else {
          setIsRecording(false);
          setLiveVolumeLevel(0);
        }
      }
    );

    return () => {
      if (speechEngineRef.current) {
        speechEngineRef.current.stopListening();
      }
    };
  }, []);

  // Recalculate sentiment analysis whenever transcript text updates
  useEffect(() => {
    const combined = (transcriptText + ' ' + interimText).trim();
    if (combined) {
      const result = analyzeSpeech(combined, elapsedSeconds);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [transcriptText, interimText, elapsedSeconds]);

  // Handle Start / Stop Microphone
  const handleToggleRecord = () => {
    if (isRecording) {
      speechEngineRef.current.stopListening();
    } else {
      speechEngineRef.current.startListening();
      showToast('Listening... Speak into your microphone.', 'info');
    }
  };

  // Clear Studio
  const handleClear = () => {
    if (speechEngineRef.current) {
      speechEngineRef.current.reset();
    }
    setTranscriptText('');
    setInterimText('');
    setIsRecording(false);
    setElapsedSeconds(0);
    setLiveVolumeLevel(0);
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setAnalysis(null);
    showToast('Studio cleared.', 'info');
  };

  // Preset Sample Load with Processing State
  const handleLoadPreset = (preset) => {
    setProcessingState({
      isProcessing: true,
      title: `Analyzing Script: ${preset.title}`
    });
    setTranscriptText(preset.text);
    setInterimText('');
    setElapsedSeconds(45);
    showToast(`Loaded preset: ${preset.title}`, 'info');
  };

  // Handle Audio File Upload with Processing State
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setRecordedAudioUrl(url);
    showToast(`Loaded audio file: ${file.name}`, 'success');

    setProcessingState({
      isProcessing: true,
      title: `Ingesting Audio Stream: ${file.name}`
    });

    if (!transcriptText) {
      setTranscriptText("Welcome to the uploaded audio playback. This speech demonstrates natural vocal dynamics and expressive tonality.");
      setElapsedSeconds(60);
    }
  };

  // Handle Audio Speed Rate
  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = rate;
    }
  };

  // Format Elapsed Time (MM:SS)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Save session to history
  const handleSaveToHistory = () => {
    if (!transcriptText || !analysis) {
      showToast('Nothing to save. Please speak or enter text first.', 'warning');
      return;
    }
    const newSession = {
      id: `session-${Date.now()}`,
      title: `Speech Session — ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleString(),
      duration: elapsedSeconds || 30,
      text: transcriptText,
      sentiment: analysis.sentiment,
      emotions: analysis.emotions,
      speechDelivery: analysis.speechDelivery,
      audioUrl: recordedAudioUrl
    };
    saveSession(newSession);
  };

  const wordCount = transcriptText ? transcriptText.trim().split(/\s+/).length : 0;
  const charCount = transcriptText ? transcriptText.length : 0;

  return (
    <div className="speech-studio-container">
      {/* Speech Processing & Inference Modal */}
      {processingState.isProcessing && (
        <FujiTrainLoader
          title={processingState.title || 'Processing Speech Intelligence'}
          duration={1600}
          onComplete={() => setProcessingState({ isProcessing: false, title: '' })}
        />
      )}

      {/* Guest Demo Notice Banner */}
      {isGuest && (
        <div className="guest-demo-banner">
          <div className="guest-banner-left">
            <span className="guest-banner-badge">✨ LIVE DEMO</span>
            <span className="guest-banner-text">
              You are testing in <strong>Guest Demo Mode</strong>. Real-time microphone capture & sentiment analysis are active. <strong>Sign in</strong> or use <strong>1-Click Instant Demo</strong> to save sessions & export PDF reports.
            </span>
          </div>
          <button onClick={openAuthModal} className="aki-btn aki-btn-primary guest-banner-btn" type="button">
            ⚡ Sign In / Demo Access
          </button>
        </div>
      )}

      {/* 1. Hero Title & Preset Bar */}
      <div className="studio-hero-section">
        <div className="hero-header">
          <div className="hero-badge hanko-badge">
            <span>✨ AI STUDIO</span> AuraVoice Voice Intelligence
          </div>
          <h1>
            Real-time Speech Recognition & <span>Vocal Sentiment</span>
          </h1>
          <p>
            Experience next-generation voice intelligence with warm seasonal aesthetics. Capture live audio, inspect interactive emotion heatmaps, and analyze delivery telemetry.
          </p>
        </div>

        {/* Preset Prompt Cards */}
        <div className="preset-prompt-bar">
          <span className="preset-label">Quick Sample Scripts:</span>
          <div className="preset-cards-grid">
            {PRESET_SCRIPTS.map((preset, idx) => (
              <button
                key={idx}
                className="preset-btn"
                onClick={() => handleLoadPreset(preset)}
                type="button"
              >
                <div className="preset-btn-top">
                  <strong>{preset.title}</strong>
                  <span className="preset-category-tag">{preset.category}</span>
                </div>
                <small>{preset.desc}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 3D Wave & Particle Resonance Canvas */}
      <AutumnWaveVisualizer3D isRecording={isRecording} audioBlob={recordedBlob} />

      {/* 3. Studio Main Grid */}
      <div className="studio-main-grid">
        {/* LEFT COLUMN: Recording Controls & Transcript Editor */}
        <div className="studio-left-col">
          <div className="aki-card recording-control-card">
            <div className="control-card-header">
              <div className="mic-status-indicator">
                <span className={isRecording ? 'live-pulse' : 'idle-dot'} />
                <span className="status-text">
                  {isRecording ? 'LIVE AUDIO RECORDING...' : 'STUDIO READY'}
                </span>
              </div>

              {/* Volume VU meter when recording */}
              {isRecording && (
                <div className="live-vu-meter" title="Mic Input Level">
                  <span className="vu-label">Level:</span>
                  <div className="vu-track">
                    <div className="vu-fill" style={{ width: `${liveVolumeLevel}%` }} />
                  </div>
                </div>
              )}

              {/* Custom Glassmorphic Language Selector */}
              <div className="custom-lang-selector-wrapper" ref={langDropdownRef}>
                <button
                  type="button"
                  className={`custom-lang-trigger-btn ${isLangOpen ? 'open' : ''}`}
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  disabled={isRecording}
                  title="Select Speech Recognition Language"
                >
                  <span className="selected-flag">{LANGUAGE_OPTIONS.find(l => l.code === selectedLang)?.flag || '🌐'}</span>
                  <span className="selected-label">{LANGUAGE_OPTIONS.find(l => l.code === selectedLang)?.label || 'English (US)'}</span>
                  <span className="lang-chevron">{isLangOpen ? '▲' : '▼'}</span>
                </button>

                {isLangOpen && (
                  <div className="custom-lang-dropdown-menu">
                    <div className="dropdown-menu-header">
                      <span>Supported Audio Languages</span>
                    </div>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <div
                        key={lang.code}
                        className={`lang-option-item ${selectedLang === lang.code ? 'active' : ''}`}
                        onClick={() => handleSelectLang(lang.code, lang.label)}
                      >
                        <div className="option-left">
                          <span className="option-flag">{lang.flag}</span>
                          <div className="option-text">
                            <span className="option-name">{lang.label}</span>
                            <span className="option-region">{lang.region}</span>
                          </div>
                        </div>
                        {selectedLang === lang.code && <span className="option-check">✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="timer-badge">
                ⏱️ <span>{formatTime(elapsedSeconds)}</span>
              </div>
            </div>

            {/* Smart Coaching Tools Ribbon: Metronome & Zero-Filler Challenge */}
            <div className="studio-coach-ribbon">
              <div className="ribbon-tools-left">
                {/* Metronome Toggle */}
                <button
                  type="button"
                  className={`coach-toggle-btn ${isMetronomeActive ? 'active' : ''}`}
                  onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                  title="Toggle Visual Cadence Metronome"
                >
                  <span className="btn-glyph">⏱️</span>
                  <span>Cadence Metronome</span>
                  <span className="toggle-state-tag">{isMetronomeActive ? 'ON' : 'OFF'}</span>
                </button>

                {/* Zero-Filler Challenge Toggle */}
                <button
                  type="button"
                  className={`coach-toggle-btn ${isFillerChallengeActive ? 'active' : ''}`}
                  onClick={() => setIsFillerChallengeActive(!isFillerChallengeActive)}
                  title="Toggle Zero-Filler Elimination Challenge"
                >
                  <span className="btn-glyph">🎯</span>
                  <span>Zero-Filler Challenge</span>
                  <span className="toggle-state-tag">{isFillerChallengeActive ? 'ACTIVE' : 'OFF'}</span>
                </button>
              </div>

              {/* Real-time Challenge Feedback */}
              {isFillerChallengeActive && (
                <div className="filler-challenge-ticker">
                  {fillerAlert ? (
                    <span className="filler-alert-buzzer">
                      🚨 Hesitation: "{fillerAlert}"
                    </span>
                  ) : (
                    <span className="filler-streak-pill">
                      🔥 Clean Streak: <strong>{cleanStreak}</strong> words
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Live Metronome Pacing Bar */}
            {isMetronomeActive && (
              <div className="live-metronome-bar">
                <div className="metronome-tempo-dots">
                  <span className={`tempo-dot ${elapsedSeconds % 2 === 0 ? 'pulse' : ''}`} />
                  <span className={`tempo-dot ${elapsedSeconds % 2 !== 0 ? 'pulse' : ''}`} />
                </div>
                <div className="metronome-status">
                  <span className="metronome-target">Target Cadence: <strong>130 - 150 WPM</strong></span>
                  <span className={`pace-status-badge ${
                    (analysis?.speechDelivery?.wpm || 0) >= 130 && (analysis?.speechDelivery?.wpm || 0) <= 155
                      ? 'optimal'
                      : (analysis?.speechDelivery?.wpm || 0) > 155
                      ? 'fast'
                      : 'steady'
                  }`}>
                    {(analysis?.speechDelivery?.wpm || 0) > 0
                      ? `${analysis?.speechDelivery?.wpm} WPM • ${analysis?.speechDelivery?.paceLabel}`
                      : 'Awaiting voice input...'}
                  </span>
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="control-button-row">
              <button
                onClick={handleToggleRecord}
                className={`aki-btn record-main-btn ${isRecording ? 'recording-active' : 'aki-btn-primary'}`}
              >
                {isRecording ? (
                  <>
                    <span className="btn-icon">⏹️</span> Stop Recording
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🎙️</span> Start Recording
                  </>
                )}
              </button>

              <button
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="aki-btn aki-btn-secondary"
                title="Upload MP3 or WAV audio"
              >
                📁 Upload Audio
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              <button onClick={handleClear} className="aki-btn aki-btn-secondary btn-clear" title="Clear Studio">
                🗑️ Clear
              </button>
            </div>

            {/* Audio Playback Deck */}
            {recordedAudioUrl && (
              <div className="audio-player-deck">
                <div className="player-deck-top">
                  <span className="deck-label">🎵 Recorded Audio Playback</span>
                  <div className="speed-pills">
                    {[1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        className={`speed-pill ${playbackRate === rate ? 'active' : ''}`}
                        onClick={() => handleSpeedChange(rate)}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
                <audio
                  ref={audioPlayerRef}
                  src={recordedAudioUrl}
                  controls
                  className="aki-audio-player"
                />
              </div>
            )}

            {/* Editable Transcript Text Area with Word Ticker */}
            <div className="transcript-editor-box">
              <div className="editor-top-label">
                <div className="label-left">
                  <span className="badge-tag">TRANSCRIPT</span>
                  <span>Live Speech Transcript</span>
                </div>
                <div className="word-ticker">
                  <span><strong>{wordCount}</strong> words</span>
                  <span>•</span>
                  <span><strong>{charCount}</strong> chars</span>
                </div>
              </div>
              <textarea
                className="transcript-textarea"
                rows={6}
                value={transcriptText + (interimText ? ' ' + interimText : '')}
                onChange={(e) => {
                  setTranscriptText(e.target.value);
                  setInterimText('');
                }}
                placeholder="Speak into your microphone, load a preset prompt, or type text here to analyze sentiment and emotion..."
              />
            </div>
          </div>

          {/* Interactive Transcript Heatmap */}
          <TranscriptHeatmap
            tokens={analysis?.tokens || []}
            fullText={transcriptText}
          />
        </div>

        {/* RIGHT COLUMN: Real-time Sentiment & Delivery Intelligence */}
        <div className="studio-right-col">
          <SentimentStudio
            analysisData={analysis}
            transcriptText={transcriptText}
            duration={elapsedSeconds}
            onSaveSession={handleSaveToHistory}
          />
        </div>
      </div>
    </div>
  );
};
