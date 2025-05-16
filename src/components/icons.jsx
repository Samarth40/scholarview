import React from 'react';

// Year icon
export const YearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Citation icon
export const CitationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18" />
    <path d="M8 9h8" />
    <path d="M8 15h8" />
  </svg>
);

// Favorite icon
export const HeartIcon = ({ filled }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// Search icon
export const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Filter icon
export const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

// Close icon
export const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// Arrow icon
export const ArrowIcon = () => (
  <svg width="16" height="16" className="ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// Decorative doodles for neobrutalism
export const Doodle = ({ type, className }) => {
  const doodles = {
    zigzag: (
      <svg width="82" height="17" viewBox="0 0 82 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M1 8.5L9.5 1L18 8.5L26.5 1L35 8.5L43.5 1L52 8.5L60.5 1L69 8.5L77.5 1L81 4.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    stars: (
      <svg width="90" height="40" viewBox="0 0 90 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 8L14.5 13.5L20.5 14.5L16 18.5L17.5 24.5L12 21.5L6.5 24.5L8 18.5L3.5 14.5L9.5 13.5L12 8Z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M46 24L48.5 29.5L54.5 30.5L50 34.5L51.5 40.5L46 37.5L40.5 40.5L42 34.5L37.5 30.5L43.5 29.5L46 24Z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M78 4L80.5 9.5L86.5 10.5L82 14.5L83.5 20.5L78 17.5L72.5 20.5L74 14.5L69.5 10.5L75.5 9.5L78 4Z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    arrow: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M24 4V44M24 4L12 16M24 4L36 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    circles: (
      <svg width="72" height="24" viewBox="0 0 72 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="11" stroke="black" strokeWidth="2"/>
        <circle cx="36" cy="12" r="11" stroke="black" strokeWidth="2"/>
        <circle cx="60" cy="12" r="11" stroke="black" strokeWidth="2"/>
      </svg>
    )
  };
  
  return doodles[type] || null;
}; 