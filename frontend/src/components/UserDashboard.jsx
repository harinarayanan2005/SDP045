import React from 'react';
import './UserDashboard.css';
import { useApp } from '../context/AppContext';
import { generatePdfReport } from '../services/pdfGenerator';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
  const { history, deleteSession, showToast } = useApp();

  const totalSessions = history.length;
  const avgWpm = totalSessions > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.speechDelivery?.wpm || 0), 0) / totalSessions)
    : 0;
  const positiveSessions = history.filter(s => s.sentiment?.polarity === 'positive').length;
  const positiveRatio = totalSessions > 0 ? Math.round((positiveSessions / totalSessions) * 100) : 0;
  const totalFillers = history.reduce((acc, curr) => acc + (curr.speechDelivery?.fillerCount || 0), 0);

  const handleDownloadPdf = (session) => {
    generatePdfReport(
      {
        sentiment: session.sentiment,
        emotions: session.emotions,
        speechDelivery: session.speechDelivery
      },
      session.text,
      session.title
    );
    showToast(`PDF report generated for "${session.title}"`, 'success');
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AkiVoice_History_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported history as JSON!', 'success');
  };

  return (
    <div className="dashboard-container">
      {/* 1. Header & Quick Actions */}
      <div className="dashboard-header">
        <div className="header-titles">
          <div className="hanko-badge">
            <span>ARCHIVES</span> Session History & Analytics
          </div>
          <h2>Analytics & Speech History</h2>
          <p>Review your historical vocal clarity, sentiment progression, and download past analytical reports.</p>
        </div>
        <div className="header-actions">
          <button onClick={handleExportJson} className="aki-btn aki-btn-secondary">
            📦 Export JSON
          </button>
          <Link to="/" className="aki-btn aki-btn-primary">
            🎙️ New Recording
          </Link>
        </div>
      </div>

      {/* 2. Key Telemetry Stat Cards */}
      <div className="stats-overview-grid">
        <div className="aki-card stat-card">
          <div className="stat-icon-wrapper maple">🎙️</div>
          <div className="stat-content">
            <span className="stat-label">Total Speeches</span>
            <span className="stat-number">{totalSessions}</span>
            <span className="stat-caption">Recorded sessions</span>
          </div>
        </div>

        <div className="aki-card stat-card">
          <div className="stat-icon-wrapper ginkgo">⏱️</div>
          <div className="stat-content">
            <span className="stat-label">Avg. Speaking Pace</span>
            <span className="stat-number">{avgWpm} <small>WPM</small></span>
            <span className="stat-caption">Words per minute</span>
          </div>
        </div>

        <div className="aki-card stat-card">
          <div className="stat-icon-wrapper matcha">🌸</div>
          <div className="stat-content">
            <span className="stat-label">Positive Resonance</span>
            <span className="stat-number">{positiveRatio}%</span>
            <span className="stat-caption">{positiveSessions} uplifting deliveries</span>
          </div>
        </div>

        <div className="aki-card stat-card">
          <div className="stat-icon-wrapper amber">💬</div>
          <div className="stat-content">
            <span className="stat-label">Total Filler Words</span>
            <span className="stat-number">{totalFillers}</span>
            <span className="stat-caption">Across all archives</span>
          </div>
        </div>
      </div>

      {/* 3. Session List Cards */}
      <div className="sessions-list-wrapper">
        <div className="sessions-list-header">
          <h3>
            <span className="badge-tag">RECORDINGS</span>
            <span>Recorded Speech Sessions ({history.length})</span>
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="aki-card empty-history-card">
            <span>🍂</span>
            <p>No speech recordings found in history yet.</p>
            <Link to="/" className="aki-btn aki-btn-primary" style={{ marginTop: '14px' }}>
              Launch Voice Studio
            </Link>
          </div>
        ) : (
          <div className="session-cards-stack">
            {history.map((item) => {
              const isPos = item.sentiment?.polarity === 'positive';
              const isNeg = item.sentiment?.polarity === 'negative';
              const badgeClass = isPos ? 'badge-pos' : isNeg ? 'badge-neg' : 'badge-neu';

              return (
                <div key={item.id} className="aki-card session-item-card">
                  <div className="session-item-left">
                    <div className="session-badge-row">
                      <span className={`session-polarity-tag ${badgeClass}`}>
                        {item.sentiment?.label || 'Neutral'}
                      </span>
                      <span className="session-date-stamp">🕒 {item.date}</span>
                      <span className="session-duration">⏳ {item.duration}s</span>
                    </div>

                    <h4 className="session-item-title">{item.title}</h4>
                    <p className="session-text-snippet">{item.text}</p>

                    <div className="session-mini-metrics">
                      <span><strong>WPM:</strong> {item.speechDelivery?.wpm || 120}</span>
                      <span><strong>Fillers:</strong> {item.speechDelivery?.fillerCount || 0}</span>
                      <span><strong>Readability:</strong> {item.speechDelivery?.readability?.score || 70}/100</span>
                      <span><strong>Confidence:</strong> {item.sentiment?.confidence || 80}%</span>
                    </div>
                  </div>

                  <div className="session-item-actions">
                    <button
                      onClick={() => handleDownloadPdf(item)}
                      className="aki-btn aki-btn-secondary"
                      title="Download Analytical PDF Report"
                    >
                      📄 PDF Report
                    </button>
                    <button
                      onClick={() => deleteSession(item.id)}
                      className="aki-btn-del"
                      title="Delete Session"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
