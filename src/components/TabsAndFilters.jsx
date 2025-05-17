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

// Tab icons for mobile
const TAB_ICONS = {
  all: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  mostCited: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
      <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
    </svg>
  ),
  recent: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  favorites: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  readingList: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

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
  const tabsRef = useRef(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  const [compactView, setCompactView] = useState(window.innerWidth < 640);
  const [veryCompactView, setVeryCompactView] = useState(window.innerWidth < 480);
  
  // Check scroll position to show/hide indicators
  const checkScrollPosition = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftIndicator(scrollLeft > 10);
      setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  
  // Add resize listener to toggle compact view
  useEffect(() => {
    const handleResize = () => {
      setCompactView(window.innerWidth < 640);
      setVeryCompactView(window.innerWidth < 480);
      checkScrollPosition();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initialize scroll indicators and handle when tabs change
  useEffect(() => {
    checkScrollPosition();
    
    // Scroll active tab into view when changing tabs
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeTabElement) {
        const tabsContainer = tabsRef.current;
        const tabRect = activeTabElement.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();
        
        // If tab is not fully visible, scroll to make it visible
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
          const scrollPosition = activeTabElement.offsetLeft - (tabsContainer.clientWidth / 2) + (tabRect.width / 2);
          tabsContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeTab]);
  
  // Handle scroll event
  const handleScroll = () => {
    checkScrollPosition();
  };
  
  // Handle scroll buttons
  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const currentScroll = tabsRef.current.scrollLeft;
      const scrollAmount = direction === 'left' ? -160 : 160;
      tabsRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Mobile Dropdown for tiny screens */}
      <div className="block sm:hidden mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="neo-button bg-black text-white py-1 px-3 w-full flex items-center justify-between"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <span className="font-bold tracking-tight flex items-center">
                {TAB_ICONS[activeTab]}
                <span className="ml-2">{TABS.find(tab => tab.key === activeTab)?.label}</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full border-2 border-black bg-white neo-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
            {TABS.map(({ key, label }) => (
              <DropdownMenuItem
                key={key}
                className={`p-2 hover:bg-[#fe5d97] hover:text-white cursor-pointer ${
                  key === activeTab ? 'bg-[#fe5d97] text-white' : ''
                }`}
                onClick={() => setActiveTab(key)}
              >
                <div className="flex items-center">
                  {TAB_ICONS[key]}
                  <span className="ml-2">{label}</span>
                  {key === 'favorites' && favorites.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs bg-white text-[#fe5d97] rounded-full font-bold">
                      {favorites.length}
                    </span>
                  )}
                  {key === 'readingList' && readingList.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs bg-white text-[#4b91ff] rounded-full font-bold">
                      {readingList.length}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Main Tab Bar with scroll indicators */}
      <div className="relative hidden sm:block">
        {/* Left scroll indicator/button - fade in/out based on scroll position */}
        {showLeftIndicator && (
          <motion.button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border-2 border-black rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            onClick={() => scrollTabs('left')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>
        )}
    
        {/* Right scroll indicator/button - fade in/out based on scroll position */}
        {showRightIndicator && (
          <motion.button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border-2 border-black rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            onClick={() => scrollTabs('right')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        )}
        
        <motion.div 
          className="relative flex overflow-x-auto pb-2 px-8 hide-scrollbar"
          variants={tabContainerVariants}
          initial="hidden"
          animate="visible"
          ref={tabsRef}
          onScroll={handleScroll}
        >
          <div className="flex space-x-1 md:space-x-2">
            {TABS.map(({ key, label }, index) => (
              <motion.button
                key={key}
                data-tab={key}
                className={`
                  ${compactView 
                    ? 'py-1 px-2 rounded-md' 
                    : 'py-1 px-2 md:py-2 md:px-4 relative'
                  }
                  font-black tracking-tight whitespace-nowrap text-sm md:text-base
                  ${activeTab === key 
                    ? 'text-black' 
                    : 'text-gray-500 hover:text-gray-800'
                  }
                  transition-all duration-300 ease-in-out relative
                `}
                onClick={() => setActiveTab(key)}
                variants={tabItemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                animate={activeTab === key ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="flex items-center justify-center">
                  {compactView ? (
                    <div className="flex flex-col items-center">
                      {TAB_ICONS[key]}
                      {!veryCompactView && (
                        <span className="text-xs mt-1 font-bold">
                          {key === 'mostCited' ? 'Cited' : key === 'readingList' ? 'Reading' : key === 'recent' ? 'Recent' : label}
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      {label}
                    </>
                  )}
                  
                  {key === 'favorites' && favorites.length > 0 && (
                    <motion.span 
                      className={`ml-1 inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 text-xs bg-[#fe5d97] text-white rounded-full font-bold ${compactView ? 'absolute -top-2 -right-2' : ''}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {favorites.length}
                    </motion.span>
                  )}
                  
                  {key === 'readingList' && readingList.length > 0 && (
                    <motion.span 
                      className={`ml-1 inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 text-xs bg-[#4b91ff] text-white rounded-full font-bold ${compactView ? 'absolute -top-2 -right-2' : ''}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {readingList.length}
                    </motion.span>
                  )}
                </div>
                
                {/* Active tab indicator with animation */}
                {activeTab === key && (
                  <motion.div 
                    className="h-1 bg-black rounded-full absolute -bottom-1 left-0 right-0 mx-auto w-2/3"
                    layoutId="activeTabIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/**
 * SortingDropdown component for sorting papers - neobrutalism style
 */
export const SortingDropdown = ({ sortBy, setSortBy }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  // Get current label for display
  const currentLabel = SORT_OPTIONS.find(option => option.value === sortBy)?.label || SORT_OPTIONS[0].label;
  
  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button 
          className="neo-input px-2 py-1 md:px-4 md:py-2 pr-8 md:pr-10 bg-[#fed823] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer rounded-none text-left text-sm md:text-base flex items-center" 
          style={{ transform: "rotate(-1deg)" }}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
        >
          {isSmallScreen ? (
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
              <span className="truncate max-w-[70px]">{currentLabel}</span>
            </div>
          ) : (
            <>
              <span className="hidden md:inline">Sort:</span> {currentLabel}
            </>
          )}
          <span className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-2 border-black bg-white neo-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none min-w-[150px] md:min-w-[180px]">
        {SORT_OPTIONS.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <DropdownMenuItem 
              className={`p-2 hover:bg-[#fe5d97] hover:text-white cursor-pointer text-sm md:text-base ${option.value === sortBy ? 'bg-[#fe5d97] text-white' : ''}`}
              onClick={() => setSortBy(option.value)}
            >
              <span className={isSmallScreen ? '' : 'hidden md:inline'}>Sort:</span> {option.label}
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
      className="neo-button bg-[#fe5d97] px-2 py-1 md:px-4 md:py-2 text-sm md:text-base"
      onClick={() => setShowFilters(!showFilters)}
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
      aria-label="Toggle filters"
    >
      <div className="flex items-center gap-1 md:gap-2">
        <FilterIcon />
        <span className="hidden xs:inline">Filters</span>
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
      className="mb-4 md:mb-6 neo-container bg-white p-2 md:p-4 flex flex-wrap gap-y-2 justify-between items-center"
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
      <div className="font-bold text-sm md:text-base w-full sm:w-auto text-center sm:text-left mb-1 sm:mb-0">
        {displayedPapers.length} {displayedPapers.length === 1 ? 'paper' : 'papers'} {activeTab !== 'all' ? `in ${activeTabLabel}` : ''}
      </div>
      
      <div className="flex flex-wrap justify-center sm:justify-end gap-3 md:gap-6 text-xs md:text-sm w-full sm:w-auto">
        <motion.div 
          className="flex items-center gap-1 md:gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#fe5d97]"></div>
          <span className="whitespace-nowrap">
            Avg. Citations: {averageCitations}
          </span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-1 md:gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#4b91ff]"></div>
          <span className="whitespace-nowrap">
            Newest: {newestYear}
          </span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-1 md:gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#53dd6c]"></div>
          <span className="whitespace-nowrap">
            Most Cited: {mostCitations}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}; 