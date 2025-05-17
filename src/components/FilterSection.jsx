import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

// Example subjects - in a real app, these would be extracted from the paper data
const SUBJECTS = ['Computer Science', 'Machine Learning', 'AI Research', 'Computer Vision', 'NLP'];

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
  showFilters,
  isLoadingOptions = false
}) => {
  if (!showFilters) return null;
  
  // NeoBrutalism styled dropdown component 
  const NeoDropdown = ({ label, value, options = [], onChange, defaultOption, isLoading = false }) => {
    const displayValue = value || defaultOption;
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <label className="block text-sm font-bold mb-2">{label}</label>
        <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
          <DropdownMenuTrigger className="w-full px-4 py-2 pr-10 bg-[#fed823] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0 rounded-none text-left relative" style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}>
            <div className="flex items-center justify-between">
              <span className="truncate">{displayValue}</span>
              {isLoading && (
                <svg className="animate-spin h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </div>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-2 border-black bg-white neo-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none max-h-60 overflow-y-auto w-full">
            <DropdownMenuItem 
              className="p-2 hover:bg-[#fe5d97] hover:text-white cursor-pointer font-bold"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
            >
              {defaultOption}
            </DropdownMenuItem>
            {isLoading ? (
              <div className="p-4 text-center">
                <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2">Loading options...</p>
              </div>
            ) : options.length > 0 ? (
              options.map(option => (
                <DropdownMenuItem 
                  key={option} 
                  className={`p-2 hover:bg-[#fe5d97] hover:text-white cursor-pointer ${option === value ? 'bg-[#fe5d97] text-white' : ''}`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No options available</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
        isLoading={isLoadingOptions}
      />
      
      <NeoDropdown 
        label="Journal"
        value={filters.journal}
        options={journals}
        onChange={value => handleFilterChange('journal', value)}
        defaultOption="All Journals"
        isLoading={isLoadingOptions}
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