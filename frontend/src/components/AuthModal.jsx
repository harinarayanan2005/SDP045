import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';
import { useApp } from '../context/AppContext';

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', placeholder: '202 555 0123', regex: /^\d{10}$/, minLen: 10, maxLen: 10 },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', placeholder: '98765 43210', regex: /^[6-9]\d{9}$/, minLen: 10, maxLen: 10 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', placeholder: '7911 123456', regex: /^\d{10,11}$/, minLen: 10, maxLen: 11 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', placeholder: '416 555 0199', regex: /^\d{10}$/, minLen: 10, maxLen: 10 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', placeholder: '412 345 678', regex: /^\d{9}$/, minLen: 9, maxLen: 9 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', placeholder: '151 23456789', regex: /^\d{10,11}$/, minLen: 10, maxLen: 11 },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', placeholder: '6 12 34 56 78', regex: /^\d{9}$/, minLen: 9, maxLen: 9 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', placeholder: '90 1234 5678', regex: /^\d{10,11}$/, minLen: 10, maxLen: 11 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', placeholder: '8123 4567', regex: /^\d{8}$/, minLen: 8, maxLen: 8 },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', placeholder: '50 123 4567', regex: /^\d{9}$/, minLen: 9, maxLen: 9 },
];

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser, registerNewUser, registeredUsers, showToast } = useApp();
  const navigate = useNavigate();

  // Mode: false = Sign In, true = Create Account / Register
  const [isRegister, setIsRegister] = useState(false);

  // Sign In Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('US');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Form Validation Errors
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  // Helper validation methods
  const validateEmail = (emailStr) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(emailStr).toLowerCase());
  };

  const validatePhone = (phoneStr, countryObj) => {
    const digitsOnly = phoneStr.replace(/\D/g, '');
    return countryObj.regex.test(digitsOnly);
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'var(--text-muted)' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'var(--maple-crimson)' };
    if (score <= 4) return { score: 2, label: 'Good & Secure', color: 'var(--ginkgo-gold)' };
    return { score: 3, label: 'Strong & Resilient', color: 'var(--matcha-green)' };
  };

  const passStrength = getPasswordStrength(regPassword);

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const emailTrim = loginEmail.trim().toLowerCase();

    if (!validateEmail(emailTrim)) {
      setErrors({ loginEmail: 'Please enter a valid email address (e.g. name@domain.com).' });
      return;
    }

    const isAdmin = emailTrim === 'admin@auravoice.ai' || emailTrim.includes('admin');

    // Password validations for default preset accounts
    if (emailTrim === 'admin@auravoice.ai' && loginPassword !== 'auravoice123') {
      showToast('Incorrect password for Administrator. (Hint: auravoice123)', 'error');
      return;
    }
    if (emailTrim === 'user@auravoice.ai' && loginPassword !== 'user@123') {
      showToast('Incorrect password for User. (Hint: user@123)', 'error');
      return;
    }

    // Check custom registered users
    const registered = registeredUsers?.find(u => u.email.toLowerCase() === emailTrim);
    if (registered && registered.password && registered.password !== loginPassword) {
      showToast('Incorrect password for this registered account.', 'error');
      return;
    }

    const role = isAdmin ? 'ADMIN' : (registered?.role || 'USER');
    const displayName = registered?.name || (isAdmin ? 'System Administrator' : 'Sample User');

    loginUser({
      name: displayName,
      email: emailTrim,
      role: role,
      ...registered
    });

    onClose();

    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!firstName.trim() || firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters.';
    }
    if (!lastName.trim() || lastName.trim().length < 1) {
      newErrors.lastName = 'Last name is required.';
    }
    if (!validateEmail(regEmail.trim())) {
      newErrors.regEmail = 'Please provide a valid email format (e.g. yourname@domain.com).';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!validatePhone(cleanPhone, currentCountry)) {
      newErrors.phone = `Invalid ${currentCountry.name} phone number. Expected ${currentCountry.minLen} digits (e.g. ${currentCountry.placeholder}).`;
    }

    if (regPassword.length < 6) {
      newErrors.regPassword = 'Password must be at least 6 characters long.';
    }

    if (regPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please re-enter.';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Please accept the AuraVoice Voice Intelligence Terms.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please correct the highlighted registration errors.', 'warning');
      return;
    }

    setErrors({});

    // Register user in AppContext & localStorage
    const result = registerNewUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      country: currentCountry.name,
      dialCode: currentCountry.dialCode,
      phone: cleanPhone,
      role: 'USER',
      avatar: '🌸',
      avatarBg: 'gradient-crimson'
    });

    if (result.success) {
      onClose();
      navigate('/dashboard');
    }
  };

  const handleQuickDemo = () => {
    loginUser({
      name: 'Sample User',
      email: 'user@auravoice.ai',
      role: 'USER',
      avatar: '🎙️'
    });
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className={`auth-modal-card ${isRegister ? 'register-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">✕</button>

        {/* Modal Brand Header */}
        <div className="auth-modal-header">
          <div className="auth-brand-seal">
            <span className="seal-symbol">🌸</span>
          </div>
          <h3>{isRegister ? 'Create Your AuraVoice Account' : 'Welcome to AuraVoice AI'}</h3>
          <p>
            {isRegister
              ? 'Join our neural speech intelligence platform & speech analytics studio'
              : 'Sign in to access real-time vocal telemetry & speech archives'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="auth-tabs-nav">
          <button
            type="button"
            className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); setErrors({}); }}
          >
            🔑 Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); setErrors({}); }}
          >
            ✨ Register New User
          </button>
        </div>

        {!isRegister ? (
          /* ================= SIGN IN VIEW ================= */
          <div className="signin-view-wrapper">
            {/* 1-Click Instant Demo User */}
            <div className="quick-demo-section">
              <span className="quick-demo-title">⚡ 1-Click Instant Demo User:</span>
              <div className="demo-btn-group single-demo">
                <button
                  type="button"
                  className="demo-pill-btn user-full-width"
                  onClick={handleQuickDemo}
                >
                  <span className="demo-icon">🎙️</span>
                  <span className="demo-text">
                    <strong>Instant Demo User</strong>
                    <small>Direct access as Sample User (user@auravoice.ai)</small>
                  </span>
                  <span className="demo-arrow">→</span>
                </button>
              </div>
            </div>

            <div className="auth-divider">
              <span>or sign in with credentials</span>
            </div>

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="user@auravoice.ai or admin@auravoice.ai"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); setErrors({}); }}
                  required
                />
                {errors.loginEmail && <span className="field-error-text">{errors.loginEmail}</span>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              {/* Sample Credentials Autofill Helper */}
              <div className="sample-creds-hint">
                <span className="hint-title">🔑 Quick Autofill Test Credentials:</span>
                <div className="hint-tags">
                  <span
                    onClick={() => { setLoginEmail('user@auravoice.ai'); setLoginPassword('user@123'); }}
                    className="hint-pill"
                    title="Click to autofill"
                  >
                    <strong>User:</strong> user@auravoice.ai / <code>user@123</code>
                  </span>
                  <span
                    onClick={() => { setLoginEmail('admin@auravoice.ai'); setLoginPassword('auravoice123'); }}
                    className="hint-pill admin"
                    title="Click to autofill"
                  >
                    <strong>Admin:</strong> admin@auravoice.ai / <code>auravoice123</code>
                  </span>
                </div>
              </div>

              <button type="submit" className="aki-btn aki-btn-primary auth-submit-btn">
                Sign In & Access Studio
              </button>
            </form>
          </div>
        ) : (
          /* ================= COMPREHENSIVE REGISTRATION VIEW ================= */
          <form onSubmit={handleRegisterSubmit} className="auth-form register-form-grid">
            {/* First & Last Name */}
            <div className="form-row-2">
              <div className="form-group">
                <label>First Name <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Rohan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={errors.firstName ? 'input-error' : ''}
                  required
                />
                {errors.firstName && <span className="field-error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label>Last Name <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={errors.lastName ? 'input-error' : ''}
                  required
                />
                {errors.lastName && <span className="field-error-text">{errors.lastName}</span>}
              </div>
            </div>

            {/* Country & Phone Number */}
            <div className="form-row-2">
              <div className="form-group">
                <label>Country / Region <span className="req">*</span></label>
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="auth-select-input"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number <span className="req">*</span></label>
                <div className="phone-input-group">
                  <span className="dial-code-badge">{currentCountry.dialCode}</span>
                  <input
                    type="tel"
                    placeholder={currentCountry.placeholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={errors.phone ? 'input-error' : ''}
                    required
                  />
                </div>
                {errors.phone && <span className="field-error-text">{errors.phone}</span>}
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label>Email Address <span className="req">*</span></label>
              <input
                type="email"
                placeholder="yourname@domain.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className={errors.regEmail ? 'input-error' : ''}
                required
              />
              {errors.regEmail && <span className="field-error-text">{errors.regEmail}</span>}
            </div>

            {/* Password & Confirm Password */}
            <div className="form-row-2">
              <div className="form-group">
                <div className="label-with-badge">
                  <label>Create Password <span className="req">*</span></label>
                  {regPassword && (
                    <span className="pass-strength-tag" style={{ color: passStrength.color }}>
                      {passStrength.label}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className={errors.regPassword ? 'input-error' : ''}
                  required
                />
                {errors.regPassword && <span className="field-error-text">{errors.regPassword}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password <span className="req">*</span></label>
                <input
                  type="password"
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? 'input-error' : ''}
                  required
                />
                {errors.confirmPassword && <span className="field-error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="terms-checkbox-row">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                I agree to the <strong>Terms of Service</strong> and consent to local speech analysis processing.
              </span>
            </label>
            {errors.terms && <span className="field-error-text">{errors.terms}</span>}

            <button type="submit" className="aki-btn aki-btn-primary auth-submit-btn">
              🚀 Complete Registration & Enter Studio
            </button>
          </form>
        )}

        {/* Footer Toggle */}
        <div className="auth-switch-prompt">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button type="button" onClick={() => { setIsRegister(false); setErrors({}); }}>
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to AuraVoice AI?{' '}
              <button type="button" onClick={() => { setIsRegister(true); setErrors({}); }}>
                Create an account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
