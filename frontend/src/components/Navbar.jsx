import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export const Navbar = ({ onOpenAuth }) => {
  const { theme, toggleTheme, user, logoutUser, openAuthModal, openProfileModal } = useApp();
  const location = useLocation();

  const handleOpenAuth = () => {
    if (onOpenAuth) onOpenAuth();
    else openAuthModal();
  };

  const isGuest = !user || user.role === 'GUEST';
  const isAdmin = user && user.role === 'ADMIN';
  const isUser = user && user.role === 'USER';

  return (
    <header className="aki-navbar-wrapper">
      <div className="aki-navbar-container">
        {/* Brand Logo */}
        <Link to={isAdmin ? "/admin" : "/"} className="aki-brand">
          <div className="aki-brand-seal">
            <span className="seal-symbol">🌸</span>
          </div>
          <div className="aki-brand-text">
            <div className="brand-title">
              AuraVoice <span>AI</span>
            </div>
            <div className="brand-subtitle">
              {isAdmin ? 'System Administration Portal' : 'Speech & Vocal Sentiment Studio'}
            </div>
          </div>
        </Link>

        {/* Role-Specific Navigation Links */}
        <nav className="aki-nav-links">
          {/* Guest Navigation */}
          {isGuest && (
            <>
              <Link
                to="/"
                className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`}
              >
                🎙️ Live Studio Demo
              </Link>
              <button
                type="button"
                onClick={handleOpenAuth}
                className="nav-link-item link-button"
              >
                📊 Archives (Sign In)
              </button>
            </>
          )}

          {/* Standard User Navigation */}
          {isUser && (
            <>
              <Link
                to="/"
                className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`}
              >
                🎙️ Speech Studio
              </Link>
              <Link
                to="/dashboard"
                className={`nav-link-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                📊 My Analytics & Archives
              </Link>
            </>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={`nav-link-item admin-active-tab ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                🛡️ System Operations & RBAC
              </Link>
              <Link
                to="/dashboard"
                className={`nav-link-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                📊 Archives Review
              </Link>
              <Link
                to="/"
                className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`}
              >
                🎙️ Studio Test Bed
              </Link>
            </>
          )}
        </nav>

        {/* Action Controls: Theme Switcher & User Profile */}
        <div className="aki-nav-actions">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="theme-switch-btn"
            title={`Switch to ${theme === 'light' ? 'Midnight Sakura (Dark)' : 'Sakura Blossom (Light)'}`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <>
                <span className="theme-icon">🌙</span>
                <span className="theme-label">Midnight</span>
              </>
            ) : (
              <>
                <span className="theme-icon">🌸</span>
                <span className="theme-label">Sakura</span>
              </>
            )}
          </button>

          {/* User Auth & Profile Controls */}
          {!isGuest ? (
            <div className="user-profile-menu">
              <button
                type="button"
                onClick={openProfileModal}
                className={`user-avatar-pill interactive-pill ${isAdmin ? 'admin-pill' : 'user-pill'}`}
                title="Click to edit profile, change avatar icon, or set speaking goals"
              >
                <span className="user-avatar-circle">
                  {user.avatar || (isAdmin ? '👑' : '🎙️')}
                </span>
                <span className="user-name-label">{user.name}</span>
                <span className={`role-tag ${user.role.toLowerCase()}`}>{user.role}</span>
                <span className="pill-edit-icon" title="Edit Profile">✏️</span>
              </button>

              <button
                onClick={logoutUser}
                className="aki-btn-logout"
                title="Sign Out"
                aria-label="Sign Out"
              >
                🚪
              </button>
            </div>
          ) : (
            <button onClick={handleOpenAuth} className="aki-btn aki-btn-primary nav-login-btn">
              ⚡ Sign In / Demo
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


