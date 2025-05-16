import React from 'react';
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
  
  // Slight rotation for visual interest
  const rotation = index % 2 === 0 ? '1deg' : '-1deg';

  return (
    <div
      className="neo-card wiggle"
      style={{ 
        "--card-background": cardBackground,
        transform: `rotate(${rotation})`
      }}
    >
      <div className="p-6">
        <div className="flex flex-wrap justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <h2 
              className="text-xl font-black tracking-tight cursor-pointer hover:underline"
              onClick={() => openDetails(paper)}
            >
              {searchQuery ? highlightText(paper.title, searchQuery) : paper.title}
            </h2>
            <div className="flex gap-1">
              <button 
                onClick={() => toggleFavorite(paper)}
                className={`p-1 rounded-full hover:bg-white/30 transition-colors ${isFavorite ? 'text-red-600' : 'text-gray-700'}`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <HeartIcon filled={isFavorite} />
              </button>
              <button 
                onClick={() => toggleReadingList(paper)}
                className={`p-1 rounded-full hover:bg-white/30 transition-colors ${isInReadingList ? 'text-blue-600' : 'text-gray-700'}`}
                aria-label={isInReadingList ? "Remove from reading list" : "Add to reading list"}
                title={isInReadingList ? "Remove from reading list" : "Add to reading list"}
              >
                <BookmarkIcon filled={isInReadingList} />
              </button>
            </div>
          </div>
          <span className="neo-badge font-bold tracking-tight">{paper.journal}</span>
        </div>

        <div className="mb-3">
          <span className="font-bold">Authors:</span> {searchQuery ? highlightText(paper.authors.join(', '), searchQuery) : paper.authors.join(', ')}
        </div>

        <div className="mb-4 text-sm leading-relaxed font-medium">
          {searchQuery ? highlightText(paper.abstract, searchQuery) : paper.abstract}
        </div>

        <div className="flex flex-wrap items-center justify-between mt-4">
          <div className="flex gap-3">
            <span className="neo-badge bg-white text-black">
              <YearIcon /> {paper.year}
            </span>
            <span className="neo-badge bg-white text-black">
              <CitationIcon /> {paper.citations} citations
            </span>
            {isInReadingList && (
              <span className="neo-badge bg-[#4b91ff] text-white flex items-center gap-1">
                <BookmarkIcon filled={true} />
                Reading List
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openDetails(paper)}
              className="neo-button bg-white text-black border-black"
            >
              View Details
            </button>
            <a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button"
            >
              View Paper
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperCard; 