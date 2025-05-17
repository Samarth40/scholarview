import React from 'react';
import { motion } from 'framer-motion';

/**
 * Component displayed when no papers match the current search/filter criteria
 */
const NoResults = ({ activeTab, clearFilters, searchQuery }) => {
  return (
    <motion.div 
      className="lg:col-span-2 neo-container bg-white p-10 text-center"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.5
      }}
    >
      <motion.div 
        className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-indigo-50 mb-4"
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: "easeInOut" 
        }}
      >
        <motion.svg 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
        </motion.svg>
      </motion.div>
      <motion.h3 
        className="text-xl font-black mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        No papers found
      </motion.h3>
      <motion.p 
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {activeTab === 'favorites' 
          ? "You haven't saved any favorites yet. Find interesting papers and click the heart icon to save them."
          : activeTab === 'readingList'
          ? "Your reading list is empty. Add papers to your reading list by clicking the bookmark icon."
          : searchQuery
          ? `No papers match your search for "${searchQuery}". Try a different search term or clear the filters.`
          : "No papers match your current filter criteria."}
      </motion.p>
      <motion.button
        className="neo-button"
        onClick={clearFilters}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        Clear All Filters
      </motion.button>
    </motion.div>
  );
};

export default NoResults; 