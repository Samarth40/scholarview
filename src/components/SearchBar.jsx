import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
      <motion.div 
        className="flex gap-2 items-stretch"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <motion.div 
          className="flex-grow relative"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers by title, author, abstract..."
            className="neo-input w-full px-4 py-3 bg-white border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
            style={{ transform: `rotate(${Math.random() * 0.6 - 0.3}deg)` }}
            whileFocus={{ scale: 1.02 }}
          />
          {query && (
            <motion.button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setQuery('')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </motion.div>
        <motion.button
          type="submit"
          className="neo-button px-6 py-2 bg-[#4b91ff] text-white"
          whileHover={{ 
            y: -4, 
            boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ 
            y: 0, 
            boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
            transition: { duration: 0.1 }
          }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Search
          </div>
        </motion.button>
      </motion.div>
    </form>
  );
};

export default SearchBar; 