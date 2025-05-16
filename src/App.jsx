import React, { useState, useEffect } from 'react'
import papersData from './papers.json'
import { searchPapers, getRelatedWorks } from './services/openAlexService'
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
  { value: 'citations', label: 'Most Cited' },
  { value: 'year', label: 'Recent First' },
  { value: 'title', label: 'Title A-Z' },
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
    perPage: 25
  });

  // Extract unique values for filter options
  const years = [...Array(30)].map((_, i) => new Date().getFullYear() - i);
  const journals = []; // Will be populated from API results
  const authors = []; // Will be populated from API results

  // Load initial papers
  useEffect(() => {
    fetchPapers();
  }, []);

  // Fetch papers when search query, filters or page changes
  useEffect(() => {
    if (activeTab !== 'favorites' && activeTab !== 'readingList') {
      fetchPapers();
    }
  }, [searchQuery, filters, pagination.currentPage, sortBy, activeTab]);

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
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page on new search
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
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
  };

  return (
    <div className="min-h-screen p-4 md:p-8 xl:px-16 xl:py-12 bg-[#FCFCFC] relative overflow-hidden">
      {/* Background decorations */}
      <BackgroundDecorations />
      
      <div className="w-full py-8 px-6 md:px-10 relative">
        {/* Header with logo and sign in */}
        <Header />

        {/* Main hero content */}
        <Hero />

        {/* Search functionality */}
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Main content area */}
      <div className="max-w-6xl mx-auto mt-8">
        {/* Navigation tabs, sorting, and filters */}
        <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
          <TabBar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setPagination(prev => ({
                ...prev,
                currentPage: 1 // Reset to first page when changing tabs
              }));
            }}
            favorites={favorites}
            readingList={readingList}
          />
          <div className="flex space-x-3">
            <SortingDropdown 
              sortBy={sortBy} 
              setSortBy={(sort) => {
                setSortBy(sort);
                setPagination(prev => ({
                  ...prev,
                  currentPage: 1
                }));
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
          authors={authors} 
          journals={journals} 
          showFilters={showFilters}
        />

        {/* Stats bar */}
        <StatsBar displayedPapers={displayedPapers} activeTab={activeTab} />

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="neo-container bg-white p-4 inline-block">
              <div className="animate-pulse">Loading papers...</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
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
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-16">
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`neo-button ${pagination.currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
            >
              Previous
            </button>
            <div className="neo-container bg-white px-4 py-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`neo-button ${pagination.currentPage === pagination.totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
            >
              Next
            </button>
          </div>
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
        />
      )}
    </div>
  )
}

export default App
