import React, { useState, useEffect, useRef } from 'react';
import { YearIcon, CitationIcon, HeartIcon, CloseIcon, ArrowIcon } from './icons';
import PaperCard from './PaperCard';
import { highlightText } from '../utils/highlightText.jsx';
import { getRelatedWorks } from '../services/openAlexService';

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
  searchQuery = ''
}) => {
  if (!paper) return null;
  
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
  const [recommendedPapers, setRecommendedPapers] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const formatDropdownRef = useRef(null);
  
  // Format options for citations
  const formatOptions = ['apa', 'mla', 'chicago', 'bibtex'];
  
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
    navigator.clipboard.writeText(citation);
    alert('Citation copied to clipboard');
  };
  
  // Find recommended papers from OpenAlex
  useEffect(() => {
    const fetchRelatedPapers = async () => {
      if (!paper || !paper.id) {
        setRecommendedPapers([]);
        return;
      }
      
      setIsLoadingRecommendations(true);
      
      try {
        const relatedWorks = await getRelatedWorks(paper.id, 3);
        setRecommendedPapers(relatedWorks);
      } catch (error) {
        console.error('Error fetching related papers:', error);
        setRecommendedPapers([]);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };
    
    fetchRelatedPapers();
  }, [paper]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="modal-close fixed top-4 right-4 z-50">
        <button 
          onClick={onClose}
          className="neo-button bg-white p-2"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
      </div>
      
      <div 
        className="neo-container bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden"
        style={{ transform: "rotate(-0.5deg)" }}
      >
        <div className="relative z-10 overflow-y-auto max-h-[80vh]">
          {/* Paper info header with colorful background */}
          <div className="p-6 pb-8 bg-[#F7F7F7] border-b-3 border-black relative overflow-hidden">
            {/* Paper title and favorite button */}
            <div className="flex flex-col relative z-10 mt-2">
              <div className="flex items-start gap-4 mb-4">
                <h2 className="text-3xl font-black tracking-tight leading-tight max-w-[80%]">
                  {searchQuery ? highlightText(paper.title, searchQuery) : paper.title}
                </h2>
                <div className="flex gap-2 mt-1">
                  <button 
                    onClick={() => onToggleFavorite(paper)}
                    className={`p-2 neo-button ${isFavorite ? 'bg-[#fe5d97]' : 'bg-white'}`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    style={{ transform: "rotate(3deg)" }}
                  >
                    <HeartIcon filled={isFavorite} />
                  </button>
                  <button 
                    onClick={() => onToggleReadingList(paper)}
                    className={`p-2 neo-button ${isInReadingList ? 'bg-[#4b91ff]' : 'bg-white'}`}
                    aria-label={isInReadingList ? "Remove from reading list" : "Add to reading list"}
                    style={{ transform: "rotate(-2deg)" }}
                  >
                    <BookmarkIcon filled={isInReadingList} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="neo-badge" style={{ backgroundColor: randomColor }}>{paper.journal}</span>
                <span className="neo-badge bg-white">
                  <YearIcon /> {paper.year}
                </span>
                {isInReadingList && (
                  <span className="neo-badge bg-[#4b91ff] text-white flex items-center gap-1">
                    <BookmarkIcon filled={true} />
                    Reading List
                  </span>
                )}
              </div>
              
              <div className="text-lg mb-4">
                <span className="font-bold">Authors:</span> {searchQuery ? highlightText(paper.authors.join(', '), searchQuery) : paper.authors.join(', ')}
              </div>
              
              <div className="mb-6 text-lg leading-relaxed">
                {searchQuery ? highlightText(paper.abstract, searchQuery) : paper.abstract}
              </div>
            </div>
            
            {/* Zigzag decorative pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden">
              <svg viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path d="M0 0L10 6L20 0L30 6L40 0L50 6L60 0L70 6L80 0L90 6L100 0L110 6L120 0V12H0V0Z" fill={randomColor} />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Left column */}
            <div className="p-6 md:w-7/12 md:border-r-3 md:border-black relative">
              {/* Citation Formats Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg uppercase tracking-wider">Cite This Paper</h3>
                  <button 
                    onClick={() => setShowCitations(!showCitations)}
                    className="neo-button bg-white py-1 px-3 text-sm"
                  >
                    {showCitations ? 'Hide' : 'Show Formats'}
                  </button>
                </div>
                
                {showCitations && (
                  <div className="mt-3 neo-container bg-[#F7F7F7] p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="relative">
                        <div className="relative" ref={formatDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                            className="neo-input py-2 px-4 pr-10 appearance-none bg-[#fed823] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0"
                            style={{ transform: "rotate(-1deg)" }}
                          >
                            {selectedFormat.toUpperCase()}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </div>
                          </button>
                          
                          {showFormatDropdown && (
                            <div 
                              className="fixed z-[9999] bg-white border-2 border-black neo-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                              style={{ 
                                top: `${formatDropdownPosition.top}px`, 
                                left: `${formatDropdownPosition.left}px`, 
                                width: `${formatDropdownPosition.width}px` 
                              }}
                            >
                              {formatOptions.map(format => (
                                <div 
                                  key={format} 
                                  className={`p-2 hover:bg-[#fed823] cursor-pointer ${format === selectedFormat ? 'bg-[#fe5d97] text-white' : ''}`}
                                  onClick={() => {
                                    setSelectedFormat(format);
                                    setShowFormatDropdown(false);
                                  }}
                                >
                                  {format.toUpperCase()}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={copyCitation}
                        className="neo-button bg-[#4b91ff] px-4 py-2 border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all transform hover:-translate-y-1 active:translate-y-0"
                        style={{ transform: "rotate(1deg)" }}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="bg-white p-3 border-2 border-black font-mono text-sm overflow-x-auto whitespace-pre-wrap neo-container">
                      {formatCitation(selectedFormat)}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - Stats and actions */}
            <div className="p-6 md:w-5/12 flex flex-col">
              {/* Citation impact visualizer */}
              <div className="mb-6">
                <h3 className="font-black mb-3 text-lg uppercase tracking-wider">Citation Impact</h3>
                <div className="flex items-center justify-between gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-8 flex-1 border-2 border-black rounded-md ${i < citationImpact ? 'bg-[#fe5d97]' : 'bg-gray-100'}`}
                      style={{ transform: `rotate(${Math.random() * 3 - 1.5}deg)` }}
                    ></div>
                  ))}
                </div>
                <div className="text-center font-bold">
                  {paper.citations} citations
                </div>
              </div>
              
              {/* Publication details */}
              <div className="mb-8 neo-container bg-[#F7F7F7] p-4">
                <h3 className="font-black mb-3 text-lg uppercase tracking-wider">Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Year:</span> 
                    <span>{paper.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Journal:</span> 
                    <span>{paper.journal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Authors:</span> 
                    <span>{paper.authors.length}</span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-auto space-y-2">
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-button inline-flex w-full justify-center py-3"
                  style={{ backgroundColor: randomColor }}
                >
                  View Full Paper
                  <svg width="20" height="20" className="ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <button
                  onClick={() => onToggleReadingList(paper)}
                  className={`neo-button inline-flex w-full justify-center py-3 ${isInReadingList ? 'bg-white text-black' : 'bg-[#4b91ff]'}`}
                >
                  {isInReadingList ? 'Remove from Reading List' : 'Add to Reading List'}
                  <BookmarkIcon filled={isInReadingList} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Paper Recommendations Section */}
          {(recommendedPapers.length > 0 || isLoadingRecommendations) && (
            <div className="border-t-3 border-black bg-[#F7F7F7] p-6">
              <h3 className="font-black text-xl mb-4 flex items-center">
                <span className="mr-2">📚</span> Recommended Papers
              </h3>
              
              {isLoadingRecommendations ? (
                <div className="neo-container bg-white p-4">
                  <div className="animate-pulse">Loading recommendations...</div>
                </div>
              ) : recommendedPapers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {recommendedPapers.map((recPaper, index) => (
                    <div key={recPaper.id || index} className="neo-container bg-white p-4">
                      <h4 className="font-black text-lg mb-2">{recPaper.title}</h4>
                      <p className="text-sm mb-2">
                        <span className="font-bold">Authors:</span> {recPaper.authors.join(', ')}
                      </p>
                      <p className="text-sm mb-3 line-clamp-2">{recPaper.abstract}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <span className="neo-badge bg-[#F7F7F7] text-black">
                            <YearIcon /> {recPaper.year}
                          </span>
                          <span className="neo-badge bg-[#F7F7F7] text-black">
                            <CitationIcon /> {recPaper.citations}
                          </span>
                        </div>
                        <a
                          href={recPaper.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neo-button bg-[#fed823] py-1 px-3 text-sm inline-flex items-center"
                        >
                          View
                          <ArrowIcon />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="neo-container bg-white p-4">
                  <p className="text-center">No related papers found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperModal;