// Search service for filtering mock data
export class SearchService {
  constructor(mockData) {
    this.data = mockData;
  }

  // Search items by various criteria
  searchItems(query, filters = {}) {
    let results = [...this.data];

    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.brand.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply brand filter
    if (filters.brand) {
      const brandTerm = filters.brand.toLowerCase();
      results = results.filter(item => 
        item.brand.toLowerCase().includes(brandTerm)
      );
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      results = results.filter(item => item.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(item => item.price <= filters.maxPrice);
    }

    // Apply category filter
    if (filters.category) {
      const categoryTerm = filters.category.toLowerCase();
      results = results.filter(item => 
        item.category.toLowerCase().includes(categoryTerm)
      );
    }

    // Apply size filter
    if (filters.size) {
      const sizeTerm = filters.size.toLowerCase();
      results = results.filter(item => 
        item.size.toLowerCase().includes(sizeTerm)
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(item => 
        filters.tags.some(tag => 
          item.tags.some(itemTag => 
            itemTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, query, filters);
      const bScore = this.calculateRelevanceScore(b, query, filters);
      return bScore - aScore;
    });

    return results;
  }

  // Calculate relevance score for sorting
  calculateRelevanceScore(item, query, filters) {
    let score = 0;
    const queryLower = query ? query.toLowerCase() : '';

    // Name exact match gets highest score
    if (queryLower && item.name.toLowerCase() === queryLower) {
      score += 100;
    }
    // Name starts with query
    else if (queryLower && item.name.toLowerCase().startsWith(queryLower)) {
      score += 80;
    }
    // Name contains query
    else if (queryLower && item.name.toLowerCase().includes(queryLower)) {
      score += 60;
    }

    // Brand match
    if (queryLower && item.brand.toLowerCase().includes(queryLower)) {
      score += 40;
    }

    // Category match
    if (queryLower && item.category.toLowerCase().includes(queryLower)) {
      score += 30;
    }

    // Tag match
    if (queryLower && item.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
      score += 20;
    }

    // Description match
    if (queryLower && item.description.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    return score;
  }

  // Get unique brands from data
  getBrands() {
    const brands = [...new Set(this.data.map(item => item.brand))];
    return brands.sort();
  }

  // Get unique categories from data
  getCategories() {
    const categories = [...new Set(this.data.map(item => item.category))];
    return categories.sort();
  }

  // Get price range from data
  getPriceRange() {
    const prices = this.data.map(item => item.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  // Get unique sizes from data
  getSizes() {
    const sizes = [...new Set(this.data.map(item => item.size))];
    return sizes.sort();
  }

  // Get unique tags from data
  getTags() {
    const allTags = this.data.flatMap(item => item.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }
}

