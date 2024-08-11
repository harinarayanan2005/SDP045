import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashBoard.css'; // Import the CSS for styling

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin DashBoard</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => handleTabChange('overview')} className={activeTab === 'overview' ? 'active' : ''}>Overview</li>
            <li onClick={() => handleTabChange('users')} className={activeTab === 'users' ? 'active' : ''}>User Management</li>
            <li onClick={() => handleTabChange('speech-analysis')} className={activeTab === 'speech-analysis' ? 'active' : ''}>Speech Analysis</li>
            <li onClick={() => handleTabChange('reports')} className={activeTab === 'reports' ? 'active' : ''}>Reports</li>
            <li onClick={() => handleTabChange('settings')} className={activeTab === 'settings' ? 'active' : ''}>Settings</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <h3>Overview</h3>
            <div className="stats">
              <div className="stat-card">
                <h4>Total Users</h4>
                <p>1200</p>
              </div>
              <div className="stat-card">
                <h4>Active Users</h4>
                <p>350</p>
              </div>
              <div className="stat-card">
                <h4>Total Analyzed Speeches</h4>
                <p>4567</p>
              </div>
              <div className="stat-card">
                <h4>System Health</h4>
                <p>All systems operational</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <h3>User Management</h3>
            <p>Manage users here.</p>
            {/* User management components can be added here */}
          </div>
        )}

        {activeTab === 'speech-analysis' && (
          <div className="tab-content">
            <h3>Speech Analysis Overview</h3>
            <p>Overview of analyzed speeches.</p>
            {/* Speech analysis components can be added here */}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="tab-content">
            <h3>Reports</h3>
            <p>Generate and view reports here.</p>
            {/* Report generation and view components can be added here */}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <h3>System Settings</h3>
            <p>Configure system settings here.</p>
            {/* System settings components can be added here */}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
