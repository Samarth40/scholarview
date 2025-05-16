/**
 * Service for interacting with the OpenAlex API
 * Documentation: https://docs.openalex.org/
 */

const API_BASE_URL = 'https://api.openalex.org';

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
    const queryParams = new URLSearchParams();
    
    if (query) {
      queryParams.append('search', query);
    }
    
    queryParams.append('page', page);
    queryParams.append('per-page', perPage);
    
    if (filter) {
      queryParams.append('filter', filter);
    }
    
    if (sort) {
      queryParams.append('sort', sort);
    }
    
    // Add your email for polite usage
    queryParams.append('mailto', 'user@example.com');
    
    const response = await fetch(`${API_BASE_URL}/works?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching OpenAlex works:', error);
    throw error;
  }
};

/**
 * Get details for a specific work by its OpenAlex ID
 * @param {string} id - OpenAlex ID
 * @returns {Promise<Object>} - Work details
 */
export const getWorkById = async (id) => {
  try {
    // Add your email for polite usage
    const response = await fetch(`${API_BASE_URL}/works/${id}?mailto=user@example.com`);
    
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching work details:', error);
    throw error;
  }
};

/**
 * Convert OpenAlex work to ScholarView paper format
 * @param {Object} work - OpenAlex work object
 * @returns {Object} - ScholarView paper object
 */
export const convertWorkToPaper = (work) => {
  // Safely access nested properties
  const getNestedProperty = (obj, path, defaultValue = '') => {
    const value = path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : undefined, obj);
    return value !== undefined ? value : defaultValue;
  };
  
  return {
    id: work.id,
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
  };
};

/**
 * Get related works/papers for a given paper
 * @param {string} workId - OpenAlex ID of the paper
 * @param {number} limit - Maximum number of related papers to return
 * @returns {Promise<Array>} - Array of related papers in ScholarView format
 */
export const getRelatedWorks = async (workId, limit = 5) => {
  try {
    // Get related works by using the "related_to" filter
    const response = await searchWorks({
      filter: `related_to:${workId}`,
      perPage: limit
    });
    
    if (!response || !response.results) {
      return [];
    }
    
    return response.results.map(convertWorkToPaper);
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
  sort = 'cited_by_count:desc'
} = {}) => {
  try {
    let filters = [];
    
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
    
    const filterString = filters.length > 0 ? filters.join(',') : '';
    
    const results = await searchWorks({
      query,
      page,
      perPage,
      filter: filterString,
      sort
    });
    
    return {
      papers: results.results?.map(convertWorkToPaper) || [],
      meta: {
        totalCount: results.meta?.count || 0,
        currentPage: page,
        totalPages: Math.ceil((results.meta?.count || 0) / perPage),
        perPage
      }
    };
  } catch (error) {
    console.error('Error searching papers:', error);
    throw error;
  }
}; 