// ProfileIcon.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProfileIcon.css';
import defaultAvatar from './images/OIP (1).jpeg'; // Import the default image

const ProfileIcon = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    onLogout();
    setDropdownOpen(false);
  };

  return (
    <div className="profile-icon">
      <div className="profile-avatar" onClick={toggleDropdown}>
        <img src={defaultAvatar} alt="User Avatar" className="user-avatar" />
      </div>
      {dropdownOpen && (
        <div className="dropdown-menu">
          <p>{user.email}</p>
          <Link to="/" onClick={handleLogout} className="logout-link">
            Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
