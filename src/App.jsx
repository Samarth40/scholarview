import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import papersData from './papers.json'
import { searchPapers, getRelatedWorks, getPopularAuthors, getPopularJournals } from './services/openAlexService'
import useLocalStorage from './hooks/useLocalStorage'

// Import components
import SearchBar from './components/SearchBar'
import PaperCard from './components/PaperCard'
import PaperModal from './components/PaperModal'
import FilterSection from './components/FilterSection'
import NoResults from './components/NoResults'
import { TabBar, SortingDropdown, FiltersToggle, StatsBar } from './components/TabsAndFilters'
import { Header, Hero, Footer, BackgroundDecorations } from './components/Layout'

const TABS = [
  { key: 'all', label: 'All Papers' },
  { key: 'mostCited', label: 'Most Cited' },
  { key: 'recent', label: 'Recent Publications' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'readingList', label: 'Reading List' },
]

const SORT_OPTIONS = [
  { value: 'cited_by_count:desc', label: 'Most Cited' },
  { value: 'publication_date:desc', label: 'Recent First' },
  { value: 'display_name', label: 'Title A-Z' },
  { value: 'relevance_score:desc', label: 'Relevance' },
]

// Example subjects - in a real app, these would be extracted from the paper data
const SUBJECTS = ['Computer Science', 'Machine Learning', 'AI Research', 'Computer Vision', 'NLP']

const EXAMPLE_QUERIES = [
  'Machine learning algorithms',
  'Neural networks in vision',
  'Natural language processing',
]

// Simple icons for stat badges
const YearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const CitationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18" />
    <path d="M8 9h8" />
    <path d="M8 15h8" />
  </svg>
)

// Favorite icon
const HeartIcon = ({ filled }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

// Doodle elements for neobrutalism
const Doodle = ({ type, className }) => {
  const doodles = {
    zigzag: (
      <svg width="82" height="17" viewBox="0 0 82 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M1 8.5L9.5 1L18 8.5L26.5 1L35 8.5L43.5 1L52 8.5L60.5 1L69 8.5L77.5 1L81 4.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    stars: (
      <svg width="90" height="40" viewBox="0 0 90 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 8L14.5 13.5L20.5 14.5L16 18.5L17.5 24.5L12 21.5L6.5 24.5L8 18.5L3.5 14.5L9.5 13.5L12 8Z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M46 24L48.5 29.5L54.5 30.5L50 34.5L51.5 40.5L46 37.5L40.5 40.5L42 34.5L37.5 30.5L43.5 29.5L46 24Z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M78 4L80.5 9.5L86.5 10.5L82 14.5L83.5 20.5L78 17.5L72.5 20.5L74 14.5L69.5 10.5L75.5 9.5L78 4Z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    arrow: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M24 4V44M24 4L12 16M24 4L36 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    circles: (
      <svg width="72" height="24" viewBox="0 0 72 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="11" stroke="black" strokeWidth="2"/>
        <circle cx="36" cy="12" r="11" stroke="black" strokeWidth="2"/>
        <circle cx="60" cy="12" r="11" stroke="black" strokeWidth="2"/>
      </svg>
    )
  };
  
  return doodles[type] || null;
};

// ScrollToTopButton component
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      onClick={scrollUp}
      className="fixed bottom-8 right-8 neo-button bg-[#4b91ff] p-3 z-50 text-white"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.5,
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)" }}
      whileTap={{ y: 0, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </motion.button>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [papers, setPapers] = useState([])
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useLocalStorage('scholarview-favorites', [])
  const [readingList, setReadingList] = useLocalStorage('scholarview-reading-list', [])
  const [filters, setFilters] = useState({
    subject: '',
    year: '',
    author: '',
    journal: '',
  })
  const [sortBy, setSortBy] = useState('cited_by_count:desc')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 12
  });
  
  // State for filter options
  const [filterOptions, setFilterOptions] = useState({
    authors: [],
    journals: [],
    isLoading: false
  });

  // Extract unique values for filter options
  const years = [...Array(30)].map((_, i) => new Date().getFullYear() - i);

  // Ref for the search bar section
  const searchBarRef = useRef(null);

  // Function to scroll to the search bar
  const scrollToSearchBar = () => {
    if (searchBarRef.current) {
      searchBarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Load initial papers and filter options
  useEffect(() => {
    fetchPapers();
    fetchFilterOptions();
  }, []);

  // Fetch papers when search query, filters or page changes
  useEffect(() => {
    if (activeTab !== 'favorites' && activeTab !== 'readingList') {
      fetchPapers();
    }
  }, [searchQuery, filters, pagination.currentPage, sortBy, activeTab]);

  // Function to fetch authors and journals for filters
  const fetchFilterOptions = async () => {
    setFilterOptions(prev => ({ ...prev, isLoading: true }));
    try {
      // Fetch in parallel
      const [authors, journals] = await Promise.all([
        getPopularAuthors(30),
        getPopularJournals(30)
      ]);
      
      setFilterOptions({
        authors,
        journals,
        isLoading: false
      });
    } catch (err) {
      console.error('Error fetching filter options:', err);
      setFilterOptions(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Function to fetch papers from OpenAlex API
  const fetchPapers = async () => {
    if (activeTab === 'favorites' || activeTab === 'readingList') {
      return; // Don't fetch for these tabs as they use local data
    }

    setIsLoading(true);
    setError(null);

    try {
      let yearFrom = null;
      let yearTo = null;

      if (filters.year) {
        yearFrom = parseInt(filters.year);
        yearTo = parseInt(filters.year);
      }

      // Build search parameters based on active tab
      const params = {
        query: searchQuery,
        page: pagination.currentPage,
        perPage: pagination.perPage,
        yearFrom,
        yearTo,
        authorName: filters.author,
        journalName: filters.journal,
        subject: filters.subject,
        sort: sortBy
      };

      // Add tab-specific filters
      if (activeTab === 'mostCited') {
        params.sort = 'cited_by_count:desc';
        params.filter = 'cited_by_count:>100';
      } else if (activeTab === 'recent') {
        params.sort = 'publication_date:desc';
        const currentYear = new Date().getFullYear();
        params.yearFrom = currentYear - 2; // Last 2 years
        params.yearTo = currentYear;
      }

      const result = await searchPapers(params);
      setPapers(result.papers);
      setPagination({
        currentPage: result.meta.currentPage,
        totalPages: result.meta.totalPages,
        totalCount: result.meta.totalCount,
        perPage: result.meta.perPage
      });
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to fetch papers. Please try again later.');
      setPapers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle toggling favorites
  const toggleFavorite = (paper) => {
    setFavorites(prevFavorites => {
      // Check if paper is already in favorites by title or id
      const isFavorite = prevFavorites.some(fav => 
        fav.id === paper.id || fav.title === paper.title
      );
      
      if (isFavorite) {
        // Remove from favorites
        return prevFavorites.filter(fav => 
          !(fav.id === paper.id || fav.title === paper.title)
        );
      } else {
        // Add to favorites
        return [...prevFavorites, paper];
      }
    });
  }

  // Handle toggling reading list
  const toggleReadingList = (paper) => {
    setReadingList(prevList => {
      // Check if paper is already in reading list by title or id
      const isInReadingList = prevList.some(item => 
        item.id === paper.id || item.title === paper.title
      );
      
      if (isInReadingList) {
        // Remove from reading list
        return prevList.filter(item => 
          !(item.id === paper.id || item.title === paper.title)
        );
      } else {
        // Add to reading list
        return [...prevList, paper];
      }
    });
  }

  // Filter papers based on all criteria for favorites and reading list
  let displayedPapers = [...papers];
  
  // Show favorites or reading list
  if (activeTab === 'favorites') {
    displayedPapers = favorites;
    
    // Apply search
    if (searchQuery.trim()) {
      displayedPapers = displayedPapers.filter(paper =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.join(', ').toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.year) {
      displayedPapers = displayedPapers.filter(paper => paper.year === parseInt(filters.year));
    }
    if (filters.author) {
      displayedPapers = displayedPapers.filter(paper => 
        paper.authors.some(author => author.toLowerCase().includes(filters.author.toLowerCase())));
    }
    if (filters.journal) {
      displayedPapers = displayedPapers.filter(paper => 
        paper.journal?.toLowerCase().includes(filters.journal.toLowerCase()));
    }
  } else if (activeTab === 'readingList') {
    displayedPapers = readingList;
    
    // Apply search and filters same as favorites
    if (searchQuery.trim()) {
      displayedPapers = displayedPapers.filter(paper =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.join(', ').toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.year) {
      displayedPapers = displayedPapers.filter(paper => paper.year === parseInt(filters.year));
    }
    if (filters.author) {
      displayedPapers = displayedPapers.filter(paper => 
        paper.authors.some(author => author.toLowerCase().includes(filters.author.toLowerCase())));
    }
    if (filters.journal) {
      displayedPapers = displayedPapers.filter(paper => 
        paper.journal?.toLowerCase().includes(filters.journal.toLowerCase()));
    }
  }
  
  // Sort local collections (favorites, reading list)
  if ((activeTab === 'favorites' || activeTab === 'readingList') && displayedPapers.length > 0) {
    if (sortBy === 'cited_by_count:desc') {
      displayedPapers.sort((a, b) => b.citations - a.citations);
    } else if (sortBy === 'publication_date:desc') {
      displayedPapers.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'display_name') {
      displayedPapers.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    scrollToSearchBar();
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page on new search
    }));
    scrollToSearchBar();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
    scrollToSearchBar();
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      year: '',
      author: '',
      journal: '',
    });
    setSearchQuery('');
    setQuery('');
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    scrollToSearchBar();
  };

  return (
    <div className="min-h-screen p-0 bg-[#FCFCFC] relative overflow-hidden -mt-4 md:-mt-8">
      {/* Scroll to top button */}
      <ScrollToTopButton />
      
      {/* Background decorations */}
      <BackgroundDecorations />
      
      {/* Header and Hero section - full width */}
      <div className="w-full py-0 pt-0 relative">
        {/* Header with logo and sign in */}
        <Header />

        {/* Main hero content - full width */}
        <Hero />
      </div>

      {/* Search bar in its own section */}
      <div className="w-full bg-[#f8f9fa] py-8 shadow-md relative z-20 border-y-4 border-black">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#fe5d97]"></div>
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-[#4b91ff]"></div>
          <div className="absolute bottom-10 left-1/2 w-30 h-30 rounded-full bg-[#fed823]"></div>
        </div>
        <div className="max-w-5xl mx-auto px-6 md:px-10 relative" ref={searchBarRef}>
          <h2 className="text-2xl font-bold mb-4 text-center">Search Academic Papers</h2>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        {/* Navigation tabs, sorting, and filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-3 sm:gap-4">
          <TabBar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setPagination(prev => ({
                ...prev,
                currentPage: 1 // Reset to first page when changing tabs
              }));
              scrollToSearchBar();
            }}
            favorites={favorites}
            readingList={readingList}
          />
          <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto justify-center sm:justify-end">
            <SortingDropdown 
              sortBy={sortBy} 
              setSortBy={(sort) => {
                setSortBy(sort);
                setPagination(prev => ({
                  ...prev,
                  currentPage: 1
                }));
                scrollToSearchBar();
              }} 
            />
            <FiltersToggle showFilters={showFilters} setShowFilters={setShowFilters} />
          </div>
        </div>

        {/* Filters section */}
        <FilterSection 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
          clearFilters={clearFilters} 
          years={years} 
          authors={filterOptions.authors} 
          journals={filterOptions.journals} 
          showFilters={showFilters}
          isLoadingOptions={filterOptions.isLoading}
        />

        {/* Stats bar */}
        <StatsBar displayedPapers={displayedPapers} activeTab={activeTab} />

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="neo-container bg-white p-4 inline-block">
              <div className="animate-pulse flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading papers...
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="neo-container bg-[#fe5d97] text-white p-4 mb-6">
            <p className="font-bold">{error}</p>
            <button 
              onClick={fetchPapers} 
              className="neo-button bg-white text-black mt-2"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Papers grid */}
        {!isLoading && !error && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-8 md:mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayedPapers.length > 0 ? (
              displayedPapers.map((paper, idx) => (
                <PaperCard 
                  key={paper.id || idx}
                  paper={paper}
                  index={idx}
                  isFavorite={favorites.some(fav => fav.id === paper.id || fav.title === paper.title)}
                  isInReadingList={readingList.some(item => item.id === paper.id || item.title === paper.title)}
                  toggleFavorite={toggleFavorite}
                  toggleReadingList={toggleReadingList}
                  openDetails={setSelectedPaper}
                  searchQuery={searchQuery}
                />
              ))
            ) : (
              <NoResults 
                activeTab={activeTab} 
                clearFilters={clearFilters} 
                searchQuery={searchQuery}
              />
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && !error && activeTab !== 'favorites' && activeTab !== 'readingList' && displayedPapers.length > 0 && pagination.totalPages > 1 && (
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-2 mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`neo-button py-1 px-3 md:py-2 md:px-4 text-sm md:text-base ${pagination.currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
              whileHover={pagination.currentPage !== 1 ? { 
                y: -4, 
                boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)" 
              } : {}}
              whileTap={pagination.currentPage !== 1 ? { 
                y: 0, 
                boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" 
              } : {}}
            >
              Previous
            </motion.button>
            
            <div className="flex items-center">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                // Logic to determine which page numbers to show around current page
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = idx + 1;
                  if (idx === 4) pageNum = pagination.totalPages;
                  if (idx === 3 && pagination.totalPages > 5) pageNum = '...';
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + idx;
                  if (idx === 0) pageNum = 1;
                  if (idx === 1 && pagination.totalPages > 5) pageNum = '...';
                } else {
                  if (idx === 0) pageNum = 1;
                  else if (idx === 1) pageNum = '...';
                  else if (idx === 3) pageNum = '...';
                  else if (idx === 4) pageNum = pagination.totalPages;
                  else pageNum = pagination.currentPage;
                }

                // Don't render ellipsis as buttons
                if (pageNum === '...') {
                  return <span key={`ellipsis-${idx}`} className="mx-1">...</span>;
                }
                
                return (
                  <motion.button
                    key={`page-${pageNum}`}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xs md:text-sm font-bold mx-1 ${pagination.currentPage === pageNum ? 'bg-[#fe5d97] text-white neo-container' : 'bg-white neo-container'}`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>

            <motion.button 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`neo-button py-1 px-3 md:py-2 md:px-4 text-sm md:text-base ${pagination.currentPage === pagination.totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
              whileHover={pagination.currentPage !== pagination.totalPages ? { 
                y: -4, 
                boxShadow: "6px 10px 0px 0px rgba(0,0,0,1)" 
              } : {}}
              whileTap={pagination.currentPage !== pagination.totalPages ? { 
                y: 0, 
                boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" 
              } : {}}
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Paper Details Modal */}
      {selectedPaper && (
        <PaperModal 
          paper={selectedPaper} 
          onClose={() => setSelectedPaper(null)}
          onToggleFavorite={toggleFavorite}
          onToggleReadingList={toggleReadingList}
          isFavorite={favorites.some(fav => fav.id === selectedPaper.id || fav.title === selectedPaper.title)}
          isInReadingList={readingList.some(item => item.id === selectedPaper.id || item.title === selectedPaper.title)}
          searchQuery={searchQuery}
          loadRelatedPapers={() => getRelatedWorks(selectedPaper.id, 3)}
        />
      )}
    </div>
  )
}

export default App
