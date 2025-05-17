import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FilterIcon } from './icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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

// Animation variants
const tabContainerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      damping: 20, 
      stiffness: 200,
      staggerChildren: 0.1 
    }
  }
};

const tabItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      damping: 15, 
      stiffness: 200 
    } 
  }
};

const buttonVariants = {
  hover: { 
    y: -2, 
    boxShadow: "4px 6px 0px 0px rgba(0,0,0,1)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { 
    y: 0, 
    boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
    transition: { duration: 0.1 }
  }
};

/**
 * TabBar component for switching between different paper views
 */
export const TabBar = ({ activeTab, setActiveTab, favorites, readingList = [] }) => {
  return (
    <motion.div 
      className="flex space-x-2"
      variants={tabContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {TABS.map(({ key, label }, index) => (
        <motion.button
          key={key}
          className={`py-2 px-4 font-black tracking-tight ${activeTab === key ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setActiveTab(key)}
          variants={tabItemVariants}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          animate={activeTab === key ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {label}
          {key === 'favorites' && favorites.length > 0 && (
            <motion.span 
              className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-[#fe5d97] text-white rounded-full font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {favorites.length}
            </motion.span>
          )}
          {key === 'readingList' && readingList.length > 0 && (
            <motion.span 
              className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-[#4b91ff] text-white rounded-full font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {readingList.length}
            </motion.span>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};

/**
 * SortingDropdown component for sorting papers - neobrutalism style
 */
export const SortingDropdown = ({ sortBy, setSortBy }) => {
  // Get current label for display
  const currentLabel = SORT_OPTIONS.find(option => option.value === sortBy)?.label || SORT_OPTIONS[0].label;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button 
          className="neo-input px-4 py-2 pr-10 bg-[#fed823] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer rounded-none text-left" 
          style={{ transform: "rotate(-1deg)" }}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
        >
          Sort: {currentLabel}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-2 border-black bg-white neo-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none min-w-[180px]">
        {SORT_OPTIONS.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <DropdownMenuItem 
              className={`p-2 hover:bg-[#fe5d97] hover:text-white cursor-pointer ${option.value === sortBy ? 'bg-[#fe5d97] text-white' : ''}`}
              onClick={() => setSortBy(option.value)}
            >
              Sort: {option.label}
            </DropdownMenuItem>
          </motion.div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * FiltersToggle component for showing/hiding filters
 */
export const FiltersToggle = ({ showFilters, setShowFilters }) => {
  return (
    <motion.button
      className="neo-button bg-[#fe5d97]"
      onClick={() => setShowFilters(!showFilters)}
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <FilterIcon />
        Filters
      </div>
    </motion.button>
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
    <motion.div 
      className="mb-6 neo-container bg-white p-4 flex flex-wrap justify-between items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay: 0.5 
      }}
      whileHover={{ y: -2, boxShadow: "6px 6px 0px rgba(0, 0, 0, 1)" }}
    >
      <div className="font-bold">
        {displayedPapers.length} {displayedPapers.length === 1 ? 'paper' : 'papers'} {activeTab !== 'all' ? `in ${activeTabLabel}` : ''}
      </div>
      
      <div className="flex gap-6 text-sm">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-3 h-3 rounded-full bg-[#fe5d97]"></div>
          <span>
            Average Citations: {averageCitations}
          </span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="w-3 h-3 rounded-full bg-[#4b91ff]"></div>
          <span>
            Newest: {newestYear}
          </span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-3 h-3 rounded-full bg-[#fed823]"></div>
          <span>
            Most Cited: {mostCitations} citations
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}; 