// AuraVoice AI — Global Application Context
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const SAMPLE_SESSIONS = [
  {
    id: 'session-1',
    title: 'Executive Keynote — Autumn Product Launch',
    date: '2026-08-28 14:30',
    duration: 145,
    text: "Welcome everyone to our annual innovation summit. Our entire product launch exceeded all expectations, and the engineering team demonstrated extraordinary precision. We are thrilled to introduce this next-generation voice intelligence platform.",
    sentiment: { score: 7, comparative: 0.28, label: 'Deeply Positive & Enthusiastic', polarity: 'positive', confidence: 92 },
    emotions: { joy: 85, confidence: 90, serenity: 65, hesitation: 8, frustration: 5, energy: 88 },
    speechDelivery: { totalWords: 36, uniqueWords: 32, diversityRatio: 88, wpm: 138, paceLabel: 'Optimal Conversational', fillerCount: 0, fillerRatio: 0, readability: { score: 72, level: 'Standard & Engaging' } }
  },
  {
    id: 'session-2',
    title: 'Technical Infrastructure Review',
    date: '2026-08-30 10:15',
    duration: 90,
    text: "The server migration was scheduled for Tuesday morning. The latency on the legacy server caused noticeable delays during the presentation, so we might need to adjust our cloud load balancers.",
    sentiment: { score: -2, comparative: -0.09, label: 'Negative & Critical', polarity: 'negative', confidence: 74 },
    emotions: { joy: 18, confidence: 45, serenity: 35, hesitation: 40, frustration: 65, energy: 30 },
    speechDelivery: { totalWords: 29, uniqueWords: 26, diversityRatio: 90, wpm: 125, paceLabel: 'Optimal Conversational', fillerCount: 1, fillerRatio: 3, readability: { score: 62, level: 'Standard & Engaging' } }
  }
];

const INITIAL_REGISTERED_USERS = [
  {
    id: 'usr-admin',
    firstName: 'System',
    lastName: 'Administrator',
    name: 'System Administrator',
    email: 'admin@auravoice.ai',
    password: 'auravoice123',
    role: 'ADMIN',
    country: 'United States',
    dialCode: '+1',
    phone: '5551234567',
    avatar: '👑',
    avatarBg: 'gradient-crimson',
    bio: 'Platform Administrator & Audio Engineer',
    organization: 'AuraVoice HQ',
    status: 'Active',
    registeredAt: '2026-08-01 10:00',
    sessionsCount: 42
  },
  {
    id: 'usr-user',
    firstName: 'Sample',
    lastName: 'User',
    name: 'Sample User',
    email: 'user@auravoice.ai',
    password: 'user@123',
    role: 'USER',
    country: 'India',
    dialCode: '+91',
    phone: '9876543210',
    avatar: '🎙️',
    avatarBg: 'gradient-amber',
    bio: 'Speech Intelligence Speaker & Creator',
    organization: 'Innovation Lab',
    status: 'Active',
    registeredAt: '2026-08-15 14:20',
    sessionsCount: 15
  }
];

export const AppProvider = ({ children }) => {
  // Theme State: 'light' is default (Warm Autumn), can switch to 'dark' (Midnight Autumn)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('auravoice_theme') || 'light';
  });

  // Registered Users Registry (Persistent storage for all accounts)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('auravoice_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REGISTERED_USERS;
      }
    }
    return INITIAL_REGISTERED_USERS;
  });

  // User Authentication State (Default: GUEST if not logged in)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auravoice_user');
    return saved ? JSON.parse(saved) : { name: 'Guest Explorer', email: 'guest@auravoice.ai', role: 'GUEST', avatar: '🌸' };
  });

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Saved Session History
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('auravoice_history');
    return saved ? JSON.parse(saved) : SAMPLE_SESSIONS;
  });

  // Toast notification state
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  // Sync theme changes to html attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('auravoice_theme', theme);
  }, [theme]);

  // Sync registered users to localStorage
  useEffect(() => {
    localStorage.setItem('auravoice_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('auravoice_history', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  const openAuthModal = () => {
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
  };

  const openProfileModal = () => {
    setIsProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };

  const requireAuth = (actionCallback, message = 'Please sign in or use the demo login to access this feature.') => {
    if (user && user.role !== 'GUEST') {
      if (typeof actionCallback === 'function') {
        actionCallback();
      }
      return true;
    } else {
      showToast(message, 'info');
      setIsAuthOpen(true);
      return false;
    }
  };

  // Register New User
  const registerNewUser = (userData) => {
    const existing = registeredUsers.find(
      u => u.email.toLowerCase() === userData.email.toLowerCase().trim()
    );
    if (existing) {
      showToast('An account with this email address already exists.', 'error');
      return { success: false, message: 'Email already exists' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: `${userData.firstName} ${userData.lastName}`.trim(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      country: userData.country || 'United States',
      dialCode: userData.dialCode || '+1',
      phone: userData.phone || '',
      role: userData.role || 'USER',
      avatar: userData.avatar || '🌸',
      avatarBg: userData.avatarBg || 'gradient-crimson',
      bio: 'New Speech Intelligence Explorer',
      organization: userData.organization || 'AuraVoice Studio',
      targetWpm: 135,
      preferredLang: 'en-US',
      status: 'Active',
      registeredAt: new Date().toLocaleString(),
      sessionsCount: 0
    };

    const updatedList = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedList);
    localStorage.setItem('auravoice_registered_users', JSON.stringify(updatedList));

    // Auto log in newly registered user
    loginUser(newUser);
    showToast(`Account created successfully! Welcome, ${newUser.firstName}.`, 'success');
    return { success: true, user: newUser };
  };

  const loginUser = (userData) => {
    // Find matching registered user record if exists
    const matched = registeredUsers.find(
      u => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    const activeUser = {
      avatar: userData.avatar || (matched ? matched.avatar : (userData.role === 'ADMIN' ? '👑' : '🎙️')),
      avatarBg: matched?.avatarBg || 'gradient-crimson',
      bio: matched?.bio || (userData.role === 'ADMIN' ? 'Platform Administrator & Audio Engineer' : 'Speech Intelligence Enthusiast & Speaker'),
      targetWpm: matched?.targetWpm || 135,
      preferredLang: matched?.preferredLang || 'en-US',
      country: matched?.country || 'United States',
      dialCode: matched?.dialCode || '+1',
      phone: matched?.phone || '',
      organization: matched?.organization || 'AuraVoice Lab',
      ...matched,
      ...userData
    };

    setUser(activeUser);
    localStorage.setItem('auravoice_user', JSON.stringify(activeUser));
    showToast(`Welcome back, ${activeUser.name}!`, 'success');
  };

  const updateUserProfile = (profileUpdates) => {
    setUser(prev => {
      const merged = { ...prev, ...profileUpdates };
      localStorage.setItem('auravoice_user', JSON.stringify(merged));

      // Also update in registeredUsers registry
      setRegisteredUsers(users => users.map(u => (u.email.toLowerCase() === merged.email?.toLowerCase() ? { ...u, ...merged } : u)));
      return merged;
    });
    showToast('Personal profile and preferences saved!', 'success');
  };

  const toggleUserRole = (userId) => {
    setRegisteredUsers(users => users.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
        showToast(`Updated ${u.name}'s role to ${nextRole}`, 'info');
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const toggleUserStatus = (userId) => {
    setRegisteredUsers(users => users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`Updated ${u.name}'s status to ${nextStatus}`, 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const logoutUser = () => {
    const guestUser = { name: 'Guest Explorer', email: 'guest@auravoice.ai', role: 'GUEST', avatar: '🌸' };
    setUser(guestUser);
    localStorage.removeItem('auravoice_user');
    showToast('Signed out. Switched to Guest Demo mode.', 'info');
  };

  const saveSession = (newSession) => {
    if (!requireAuth(null, 'Please sign in or use the 1-click demo to save sessions.')) {
      return false;
    }
    setHistory(prev => [newSession, ...prev]);
    showToast('Speech session saved to your archives!', 'success');
    return true;
  };

  const deleteSession = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    showToast('Session removed from archives.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        registeredUsers,
        registerNewUser,
        toggleUserRole,
        toggleUserStatus,
        isAuthOpen,
        openAuthModal,
        closeAuthModal,
        isProfileOpen,
        openProfileModal,
        closeProfileModal,
        updateUserProfile,
        requireAuth,
        loginUser,
        logoutUser,
        history,
        saveSession,
        deleteSession,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
