import React from 'react';
import { motion } from 'framer-motion';
import { YearIcon, CitationIcon, HeartIcon, ArrowIcon } from './icons';
import { highlightText } from '../utils/highlightText.jsx';

// BookmarkIcon component for reading list
const BookmarkIcon = ({ filled }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      type: "spring",
      damping: 20,
      stiffness: 200
    }
  }),
  hover: { 
    y: -8, 
    boxShadow: "8px 12px 0px 0px rgba(0,0,0,1)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  },
  tap: { 
    y: 0, 
    boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
    transition: { duration: 0.1 }
  }
};

const buttonVariants = {
  hover: { 
    y: -5, 
    x: -2,
    boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { 
    y: 2, 
    x: 1,
    boxShadow: "1px 1px 0px 0px rgba(0,0,0,1)",
    transition: { duration: 0.1 }
  }
};

const badgeVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

/**
 * Paper Card component for displaying a paper in the grid
 */
const PaperCard = ({ 
  paper, 
  index,
  isFavorite, 
  isInReadingList = false,
  toggleFavorite, 
  toggleReadingList,
  openDetails,
  searchQuery = ''
}) => {
  // Color cycling based on index
  const cardBackground = index % 5 === 0 ? "#fe5d97" : 
                         index % 5 === 1 ? "#fed823" : 
                         index % 5 === 2 ? "#4b91ff" : 
                         index % 5 === 3 ? "#53dd6c" : "#be8cfe";
  
  // Slight rotation for visual interest - disable on mobile for better space usage
  const rotation = window.innerWidth > 768 ? (index % 2 === 0 ? '1deg' : '-1deg') : '0deg';
  
  // Paper pattern background
  const patterns = [
    "radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.15) 3px, transparent 3px)",
    "repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.025), rgba(0, 0, 0, 0.025) 2px, transparent 2px, transparent 6px)",
    "linear-gradient(135deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.05) 75%, transparent 75%, transparent)",
    "linear-gradient(45deg, rgba(255, 255, 255, 0.1) 15%, transparent 15%, transparent 30%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.1) 45%, transparent 45%, transparent)",
    "radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.05) 2px, transparent 2px)"
  ];
  
  const patternBg = patterns[index % patterns.length];

  return (
    <motion.div
      className="neo-card wiggle relative overflow-hidden"
      style={{ 
        "--card-background": cardBackground,
        transform: `rotate(${rotation})`,
        border: "3px solid black",
        boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
        "@media (min-width: 768px)": {
          border: "4px solid black",
          boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)"
        }
      }}
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      layout
    >
      {/* Paper corner fold effect */}
      <motion.div 
        className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 bg-white"
        style={{
          clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          filter: "drop-shadow(-2px 2px 1px rgba(0,0,0,0.2))"
        }}
        whileHover={{ scale: 1.1 }}
      />
      
      {/* Pattern background */}
      <div 
        className="absolute inset-0 opacity-60" 
        style={{ 
          backgroundImage: patternBg,
          backgroundSize: index % 2 === 0 ? '12px 12px' : '16px 16px'
        }} 
      />
      
      {/* Card content with proper spacing */}
      <div className="p-3 sm:p-4 md:p-6 relative z-10">
        <div className="flex flex-wrap justify-between gap-2 md:gap-4 mb-3 md:mb-4">
          <motion.h2 
            className="text-lg md:text-xl font-black tracking-tight cursor-pointer hover:underline"
            onClick={() => openDetails(paper)}
            whileHover={{ scale: 1.03 }}
          >
            {searchQuery ? highlightText(paper.title, searchQuery) : paper.title}
          </motion.h2>
          <div className="flex gap-1 md:gap-2">
            <motion.button 
              onClick={() => toggleFavorite(paper)}
              className={`p-1 sm:p-1.5 rounded-full hover:bg-white/30 transition-colors ${isFavorite ? 'text-red-600 bg-white/20' : 'text-gray-700'}`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <HeartIcon filled={isFavorite} />
            </motion.button>
            <motion.button 
              onClick={() => toggleReadingList(paper)}
              className={`p-1 sm:p-1.5 rounded-full hover:bg-white/30 transition-colors ${isInReadingList ? 'text-blue-600 bg-white/20' : 'text-gray-700'}`}
              aria-label={isInReadingList ? "Remove from reading list" : "Add to reading list"}
              title={isInReadingList ? "Remove from reading list" : "Add to reading list"}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <BookmarkIcon filled={isInReadingList} />
            </motion.button>
          </div>
        </div>
        
        <div className="mb-3 md:mb-4">
          <motion.span 
            className="neo-badge font-bold tracking-tight inline-block text-xs md:text-sm"
            variants={badgeVariants}
            whileHover="hover"
            whileTap="tap"
            style={{
              border: "2px solid black",
              boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
            }}
          >
            {paper.journal}
          </motion.span>
        </div>

        <motion.div 
          className="mb-3 md:mb-4 p-2 md:p-3 bg-white/30 rounded border-2 border-black text-xs md:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + (index * 0.05) }}
        >
          <span className="font-bold">Authors:</span> {searchQuery ? highlightText(paper.authors.join(', '), searchQuery) : paper.authors.join(', ')}
        </motion.div>

        <motion.div 
          className="mb-4 md:mb-5 text-xs md:text-sm leading-relaxed font-medium p-2 md:p-3 bg-white/40 rounded border-2 border-black max-h-16 md:max-h-24 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + (index * 0.05) }}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {searchQuery ? highlightText(paper.abstract, searchQuery) : paper.abstract}
        </motion.div>

        <motion.div 
          className="flex flex-wrap items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t-2 border-black/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + (index * 0.05) }}
        >
          <div className="flex gap-2 md:gap-3 flex-wrap mb-3 w-full md:w-auto">
            <motion.span 
              className="neo-badge bg-white text-black text-xs"
              variants={badgeVariants}
              whileHover="hover"
              whileTap="tap"
              style={{
                border: "2px solid black",
                boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
              }}
            >
              <YearIcon /> {paper.year}
            </motion.span>
            <motion.span 
              className="neo-badge bg-white text-black text-xs"
              variants={badgeVariants}
              whileHover="hover"
              whileTap="tap"
              style={{
                border: "2px solid black",
                boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
              }}
            >
              <CitationIcon /> {paper.citations} citations
            </motion.span>
            {isInReadingList && (
              <motion.span 
                className="neo-badge bg-[#4b91ff] text-white flex items-center gap-1 text-xs"
                variants={badgeVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  border: "2px solid black",
                  boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
                }}
              >
                <BookmarkIcon filled={true} />
                Reading List
              </motion.span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap w-full md:w-auto justify-center md:justify-end">
            <motion.button
              onClick={() => openDetails(paper)}
              className="neo-button bg-white text-black border-black py-1 px-2 md:py-2 md:px-3 text-xs md:text-sm"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{
                border: "2px solid black",
                boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
                marginTop: "3px",
                marginBottom: "3px",
                position: "relative",
                transform: "translateZ(0)",
                transition: "transform 0.3s, box-shadow 0.3s",
                overflow: "hidden",
                backgroundImage: "radial-gradient(circle at 15% 50%, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
                backgroundSize: "10px 10px"
              }}
            >
              <div 
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%", 
                  height: "100%",
                  background: "linear-gradient(45deg, transparent 65%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0.25) 80%, transparent 95%)",
                  pointerEvents: "none",
                  zIndex: 1
                }}
              />
              <span style={{ position: "relative", zIndex: 2, fontWeight: "bold", letterSpacing: "0.5px" }}>View Details</span>
              <div 
                style={{
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  background: "rgba(0, 0, 0, 0.1)",
                  transform: "scaleX(0.95)",
                  zIndex: 0
                }}
              />
            </motion.button>
            <motion.a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button py-1 px-2 md:py-2 md:px-3 flex items-center gap-1 text-xs md:text-sm"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{
                border: "2px solid black",
                boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
                marginTop: "3px",
                marginBottom: "3px",
                position: "relative",
                transform: "translateZ(0) rotate(-1deg)",
                transition: "transform 0.3s, box-shadow 0.3s",
                background: index % 5 === 0 ? "#fe5d97" : 
                           index % 5 === 1 ? "#fed823" : 
                           index % 5 === 2 ? "#4b91ff" : 
                           index % 5 === 3 ? "#53dd6c" : "#be8cfe",
                overflow: "hidden",
                backgroundImage: "repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.03) 0px, rgba(0, 0, 0, 0.03) 2px, transparent 2px, transparent 4px)",
                backgroundSize: "8px 8px"
              }}
            >
              <div 
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%", 
                  height: "100%",
                  background: "linear-gradient(45deg, transparent 65%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0.25) 80%, transparent 95%)",
                  pointerEvents: "none",
                  zIndex: 1
                }}
              />
              <span style={{ position: "relative", zIndex: 2, fontWeight: "bold", letterSpacing: "0.5px" }}>View Paper</span>
              <ArrowIcon />
              <div 
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: 0,
                  width: "100%",
                  height: "2px",
                  background: "rgba(0, 0, 0, 0.1)",
                  transform: "scaleX(0.95)",
                  zIndex: 0
                }}
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaperCard; 