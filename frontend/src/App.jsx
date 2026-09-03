import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SpeechStudio } from './components/SpeechStudio';
import { UserDashboard } from './components/UserDashboard';
import { AdminHub } from './components/AdminHub';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { FujiTrainLoader } from './components/FujiTrainLoader';
import { ToastNotification } from './components/ToastNotification';
import './App.css';

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { user, showToast } = useApp();
  
  if (!user || user.role !== 'ADMIN') {
    showToast('Admin access required. Please sign in with administrator credentials.', 'warning');
    return <Navigate to="/" replace />;
  }
  return children;
};

// User / Authenticated Route Guard
const UserRoute = ({ children }) => {
  const { user, openAuthModal, showToast } = useApp();

  if (!user || user.role === 'GUEST') {
    showToast('Please sign in or use the 1-click demo to view your personal archives.', 'info');
    openAuthModal();
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppContent = () => {
  const { isAuthOpen, closeAuthModal, openAuthModal, isProfileOpen, closeProfileModal } = useApp();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  return (
    <Router>
      <div className="aki-app-layout">
        {/* Initial Neural Engine Initialization Loader */}
        {isInitialLoading && (
          <FujiTrainLoader
            title="Initializing Acoustic Models"
            duration={1600}
            onComplete={() => setIsInitialLoading(false)}
          />
        )}

        <Navbar onOpenAuth={openAuthModal} />
        
        <main className="aki-main-content">
          <Routes>
            <Route path="/" element={<SpeechStudio />} />
            <Route
              path="/dashboard"
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminHub />
                </AdminRoute>
              }
            />
            <Route path="*" element={<SpeechStudio />} />
          </Routes>
        </main>

        <footer className="aki-footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="badge-tag">AURAVOICE AI</span>
              <p>AuraVoice AI — Next-Generation Speech Recognition & Vocal Sentiment Studio</p>
            </div>
            <div className="footer-links">
              <span>Next-Gen Audio Intelligence</span>
              <span>•</span>
              <span>Web Speech API & Neural Sentiment</span>
            </div>
          </div>
        </footer>

        <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} />
        <ProfileModal isOpen={isProfileOpen} onClose={closeProfileModal} />
        <ToastNotification />
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

