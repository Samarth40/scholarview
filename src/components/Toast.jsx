import React, { useState, useEffect } from 'react';

/**
 * Toast notification component in neobrutalism style
 */
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  if (!visible) return null;
  
  // Define colors based on type
  const colors = {
    success: '#53dd6c', // Green
    error: '#fe5d97',   // Pink
    info: '#4b91ff',    // Blue
    warning: '#fed823'  // Yellow
  };
  
  const bgColor = colors[type] || colors.success;
  
  // Define icons based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        );
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="8" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div 
      className="fixed top-6 right-6 z-[9999] animate-fadeIn"
      style={{ animation: 'fadeIn 0.3s ease-in-out' }}
    >
      <div 
        className="neo-container p-4 min-w-[250px] flex items-center"
        style={{ 
          backgroundColor: bgColor,
          color: '#000000',
          transform: 'rotate(-1deg)',
          boxShadow: '5px 5px 0px rgba(0, 0, 0, 1)',
          border: '3px solid black'
        }}
      >
        <div className="mr-3">
          {getIcon()}
        </div>
        <p className="font-bold flex-1">{message}</p>
        <button 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-3 p-1 hover:bg-black/10 rounded"
          aria-label="Close notification"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast; 