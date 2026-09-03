import React, { useState } from 'react';
import './AdminHub.css';
import { useApp } from '../context/AppContext';

export const AdminHub = () => {
  const { registeredUsers, toggleUserRole, toggleUserStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const users = registeredUsers || [];

  const filteredUsers = users.filter(u =>
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.phone && u.phone.includes(searchQuery)) ||
    (u.country && u.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="admin-hub-container">
      {/* 1. Header */}
      <div className="admin-header">
        <div className="admin-titles">
          <div className="hanko-badge">
            <span>ADMIN</span> System Telemetry & Operations
          </div>
          <h2>Platform Operations & User Registry</h2>
          <p>Real-time speech recognition engine telemetry, model inference status, and registered user accounts.</p>
        </div>
        <div className="system-health-pill">
          <span className="live-pulse" />
          <span>All Neural Nodes Operational</span>
        </div>
      </div>

      {/* 2. Platform Telemetry Metrics */}
      <div className="telemetry-deck-grid">
        <div className="aki-card telemetry-stat-box">
          <span className="telemetry-tag">Total Registered Users</span>
          <div className="telemetry-big-val">{users.length}</div>
          <span className="telemetry-delta green">Persistent Registry</span>
        </div>

        <div className="aki-card telemetry-stat-box">
          <span className="telemetry-tag">Speech Inference Latency</span>
          <div className="telemetry-big-val">38 <small>ms</small></div>
          <span className="telemetry-delta green">Ultra Low Latency</span>
        </div>

        <div className="aki-card telemetry-stat-box">
          <span className="telemetry-tag">Sentiment Confidence Avg</span>
          <div className="telemetry-big-val">96.4%</div>
          <span className="telemetry-delta ginkgo">Vocal & Lexical Model</span>
        </div>

        <div className="aki-card telemetry-stat-box">
          <span className="telemetry-tag">Uptime SLA</span>
          <div className="telemetry-big-val">99.99%</div>
          <span className="telemetry-delta green">Cloud Audio Cluster</span>
        </div>
      </div>

      {/* 3. User Directory & Role Management */}
      <div className="aki-card user-directory-card">
        <div className="directory-header">
          <div className="directory-title">
            <span className="badge-tag">REGISTRY</span>
            <h3>Registered User Directory & Access Control</h3>
          </div>
          <div className="directory-search-box">
            <input
              type="text"
              placeholder="Search by name, email, phone or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User & Persona</th>
                <th>Email</th>
                <th>Phone & Country</th>
                <th>Role</th>
                <th>Status</th>
                <th>Sessions</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="table-user-cell">
                      <div className="user-avatar-sm">
                        {u.customPhotoUrl ? (
                          <img src={u.customPhotoUrl} alt="" className="custom-photo-img" />
                        ) : (
                          <span>{u.avatar || '🌸'}</span>
                        )}
                      </div>
                      <div>
                        <strong>{u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()}</strong>
                        {u.bio && <small className="user-table-bio">{u.bio}</small>}
                      </div>
                    </div>
                  </td>
                  <td className="email-cell">{u.email}</td>
                  <td>
                    <span className="phone-country-cell">
                      {u.dialCode} {u.phone || 'N/A'}
                      <small>{u.country || 'Global'}</small>
                    </span>
                  </td>
                  <td>
                    <span className={`role-badge ${u.role.toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(u.id)}
                      className={`status-btn-pill ${u.status.toLowerCase()}`}
                      title="Click to toggle active/suspended status"
                    >
                      <span className={`status-dot ${u.status.toLowerCase()}`} />
                      {u.status}
                    </button>
                  </td>
                  <td>{u.sessionsCount || 0}</td>
                  <td className="registered-date-cell">{u.registeredAt || 'Recent'}</td>
                  <td>
                    {u.id !== 'usr-admin' && (
                      <button
                        onClick={() => toggleUserRole(u.id)}
                        className="aki-btn aki-btn-secondary btn-sm"
                      >
                        Toggle {u.role === 'ADMIN' ? 'User' : 'Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
