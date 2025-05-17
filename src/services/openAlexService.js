/**
 * Service for interacting with the OpenAlex API
 * Documentation: https://docs.openalex.org/
 */

const API_BASE_URL = 'https://api.openalex.org';

// Simple in-memory cache for API responses
const cache = {
  searches: new Map(),
  works: new Map(),
  authors: new Map(),
  journals: new Map(),
  // Cache expiry time in milliseconds (10 minutes)
  expiryTime: 10 * 60 * 1000,
};

/**
 * Generate a cache key from request parameters
 */
const generateCacheKey = (endpoint, params) => {
  return `${endpoint}:${JSON.stringify(params)}`;
};

/**
 * Check if cache entry is valid
 */
const isCacheValid = (entry) => {
  return entry && Date.now() - entry.timestamp < cache.expiryTime;
};

/**
 * Make an API request with caching
 */
const makeApiRequest = async (endpoint, params = {}) => {
  const cacheKey = generateCacheKey(endpoint, params);
  const cacheStore = cache[endpoint.split('/')[0]] || cache.searches;
  
  // Check cache
  const cachedResponse = cacheStore.get(cacheKey);
  if (isCacheValid(cachedResponse)) {
    console.log(`Using cached response for ${cacheKey}`);
    return cachedResponse.data;
  }
  
  // Build query string
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  // Add polite pool identifier
  queryParams.append('mailto', 'user@example.com');
  
  // Make request
  const url = `${API_BASE_URL}/${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  console.log(`Fetching from OpenAlex API: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAlex API error: ${response.status} - ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    cacheStore.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Searches for works (papers) in OpenAlex
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query
 * @param {number} params.page - Page number (starts at 1)
 * @param {number} params.perPage - Results per page (default 25, max 200)
 * @param {string} params.filter - OpenAlex filter query
 * @returns {Promise<Object>} - Search results
 */
export const searchWorks = async ({
  query = '',
  page = 1,
  perPage = 25,
  filter = '',
  sort = 'cited_by_count:desc'
} = {}) => {
  try {
    const params = {
      search: query,
      page,
      'per-page': perPage,
      filter,
      sort,
    };
    
    return await makeApiRequest('works', params);
  } catch (error) {
    console.error('Error searching OpenAlex works:', error);
    throw new Error(`Failed to search papers: ${error.message}`);
  }
};

/**
 * Get details for a specific work by its OpenAlex ID
 * @param {string} id - OpenAlex ID
 * @returns {Promise<Object>} - Work details
 */
export const getWorkById = async (id) => {
  try {
    if (!id) throw new Error('Work ID is required');
    return await makeApiRequest(`works/${id}`);
  } catch (error) {
    console.error('Error fetching work details:', error);
    throw new Error(`Failed to fetch paper details: ${error.message}`);
  }
};

/**
 * Convert OpenAlex work to ScholarView paper format
 * @param {Object} work - OpenAlex work object
 * @returns {Object} - ScholarView paper object
 */
export const convertWorkToPaper = (work) => {
  if (!work) return null;
  
  // Safely access nested properties
  const getNestedProperty = (obj, path, defaultValue = '') => {
    const value = path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : undefined, obj);
    return value !== undefined ? value : defaultValue;
  };
  
  return {
    id: work.id || `paper-${Math.random().toString(36).substring(2, 9)}`,
    title: work.title || 'Untitled Paper',
    authors: work.authorships?.map(authorship => 
      getNestedProperty(authorship, 'author.display_name', 'Unknown Author')
    ) || ['Unknown Author'],
    abstract: work.abstract || 'No abstract available for this paper.',
    year: work.publication_year || new Date().getFullYear(),
    journal: getNestedProperty(work, 'primary_location.source.display_name', 'Unknown Journal'),
    citations: work.cited_by_count || 0,
    link: work.doi ? `https://doi.org/${work.doi}` : (work.open_access?.oa_url || '#'),
    doi: work.doi || '',
    concepts: work.concepts?.slice(0, 5).map(concept => ({
      name: concept.display_name,
      score: concept.score
    })) || [],
    openAccess: !!work.open_access?.is_oa,
    publishedDate: work.publication_date || null,
  };
};

/**
 * Get related works/papers for a given paper
 * @param {string} workId - OpenAlex ID of the paper
 * @param {number} limit - Maximum number of related papers to return
 * @returns {Promise<Array>} - Array of related papers in ScholarView format
 */
export const getRelatedWorks = async (workId, limit = 5) => {
  if (!workId) return [];
  
  try {
    // Get related works by using the "related_to" filter
    const response = await searchWorks({
      filter: `related_to:${workId}`,
      perPage: limit
    });
    
    if (!response || !response.results) {
      return [];
    }
    
    return response.results
      .filter(work => work !== null)
      .map(convertWorkToPaper)
      .filter(paper => paper !== null);
  } catch (error) {
    console.error('Error fetching related works:', error);
    return [];
  }
};

/**
 * Search for papers with filters
 * @param {Object} params - Search parameters
 * @returns {Promise<Object>} - Papers and metadata
 */
export const searchPapers = async ({
  query = '',
  page = 1,
  perPage = 25,
  yearFrom = null,
  yearTo = null,
  authorName = '',
  journalName = '',
  subject = '',
  sort = 'cited_by_count:desc',
  filter = ''
} = {}) => {
  try {
    let filters = [];
    
    // Add existing filter if provided
    if (filter) filters.push(filter);
    
    if (yearFrom && yearTo) {
      filters.push(`publication_year:${yearFrom}-${yearTo}`);
    } else if (yearFrom) {
      filters.push(`publication_year:>=${yearFrom}`);
    } else if (yearTo) {
      filters.push(`publication_year:<=${yearTo}`);
    }
    
    if (authorName) {
      filters.push(`author.display_name.search:${authorName}`);
    }
    
    if (journalName) {
      filters.push(`primary_location.source.display_name.search:${journalName}`);
    }
    
    if (subject) {
      filters.push(`concepts.display_name.search:${subject}`);
    }
    
    const filterString = filters.length > 0 ? filters.join(',') : '';
    
    const results = await searchWorks({
      query,
      page,
      perPage,
      filter: filterString,
      sort
    });
    
    const papers = results.results
      ?.map(convertWorkToPaper)
      .filter(paper => paper !== null) || [];
    
    return {
      papers,
      meta: {
        totalCount: results.meta?.count || 0,
        currentPage: page,
        totalPages: Math.ceil((results.meta?.count || 0) / perPage),
        perPage
      }
    };
  } catch (error) {
    console.error('Error searching papers:', error);
    throw new Error(`Failed to search papers: ${error.message}`);
  }
};

/**
 * Get popular authors for filtering options
 * @param {number} limit - Maximum number of authors to return
 * @returns {Promise<Array<string>>} - Array of author names
 */
export const getPopularAuthors = async (limit = 20) => {
  try {
    const cacheKey = `popular-authors:${limit}`;
    const cachedAuthors = cache.authors.get(cacheKey);
    
    if (isCacheValid(cachedAuthors)) {
      return cachedAuthors.data;
    }
    
    const response = await makeApiRequest('authors', {
      'per-page': limit,
      sort: 'works_count:desc'
    });
    
    if (!response || !response.results) {
      return [];
    }
    
    const authors = response.results
      .map(author => author.display_name)
      .filter(name => !!name);
    
    cache.authors.set(cacheKey, {
      data: authors,
      timestamp: Date.now()
    });
    
    return authors;
  } catch (error) {
    console.error('Error fetching popular authors:', error);
    return [];
  }
};

/**
 * Get popular journals for filtering options
 * @param {number} limit - Maximum number of journals to return
 * @returns {Promise<Array<string>>} - Array of journal names
 */
export const getPopularJournals = async (limit = 20) => {
  try {
    const cacheKey = `popular-journals:${limit}`;
    const cachedJournals = cache.journals.get(cacheKey);
    
    if (isCacheValid(cachedJournals)) {
      return cachedJournals.data;
    }
    
    const response = await makeApiRequest('sources', {
      'per-page': limit,
      sort: 'works_count:desc',
      filter: 'type:journal'
    });
    
    if (!response || !response.results) {
      return [];
    }
    
    const journals = response.results
      .map(journal => journal.display_name)
      .filter(name => !!name);
    
    cache.journals.set(cacheKey, {
      data: journals,
      timestamp: Date.now()
    });
    
    return journals;
  } catch (error) {
    console.error('Error fetching popular journals:', error);
    return [];
  }
};

/**
 * Clear the API cache
 */
export const clearCache = () => {
  cache.searches.clear();
  cache.works.clear();
  cache.authors.clear();
  cache.journals.clear();
}; 