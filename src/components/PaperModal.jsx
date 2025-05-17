import React, { useState, useEffect, useRef } from 'react';
import { YearIcon, CitationIcon, HeartIcon, CloseIcon, ArrowIcon } from './icons';
import PaperCard from './PaperCard';
import { highlightText } from '../utils/highlightText.jsx';
import { getRelatedWorks } from '../services/openAlexService';
import { useToast } from './ToastContainer';
import { motion, AnimatePresence } from 'framer-motion';

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

/**
 * Modal component for displaying paper details
 */
const PaperModal = ({ 
  paper, 
  onClose, 
  onToggleFavorite, 
  onToggleReadingList,
  isFavorite,
  isInReadingList = false,
  searchQuery = '',
  loadRelatedPapers
}) => {
  if (!paper) return null;
  
  // Get toast functions
  const { showSuccess, showError, showInfo } = useToast();
  
  // Random color for visual flair (changes on each render)
  const colors = ["#fe5d97", "#fed823", "#4b91ff", "#53dd6c", "#be8cfe"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Generate a citation impact score from 1-5 based on citations
  const citationImpact = Math.min(5, Math.max(1, Math.ceil(paper.citations / 30)));
  
  // State for citations dropdown
  const [showCitations, setShowCitations] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('apa');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [formatDropdownPosition, setFormatDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [relatedPapers, setRelatedPapers] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const formatDropdownRef = useRef(null);
  
  // Format options for citations
  const formatOptions = ['apa', 'mla', 'chicago', 'bibtex'];
  
  // Fetch related papers
  const fetchRelatedPapers = async () => {
    if (!loadRelatedPapers) return;
    
    setIsLoadingRelated(true);
    try {
      const relatedWorks = await loadRelatedPapers();
      setRelatedPapers(relatedWorks || []);
      if (relatedWorks && relatedWorks.length > 0) {
        showInfo(`Found ${relatedWorks.length} related papers`);
      }
    } catch (error) {
      console.error('Error loading related papers:', error);
      showError('Failed to load related papers');
    } finally {
      setIsLoadingRelated(false);
    }
  };
  
  // Load related papers when modal opens
  useEffect(() => {
    if (loadRelatedPapers && paper.id) {
      fetchRelatedPapers();
    }
  }, [paper.id]);
  
  // Handle click outside format dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showFormatDropdown &&
        formatDropdownRef.current && 
        !formatDropdownRef.current.contains(event.target)
      ) {
        setShowFormatDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFormatDropdown]);
  
  // Position the format dropdown
  useEffect(() => {
    if (showFormatDropdown && formatDropdownRef.current) {
      const rect = formatDropdownRef.current.getBoundingClientRect();
      setFormatDropdownPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showFormatDropdown]);
  
  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Format citation based on selected format
  const formatCitation = (format) => {
    const { authors, title, journal, year, doi } = paper;
    let citation = '';
    
    switch (format) {
      case 'apa':
        citation = `${authors.join(', ')}. (${year}). ${title}. ${journal}. https://doi.org/${doi || '10.xxxx/xxxxx'}`;
        break;
      case 'mla':
        citation = `${authors.join(', ')}. "${title}." ${journal}, ${year}. Web.`;
        break;
      case 'chicago':
        citation = `${authors.join(', ')}. "${title}." ${journal} (${year}).`;
        break;
      case 'bibtex':
        citation = `@article{${authors[0].split(' ')[0].toLowerCase()}${year},
  title = {${title}},
  author = {${authors.join(' and ')}},
  journal = {${journal}},
  year = {${year}},
  doi = {${doi || '10.xxxx/xxxxx'}}
}`;
        break;
      default:
        citation = `${authors.join(', ')} (${year}). ${title}. ${journal}.`;
    }
    
    return citation;
  };
  
  // Copy citation to clipboard
  const copyCitation = () => {
    const citation = formatCitation(selectedFormat);
    navigator.clipboard.writeText(citation)
      .then(() => {
        // Show a toast notification
        showSuccess('Citation copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy citation:', err);
        showError('Failed to copy citation');
      });
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 50, 
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      } 
    }
  };

  const buttonVariants = {
    hover: { 
      y: -4, 
      boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { 
      y: 0, 
      boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
      transition: { duration: 0.1 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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

  const impactBarVariants = (i, citationImpact) => ({
    hidden: { scaleX: 0, transformOrigin: "left" },
    visible: { 
      scaleX: i < citationImpact ? 1 : 0.05,
      backgroundColor: i < citationImpact ? "#fe5d97" : "#f3f3f3",
      transition: { 
        delay: 0.3 + (i * 0.1), 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      } 
    }
  });

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        onClick={(e) => {
          // Close when clicking outside the modal
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="neo-container bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden relative"
          style={{ 
            transform: "rotate(-0.5deg)",
            border: "4px solid black",
            boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)"
          }}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pattern backgrounds */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute inset-0" style={{ 
              backgroundImage: "radial-gradient(circle at 10% 20%, rgba(0, 0, 0, 0.05) 4px, transparent 4px)",
              backgroundSize: "18px 18px"
            }} />
          </div>
          
          {/* Corner fold effect */}
          <div 
            className="absolute top-0 right-0 w-16 h-16 bg-white"
            style={{
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              filter: "drop-shadow(-3px 3px 2px rgba(0,0,0,0.2))"
            }}
          />
          
          {/* Close button on top-right corner */}
          <motion.button
            onClick={onClose}
            className="neo-button bg-white p-2 absolute z-50"
            style={{
              top: "16px",
              right: "16px",
              left: "auto",
              position: "absolute",
              border: "2px solid black",
              boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)"
            }}
            aria-label="Close modal"
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <CloseIcon />
          </motion.button>
          
          <div className="relative z-10 overflow-y-auto max-h-[80vh]">
            {/* Paper info header with colorful background */}
            <motion.div 
              className="p-6 pb-8 bg-[#F7F7F7] border-b-4 border-black relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.03) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.03) 50%, rgba(0, 0, 0, 0.03) 75%, transparent 75%, transparent)`,
                backgroundSize: "16px 16px"
              }}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Paper title and favorite button */}
              <div className="flex flex-col relative z-10 mt-2">
                <div className="flex items-start gap-4 mb-4">
                  <motion.h2 
                    className="text-3xl font-black tracking-tight leading-tight max-w-[80%]"
                    variants={itemVariants}
                  >
                    {searchQuery ? highlightText(paper.title, searchQuery) : paper.title}
                  </motion.h2>
                  <div className="flex gap-2 mt-1">
                    <motion.button 
                      onClick={() => {
                        onToggleFavorite(paper);
                        if (isFavorite) {
                          showInfo('Removed from favorites');
                        } else {
                          showSuccess('Added to favorites!');
                        }
                      }}
                      className={`p-2 neo-button ${isFavorite ? 'bg-[#fe5d97]' : 'bg-white'}`}
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      style={{ 
                        transform: "rotate(3deg)",
                        border: "2px solid black",
                        boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)"
                      }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <HeartIcon filled={isFavorite} />
                    </motion.button>
                    <motion.button 
                      onClick={() => {
                        onToggleReadingList(paper);
                        if (isInReadingList) {
                          showInfo('Removed from reading list');
                        } else {
                          showSuccess('Added to reading list!');
                        }
                      }}
                      className={`p-2 neo-button ${isInReadingList ? 'bg-[#4b91ff]' : 'bg-white'}`}
                      aria-label={isInReadingList ? "Remove from reading list" : "Add to reading list"}
                      style={{ 
                        transform: "rotate(-2deg)",
                        border: "2px solid black",
                        boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)"
                      }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <BookmarkIcon filled={isInReadingList} />
                    </motion.button>
                  </div>
                </div>
                
                <motion.div className="flex flex-wrap gap-3 mb-4" variants={itemVariants}>
                  <motion.span 
                    className="neo-badge" 
                    style={{ 
                      backgroundColor: randomColor,
                      border: "2px solid black",
                      boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {paper.journal}
                  </motion.span>
                  <motion.span 
                    className="neo-badge bg-white"
                    style={{
                      border: "2px solid black",
                      boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <YearIcon /> {paper.year}
                  </motion.span>
                  {isInReadingList && (
                    <motion.span 
                      className="neo-badge bg-[#4b91ff] text-white flex items-center gap-1"
                      style={{
                        border: "2px solid black",
                        boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <BookmarkIcon filled={true} />
                      Reading List
                    </motion.span>
                  )}
                </motion.div>
                
                <motion.div className="text-lg mb-4 p-3 bg-white/30 rounded border-2 border-black" variants={itemVariants}>
                  <span className="font-bold">Authors:</span> {searchQuery ? highlightText(paper.authors.join(', '), searchQuery) : paper.authors.join(', ')}
                </motion.div>
                
                <motion.div className="mb-6 text-lg leading-relaxed p-4 bg-white/40 rounded border-2 border-black" variants={itemVariants}>
                  {searchQuery ? highlightText(paper.abstract, searchQuery) : paper.abstract}
                </motion.div>
              </div>
              
              {/* Zigzag decorative pattern */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <svg viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  <path d="M0 0L10 6L20 0L30 6L40 0L50 6L60 0L70 6L80 0L90 6L100 0L110 6L120 0V12H0V0Z" fill={randomColor} />
                </svg>
              </motion.div>
            </motion.div>
            
            <div className="flex flex-col md:flex-row">
              {/* Left column */}
              <motion.div 
                className="p-6 md:w-7/12 md:border-r-4 md:border-black relative"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Citation Formats Section */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg uppercase tracking-wider">Cite This Paper</h3>
                    <motion.button 
                      onClick={() => setShowCitations(!showCitations)}
                      className="neo-button bg-white py-1 px-3 text-sm"
                      style={{
                        border: "2px solid black",
                        boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)"
                      }}
                      whileHover={{ y: -2, boxShadow: "4px 6px 0px 0px rgba(0,0,0,1)" }}
                      whileTap={{ y: 0, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                    >
                      {showCitations ? 'Hide' : 'Show Formats'}
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {showCitations && (
                      <motion.div 
                        className="mt-3 neo-container bg-[#F7F7F7] p-4"
                        style={{
                          border: "2px solid black",
                          boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)"
                        }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="relative">
                            <div className="relative" ref={formatDropdownRef}>
                              <motion.button
                                type="button"
                                onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                                className="neo-input py-2 px-4 pr-10 appearance-none bg-[#fed823] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0"
                                style={{ transform: "rotate(-1deg)" }}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                              >
                                {selectedFormat.toUpperCase()}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M6 9l6 6 6-6" />
                                  </svg>
                                </div>
                              </motion.button>
                              
                              <AnimatePresence>
                                {showFormatDropdown && (
                                  <motion.div 
                                    className="fixed z-[9999] bg-white border-2 border-black neo-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    style={{ 
                                      top: `${formatDropdownPosition.top}px`, 
                                      left: `${formatDropdownPosition.left}px`, 
                                      width: `${formatDropdownPosition.width}px` 
                                    }}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {formatOptions.map((format, idx) => (
                                      <motion.div 
                                        key={format} 
                                        className={`p-2 hover:bg-[#fed823] cursor-pointer ${format === selectedFormat ? 'bg-[#fe5d97] text-white' : ''}`}
                                        onClick={() => {
                                          setSelectedFormat(format);
                                          setShowFormatDropdown(false);
                                        }}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ 
                                          opacity: 1, 
                                          y: 0,
                                          transition: { delay: idx * 0.05 }
                                        }}
                                        whileHover={{ x: 3 }}
                                      >
                                        {format.toUpperCase()}
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <motion.button 
                            onClick={copyCitation}
                            className="neo-button bg-[#4b91ff] px-4 py-2 border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0"
                            style={{ transform: "rotate(1deg)" }}
                            whileHover={{ y: -3, rotate: 2 }}
                            whileTap={{ y: 0, rotate: 0 }}
                          >
                            Copy
                          </motion.button>
                        </div>
                        <motion.div 
                          className="bg-white p-3 border-2 border-black font-mono text-sm overflow-x-auto whitespace-pre-wrap neo-container"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {formatCitation(selectedFormat)}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
              
              {/* Right column - Stats and actions */}
              <motion.div 
                className="p-6 md:w-5/12 flex flex-col"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Citation impact visualizer */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <h3 className="font-black mb-3 text-lg uppercase tracking-wider">Citation Impact</h3>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        className="h-8 flex-1 border-2 border-black rounded-md"
                        style={{ transform: `rotate(${Math.random() * 3 - 1.5}deg)` }}
                        variants={impactBarVariants(i, citationImpact)}
                      ></motion.div>
                    ))}
                  </div>
                  <motion.div 
                    className="text-center font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {paper.citations} citations
                  </motion.div>
                </motion.div>
                
                {/* Publication details */}
                <motion.div 
                  className="mb-8 neo-container bg-[#F7F7F7] p-4"
                  variants={itemVariants}
                >
                  <h3 className="font-black mb-3 text-lg uppercase tracking-wider">Details</h3>
                  <div className="space-y-2">
                    <motion.div 
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="font-bold">Year:</span> 
                      <span>{paper.year}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="font-bold">Journal:</span> 
                      <span>{paper.journal}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="font-bold">Authors:</span> 
                      <span>{paper.authors.length}</span>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Action buttons */}
                <motion.div className="mt-auto space-y-2" variants={itemVariants}>
                  <motion.a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-button inline-flex w-full justify-center py-3"
                    style={{ backgroundColor: randomColor }}
                    onClick={() => showInfo('Opening paper in new tab')}
                    whileHover={{ y: -4, boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)" }}
                    whileTap={{ y: 0, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                  >
                    View Full Paper
                    <svg width="20" height="20" className="ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                  <motion.button
                    onClick={() => {
                      onToggleReadingList(paper);
                      if (isInReadingList) {
                        showInfo('Removed from reading list');
                      } else {
                        showSuccess('Added to reading list!');
                      }
                    }}
                    className={`neo-button inline-flex w-full justify-center py-3 ${isInReadingList ? 'bg-white text-black' : 'bg-[#4b91ff]'}`}
                    whileHover={{ y: -4, boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)" }}
                    whileTap={{ y: 0, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                  >
                    {isInReadingList ? 'Remove from Reading List' : 'Add to Reading List'}
                    <BookmarkIcon filled={isInReadingList} className="ml-2" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Paper Recommendations Section */}
            <AnimatePresence>
              {(relatedPapers.length > 0 || isLoadingRelated) && (
                <motion.div 
                  className="border-t-3 border-black bg-[#F7F7F7] p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <motion.h3 
                    className="font-black text-xl mb-4 flex items-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <span className="mr-2">📚</span> Related Papers
                  </motion.h3>
                  
                  {isLoadingRelated ? (
                    <motion.div 
                      className="neo-container bg-white p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="animate-pulse">Loading related papers...</div>
                    </motion.div>
                  ) : relatedPapers.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-1 gap-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {relatedPapers.map((relatedPaper, index) => (
                        <motion.div 
                          key={relatedPaper.id || index} 
                          className="neo-container bg-white p-4"
                          variants={itemVariants}
                          whileHover={{ y: -4, boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)" }}
                        >
                          <h4 className="font-black text-lg mb-2">{relatedPaper.title}</h4>
                          <p className="text-sm mb-2">
                            <span className="font-bold">Authors:</span> {relatedPaper.authors.join(', ')}
                          </p>
                          <p className="text-sm mb-3 line-clamp-2">{relatedPaper.abstract}</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              <motion.span 
                                className="neo-badge bg-[#F7F7F7] text-black"
                                whileHover={{ scale: 1.1 }}
                              >
                                <YearIcon /> {relatedPaper.year}
                              </motion.span>
                              <motion.span 
                                className="neo-badge bg-[#F7F7F7] text-black"
                                whileHover={{ scale: 1.1 }}
                              >
                                <CitationIcon /> {relatedPaper.citations}
                              </motion.span>
                            </div>
                            <motion.a
                              href={relatedPaper.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="neo-button bg-[#fed823] py-1 px-3 text-sm inline-flex items-center"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View
                              <ArrowIcon />
                            </motion.a>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="neo-container bg-white p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-center">No related papers found.</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaperModal;