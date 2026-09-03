import React, { useState, useEffect, useRef } from 'react';
import './ProfileModal.css';
import { useApp } from '../context/AppContext';

const AVATAR_CATEGORIES = {
  nature: [
    { emoji: '🌸', name: 'Sakura Blossom', theme: 'Gentle & Poised' },
    { emoji: '🍁', name: 'Autumn Maple', theme: 'Warm & Grounded' },
    { emoji: '🍃', name: 'Bamboo Leaf', theme: 'Resilient & Pure' },
    { emoji: '❄️', name: 'Pure Snow', theme: 'Clear & Crisp' },
    { emoji: '🌊', name: 'Sonic Wave', theme: 'Resonant & Fluent' },
    { emoji: '🌿', name: 'Matcha Zen', theme: 'Calm & Mindful' },
  ],
  audio: [
    { emoji: '🎙️', name: 'Studio Dynamic', theme: 'Professional Broadcast' },
    { emoji: '🎧', name: 'Hi-Fi Monitor', theme: 'Acoustic Engineer' },
    { emoji: '🤖', name: 'Neural Core', theme: 'AI Voice Architect' },
    { emoji: '⚡', name: 'Thunderbolt', theme: 'Dynamic & Energetic' },
    { emoji: '📻', name: 'Frequency Hub', theme: 'Radio Broadcaster' },
    { emoji: '🔥', name: 'Vocal Spark', theme: 'Passionate & Inspiring' },
  ],
  wildlife: [
    { emoji: '🦅', name: 'Swift Falcon', theme: 'Sharp & Articulate' },
    { emoji: '🦊', name: 'Wise Kitsune', theme: 'Adaptive & Clever' },
    { emoji: '🦉', name: 'Wise Owl', theme: 'Thoughtful Orator' },
    { emoji: '🐺', name: 'Lone Wolf', theme: 'Commanding Presence' },
    { emoji: '🐉', name: 'Azure Dragon', theme: 'Powerful Resonance' },
    { emoji: '🐯', name: 'Golden Tiger', theme: 'Bold & Confident' },
  ],
  prestige: [
    { emoji: '👑', name: 'Imperial Crown', theme: 'Executive & Leader' },
    { emoji: '💎', name: 'Diamond Voice', theme: 'Crystal Clear Tone' },
    { emoji: '🌟', name: 'Supernova', theme: 'Inspiring Luminary' },
    { emoji: '響', name: 'Hibiki (Resonance)', theme: 'Harmonic Depth' },
    { emoji: '音', name: 'Oto (Sound)', theme: 'Pure Acoustic' },
    { emoji: '声', name: 'Koe (Voice)', theme: 'Authentic Vocal' },
  ]
};

const GLOW_THEMES = [
  { id: 'gradient-crimson', name: 'Sakura Crimson', color: 'linear-gradient(135deg, #eb6b56 0%, #f0a84e 100%)', shadow: 'rgba(235, 107, 86, 0.45)' },
  { id: 'gradient-gold', name: 'Ginkgo Gold', color: 'linear-gradient(135deg, #d49e35 0%, #f3c969 100%)', shadow: 'rgba(212, 158, 53, 0.45)' },
  { id: 'gradient-matcha', name: 'Emerald Matcha', color: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)', shadow: 'rgba(46, 125, 50, 0.45)' },
  { id: 'gradient-midnight', name: 'Midnight Aurora', color: 'linear-gradient(135deg, #1e3a8a 0%, #38bdf8 100%)', shadow: 'rgba(56, 189, 248, 0.45)' },
  { id: 'gradient-violet', name: 'Kyoto Wisteria', color: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)', shadow: 'rgba(124, 58, 237, 0.45)' },
  { id: 'gradient-sunset', name: 'Autumn Sunset', color: 'linear-gradient(135deg, #c2410c 0%, #fb923c 100%)', shadow: 'rgba(194, 65, 12, 0.45)' },
];

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
];

const LANGUAGE_OPTIONS = [
  { code: 'en-US', label: 'English (US) 🇺🇸' },
  { code: 'en-GB', label: 'English (UK) 🇬🇧' },
  { code: 'es-ES', label: 'Spanish (ES) 🇪🇸' },
  { code: 'fr-FR', label: 'French (FR) 🇫🇷' },
  { code: 'de-DE', label: 'German (DE) 🇩🇪' },
  { code: 'ja-JP', label: 'Japanese (JA) 🇯🇵' },
  { code: 'hi-IN', label: 'Hindi (IN) 🇮🇳' },
];

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('nature');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedDialCode, setSelectedDialCode] = useState('+1');
  const [organization, setOrganization] = useState('');
  
  // Customization
  const [selectedAvatar, setSelectedAvatar] = useState('🌸');
  const [customPhotoUrl, setCustomPhotoUrl] = useState(null);
  const [selectedGlow, setSelectedGlow] = useState('gradient-crimson');
  const [targetWpm, setTargetWpm] = useState(135);
  const [preferredLang, setPreferredLang] = useState('en-US');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(user.firstName || parts[0] || 'Sample');
      setLastName(user.lastName || parts.slice(1).join(' ') || 'User');
      setBio(user.bio || (user.role === 'ADMIN' ? 'Platform Administrator & Audio Engineer' : 'Speech Intelligence Enthusiast & Speaker'));
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setSelectedCountry(user.country || 'United States');
      setSelectedDialCode(user.dialCode || '+1');
      setOrganization(user.organization || 'AuraVoice Studio');
      setSelectedAvatar(user.avatar || (user.role === 'ADMIN' ? '👑' : '🎙️'));
      setCustomPhotoUrl(user.customPhotoUrl || null);
      setSelectedGlow(user.avatarBg || 'gradient-crimson');
      setTargetWpm(user.targetWpm || 135);
      setPreferredLang(user.preferredLang || 'en-US');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Handle image upload from device
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, WebP).', 'warning');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast('Image size exceeds 3MB limit.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomPhotoUrl(event.target.result);
      showToast('Custom profile photo loaded!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setCustomPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Reset to emoji avatar persona.', 'info');
  };

  const handleCountryChange = (countryName) => {
    setSelectedCountry(countryName);
    const matched = COUNTRIES.find(c => c.name === countryName);
    if (matched) {
      setSelectedDialCode(matched.dialCode);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || user?.name || 'User';

    updateUserProfile({
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      bio: bio.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: selectedCountry,
      dialCode: selectedDialCode,
      organization: organization.trim(),
      avatar: customPhotoUrl ? '📷' : selectedAvatar,
      customPhotoUrl: customPhotoUrl,
      avatarBg: selectedGlow,
      targetWpm: Number(targetWpm) || 135,
      preferredLang: preferredLang
    });
    onClose();
  };

  const getPaceGuidance = (wpm) => {
    if (wpm < 115) return { label: 'Deliberate & Thoughtful', color: 'var(--ginkgo-gold)' };
    if (wpm <= 155) return { label: 'Optimal Conversational Pace', color: 'var(--matcha-green)' };
    if (wpm <= 180) return { label: 'Brisk & Dynamic', color: 'var(--persimmon-amber)' };
    return { label: 'Rapid & High Energy', color: 'var(--maple-crimson)' };
  };

  const paceInfo = getPaceGuidance(targetWpm);
  const activeGlowObj = GLOW_THEMES.find(g => g.id === selectedGlow) || GLOW_THEMES[0];

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close-btn" onClick={onClose} aria-label="Close Profile Modal">
          ✕
        </button>

        {/* Live Preview Header */}
        <div className="profile-header">
          <div className="profile-header-avatar-preview">
            <div
              className="avatar-preview-circle"
              style={{
                background: activeGlowObj.color,
                boxShadow: `0 8px 24px ${activeGlowObj.shadow}`
              }}
            >
              {customPhotoUrl ? (
                <img src={customPhotoUrl} alt="Custom Profile" className="custom-photo-img" />
              ) : (
                <span className="preview-emoji">{selectedAvatar}</span>
              )}
            </div>

            <div className="avatar-preview-text">
              <div className="preview-name-row">
                <h3>{`${firstName} ${lastName}`.trim() || 'Your Profile'}</h3>
                <span className={`role-badge ${user?.role?.toLowerCase() || 'user'}`}>
                  {user?.role || 'USER'}
                </span>
                <span className="country-badge">
                  {COUNTRIES.find(c => c.name === selectedCountry)?.flag} {selectedCountry}
                </span>
              </div>
              <p className="preview-bio">{bio || 'Speech intelligence speaker & creator'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* ================= 1. AVATAR & GLOW THEME CUSTOMIZATION ================= */}
          <div className="form-section avatar-customization-box">
            <div className="section-label-row">
              <label className="section-label">
                <span>1. Vocal Avatar & Persona Customization:</span>
                <small>Select from 24+ curated audio personas or upload your custom photo</small>
              </label>

              {/* Upload Photo Trigger */}
              <div className="photo-action-buttons">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="photo-upload-btn"
                >
                  📷 Upload Custom Photo
                </button>
                {customPhotoUrl && (
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="photo-clear-btn"
                    title="Remove custom photo"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Avatar Category Tabs */}
            <div className="avatar-cat-tabs">
              <button
                type="button"
                className={`cat-tab-btn ${activeTab === 'nature' ? 'active' : ''}`}
                onClick={() => setActiveTab('nature')}
              >
                🌸 Seasonal & Zen
              </button>
              <button
                type="button"
                className={`cat-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
                onClick={() => setActiveTab('audio')}
              >
                🎙️ Audio & AI Tech
              </button>
              <button
                type="button"
                className={`cat-tab-btn ${activeTab === 'wildlife' ? 'active' : ''}`}
                onClick={() => setActiveTab('wildlife')}
              >
                🦅 Wildlife & Spirit
              </button>
              <button
                type="button"
                className={`cat-tab-btn ${activeTab === 'prestige' ? 'active' : ''}`}
                onClick={() => setActiveTab('prestige')}
              >
                👑 Prestige & Glyphs
              </button>
            </div>

            {/* Avatar Selection Grid for Active Tab */}
            <div className="avatar-picker-grid">
              {AVATAR_CATEGORIES[activeTab].map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className={`avatar-choice-btn ${!customPhotoUrl && selectedAvatar === item.emoji ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedAvatar(item.emoji);
                    setCustomPhotoUrl(null);
                  }}
                  title={`${item.name} — ${item.theme}`}
                >
                  <span className="avatar-choice-emoji">{item.emoji}</span>
                  <span className="avatar-choice-label">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Glow Theme Gradient Picker */}
            <div className="glow-theme-picker">
              <span className="sub-label">Avatar Glow & Aura Gradient:</span>
              <div className="glow-options-row">
                {GLOW_THEMES.map((theme) => (
                  <button
                    type="button"
                    key={theme.id}
                    className={`glow-swatch-btn ${selectedGlow === theme.id ? 'active' : ''}`}
                    onClick={() => setSelectedGlow(theme.id)}
                    title={theme.name}
                    style={{ background: theme.color }}
                  >
                    {selectedGlow === theme.id && <span className="swatch-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= 2. PERSONAL & CONTACT DETAILS ================= */}
          <div className="form-section">
            <label className="section-label">
              <span>2. Personal & Contact Information:</span>
            </label>

            {/* First & Last Name */}
            <div className="form-grid-2">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Rohan"
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Sharma"
                  required
                />
              </div>
            </div>

            {/* Country & Phone Number */}
            <div className="form-grid-2">
              <div className="form-group">
                <label>Country / Region</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="form-select-input"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="phone-input-group">
                  <span className="dial-code-badge">{selectedDialCode}</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Email & Organization */}
            <div className="form-grid-2">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@auravoice.ai"
                  required
                />
              </div>

              <div className="form-group">
                <label>Organization / Team</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Speech Intelligence Lab"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Headline / Bio</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Keynote Speaker & Voice Analyst"
              />
            </div>
          </div>

          {/* ================= 3. ACOUSTIC PREFERENCES & TARGETS ================= */}
          <div className="form-section">
            <label className="section-label">
              <span>3. Speaking Telemetry & Acoustic Goals:</span>
            </label>

            <div className="form-grid-2">
              <div className="form-group">
                <div className="pace-header-row">
                  <label>Target Speaking Pace (WPM)</label>
                  <span className="pace-badge" style={{ color: paceInfo.color, borderColor: paceInfo.color }}>
                    {targetWpm} WPM • {paceInfo.label}
                  </span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="220"
                  step="5"
                  value={targetWpm}
                  onChange={(e) => setTargetWpm(e.target.value)}
                  className="pace-range-slider"
                />
              </div>

              <div className="form-group">
                <label>Default Primary Language</label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  className="form-select-input"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-modal-actions">
            <button type="button" onClick={onClose} className="aki-btn aki-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="aki-btn aki-btn-primary">
              💾 Save Profile & Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
