import React from 'react';
import './ToastNotification.css';
import { useApp } from '../context/AppContext';

export const ToastNotification = () => {
  const { toast } = useApp();

  if (!toast.visible) return null;

  return (
    <div className={`aki-toast-container toast-${toast.type}`}>
      <span className="toast-icon">
        {toast.type === 'success' ? '🌸' : toast.type === 'warning' ? '⚠️' : '🍁'}
      </span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
};
