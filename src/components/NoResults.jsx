import React from 'react';

/**
 * Component displayed when no papers match the current search/filter criteria
 */
const NoResults = ({ activeTab, clearFilters, searchQuery }) => {
  return (
    <div className="lg:col-span-2 neo-container bg-white p-10 text-center">
      <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-indigo-50 mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </div>
      <h3 className="text-xl font-black mb-2">No papers found</h3>
      <p className="mb-4">
        {activeTab === 'favorites' 
          ? "You haven't saved any favorites yet. Find interesting papers and click the heart icon to save them."
          : activeTab === 'readingList'
          ? "Your reading list is empty. Add papers to your reading list by clicking the bookmark icon."
          : searchQuery
          ? `No papers match your search for "${searchQuery}". Try a different search term or clear the filters.`
          : "No papers match your current filter criteria."}
      </p>
      <button
        className="neo-button"
        onClick={clearFilters}
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default NoResults; 