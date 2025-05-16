import React, { useState } from 'react';

/**
 * SearchBar component with neobrutalism styling
 */
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="flex gap-2 items-stretch">
        <div className="flex-grow relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers by title, author, abstract..."
            className="neo-input w-full px-4 py-3 bg-white border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
            style={{ transform: `rotate(${Math.random() * 0.6 - 0.3}deg)` }}
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setQuery('')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className="neo-button px-6 py-2 bg-[#4b91ff] text-white"
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Search
          </div>
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 