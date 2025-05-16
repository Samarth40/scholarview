import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FilterIcon } from './icons';

// Tab options
const TABS = [
  { key: 'all', label: 'All Papers' },
  { key: 'mostCited', label: 'Most Cited' },
  { key: 'recent', label: 'Recent Publications' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'readingList', label: 'Reading List' },
];

// Sort options updated for OpenAlex API
const SORT_OPTIONS = [
  { value: 'cited_by_count:desc', label: 'Most Cited' },
  { value: 'publication_date:desc', label: 'Recent First' },
  { value: 'display_name', label: 'Title A-Z' },
  { value: 'relevance_score:desc', label: 'Relevance' },
];

/**
 * Custom Dropdown Portal component for rendering dropdowns outside the container
 */
const DropdownPortal = ({ children, isOpen, buttonRect }) => {
  const portalRef = useRef(null);
  
  // Always declare hooks, regardless of conditions
  useEffect(() => {
    // Only create portal when needed
    if (isOpen && buttonRect) {
      // Create portal element if needed
      if (!portalRef.current) {
        portalRef.current = document.createElement('div');
        portalRef.current.style.position = 'absolute';
        portalRef.current.style.zIndex = '9999';
        document.body.appendChild(portalRef.current);
      }
    }
    
    // Cleanup function
    return () => {
      if (portalRef.current && portalRef.current.parentNode) {
        document.body.removeChild(portalRef.current);
        portalRef.current = null;
      }
    };
  }, [isOpen, buttonRect]);
  
  // Early return if not showing dropdown
  if (!isOpen || !buttonRect || !portalRef.current) return null;
  
  // Position dropdown
  const style = {
    position: 'fixed',
    top: `${buttonRect.bottom + 4}px`,
    left: `${buttonRect.left}px`,
    width: `${buttonRect.width}px`,
    zIndex: 9999,
  };
  
  return ReactDOM.createPortal(
    <div style={style}>{children}</div>,
    portalRef.current
  );
};

/**
 * TabBar component for switching between different paper views
 */
export const TabBar = ({ activeTab, setActiveTab, favorites, readingList = [] }) => {
  return (
    <div className="flex space-x-2">
      {TABS.map(({ key, label }, index) => (
        <button
          key={key}
          className={`py-2 px-4 font-black tracking-tight ${activeTab === key ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setActiveTab(key)}
        >
          {label}
          {key === 'favorites' && favorites.length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-[#fe5d97] text-white rounded-full font-bold">
              {favorites.length}
            </span>
          )}
          {key === 'readingList' && readingList.length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-[#4b91ff] text-white rounded-full font-bold">
              {readingList.length}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

/**
 * SortingDropdown component for sorting papers
 */
export const SortingDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [buttonRect, setButtonRect] = useState(null);
  
  // Update button position when dropdown opens
  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target) && 
          !event.target.closest('.dropdown-menu')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleSelect = (value) => {
    setSortBy(value);
    setIsOpen(false);
  };
  
  // Get current label for display
  const currentLabel = SORT_OPTIONS.find(option => option.value === sortBy)?.label || SORT_OPTIONS[0].label;
  
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className="neo-input px-4 py-2 pr-10 bg-[#fed823] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0 text-left"
        style={{ transform: "rotate(-1deg)" }}
      >
        Sort: {currentLabel}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>
      
      <DropdownPortal isOpen={isOpen} buttonRect={buttonRect}>
        <div className="dropdown-menu bg-white border-2 border-black neo-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {SORT_OPTIONS.map(option => (
            <div 
              key={option.value} 
              className={`p-2 hover:bg-[#fed823] cursor-pointer ${option.value === sortBy ? 'bg-[#fe5d97] text-white' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              Sort: {option.label}
            </div>
          ))}
        </div>
      </DropdownPortal>
    </div>
  );
};

/**
 * FiltersToggle component for showing/hiding filters
 */
export const FiltersToggle = ({ showFilters, setShowFilters }) => {
  return (
    <button
      className="neo-button bg-[#fe5d97]"
      onClick={() => setShowFilters(!showFilters)}
    >
      <div className="flex items-center gap-2">
        <FilterIcon />
        Filters
      </div>
    </button>
  );
};

/**
 * StatsBar component for displaying metrics about the current papers
 */
export const StatsBar = ({ displayedPapers, activeTab }) => {
  // Get the active tab label
  const activeTabLabel = TABS.find(tab => tab.key === activeTab)?.label || '';
  
  // If there are no papers, don't show stats
  if (!displayedPapers.length) return null;
  
  // Calculate stats
  const averageCitations = Math.round(
    displayedPapers.reduce((sum, paper) => sum + paper.citations, 0) / displayedPapers.length
  );
  const newestYear = Math.max(...displayedPapers.map(paper => paper.year));
  const mostCitations = Math.max(...displayedPapers.map(paper => paper.citations));
  
  return (
    <div className="mb-6 neo-container bg-white p-4 flex flex-wrap justify-between items-center">
      <div className="font-bold">
        {displayedPapers.length} {displayedPapers.length === 1 ? 'paper' : 'papers'} {activeTab !== 'all' ? `in ${activeTabLabel}` : ''}
      </div>
      
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#fe5d97]"></div>
          <span>
            Average Citations: {averageCitations}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#4b91ff]"></div>
          <span>
            Newest: {newestYear}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#fed823]"></div>
          <span>
            Most Cited: {mostCitations} citations
          </span>
        </div>
      </div>
    </div>
  );
}; 