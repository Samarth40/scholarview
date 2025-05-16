import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Example subjects - in a real app, these would be extracted from the paper data
const SUBJECTS = ['Computer Science', 'Machine Learning', 'AI Research', 'Computer Vision', 'NLP'];

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
 * FilterSection component for filtering papers
 */
const FilterSection = ({ 
  filters, 
  handleFilterChange, 
  clearFilters, 
  years, 
  authors, 
  journals, 
  showFilters 
}) => {
  if (!showFilters) return null;
  
  // Custom dropdown component with neobrutalism styling
  const NeoDropdown = ({ label, value, options, onChange, defaultOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
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
    
    // Update when value changes from parent
    useEffect(() => {
      setSelectedValue(value || '');
    }, [value]);
    
    const handleSelect = (option) => {
      setSelectedValue(option);
      onChange(option);
      setIsOpen(false);
    };
    
    const displayValue = selectedValue || defaultOption;
    
    return (
      <div>
        <label className="block text-sm font-bold mb-2">{label}</label>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          className="neo-input w-full px-4 py-2 pr-10 bg-[#fed823] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0 text-left relative"
          style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
        >
          {displayValue}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>
        
        <DropdownPortal isOpen={isOpen} buttonRect={buttonRect}>
          <div className="dropdown-menu bg-white border-2 border-black neo-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-60 overflow-y-auto">
            <div 
              className="p-2 hover:bg-[#fed823] cursor-pointer font-bold"
              onClick={() => handleSelect('')}
            >
              {defaultOption}
            </div>
            {options.map(option => (
              <div 
                key={option} 
                className={`p-2 hover:bg-[#fed823] cursor-pointer ${option === selectedValue ? 'bg-[#fe5d97] text-white' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </DropdownPortal>
      </div>
    );
  };
  
  return (
    <div className="neo-container p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white transform rotate-1">
      <NeoDropdown 
        label="Subject Area"
        value={filters.subject}
        options={SUBJECTS}
        onChange={value => handleFilterChange('subject', value)}
        defaultOption="All Subjects"
      />
      
      <NeoDropdown 
        label="Publication Year"
        value={filters.year}
        options={years}
        onChange={value => handleFilterChange('year', value)}
        defaultOption="All Years"
      />
      
      <NeoDropdown 
        label="Author"
        value={filters.author}
        options={authors}
        onChange={value => handleFilterChange('author', value)}
        defaultOption="All Authors"
      />
      
      <NeoDropdown 
        label="Journal"
        value={filters.journal}
        options={journals}
        onChange={value => handleFilterChange('journal', value)}
        defaultOption="All Journals"
      />
      
      <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end">
        <button
          className="neo-button bg-[#fe5d97] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0"
          onClick={clearFilters}
          style={{ transform: "rotate(-1deg)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
            <path d="M19 12H5M12 19V5" />
          </svg>
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSection; 