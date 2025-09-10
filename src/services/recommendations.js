// Recommendation service for finding similar products
export class RecommendationService {
  constructor(mockData) {
    this.data = mockData;
  }

  // Find similar products based on various criteria
  findSimilarProducts(targetItem, limit = 4) {
    if (!targetItem) return [];

    const similarities = this.data
      .filter(item => item.name !== targetItem.name) // Exclude the target item itself
      .map(item => ({
        ...item,
        similarity: this.calculateSimilarity(targetItem, item)
      }))
      .filter(item => item.similarity > 0) // Only include items with some similarity
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity score
      .slice(0, limit);

    return similarities;
  }

  // Calculate similarity score between two products
  calculateSimilarity(item1, item2) {
    let score = 0;

    // Category similarity (highest weight)
    if (item1.category === item2.category) {
      score += 40;
    } else if (this.categoriesAreRelated(item1.category, item2.category)) {
      score += 20;
    }

    // Tag similarity
    const commonTags = this.getCommonTags(item1.tags, item2.tags);
    score += commonTags * 15; // 15 points per common tag

    // Brand similarity
    if (item1.brand === item2.brand) {
      score += 25;
    }

    // Name similarity (fuzzy matching)
    const nameSimilarity = this.calculateStringSimilarity(
      item1.name.toLowerCase(), 
      item2.name.toLowerCase()
    );
    score += nameSimilarity * 20;

    // Price range similarity (items in similar price ranges)
    const priceDiff = Math.abs(item1.price - item2.price);
    const maxPrice = Math.max(item1.price, item2.price);
    const priceSimilarity = maxPrice > 0 ? (1 - priceDiff / maxPrice) : 0;
    score += priceSimilarity * 10;

    return Math.round(score);
  }

  // Check if two categories are related
  categoriesAreRelated(cat1, cat2) {
    const categoryGroups = {
      'Food': ['Food - Produce', 'Food - Dairy', 'Food - Meat', 'Food - Snacks', 'Food - Beverages', 'Food - Pantry', 'Food - Frozen', 'Food - Bakery', 'Food - Prepared Meals', 'Food - Condiments', 'Food - Baking', 'Food - Grains', 'Food - Pasta', 'Food - Soups', 'Food - Canned Goods', 'Food - Breakfast', 'Food - Meal Kits', 'Food - Salads', 'Food - Meat Substitutes', 'Food - Meats', 'Food - Seafood', 'Food - Desserts', 'Food - Spices', 'Food - Baking Goods', 'Food - Prepared Foods', 'Food - Frozen Meals', 'Food - Frozen Foods', 'Food - Vegetable', 'Food - Vegetables'],
      'Clothing': ['Clothing - Outerwear', 'Clothing - Activewear', 'Clothing - Tops', 'Clothing - Bottoms', 'Clothing - Dresses', 'Clothing - Footwear', 'Clothing - Accessories'],
      'Electronics': ['Electronics', 'Computers', 'Audio', 'Photography', 'Wearable Tech', 'Smart Home'],
      'Home': ['Home', 'Kitchen', 'Home Appliances', 'Garden', 'Office'],
      'Health': ['Health', 'Fitness', 'Beauty'],
      'Outdoor': ['Outdoor', 'Sports', 'Bicycles', 'Automotive'],
      'Toys': ['Toys'],
      'Pets': ['Pets'],
      'Storage': ['Storage']
    };

    for (const [group, categories] of Object.entries(categoryGroups)) {
      if (categories.includes(cat1) && categories.includes(cat2)) {
        return true;
      }
    }
    return false;
  }

  // Get number of common tags between two items
  getCommonTags(tags1, tags2) {
    if (!tags1 || !tags2) return 0;
    return tags1.filter(tag => tags2.includes(tag)).length;
  }

  // Calculate string similarity using Levenshtein distance
  calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Calculate Levenshtein distance between two strings
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Get recommendations based on search query
  getRecommendationsForQuery(query, searchResults, limit = 4) {
    if (!query || !searchResults || searchResults.length === 0) {
      return [];
    }

    // Use the first search result as the basis for recommendations
    const primaryResult = searchResults[0];
    return this.findSimilarProducts(primaryResult, limit);
  }

  // Get recommendations based on recently added items
  getRecommendationsForCart(cartItems, limit = 4) {
    if (!cartItems || cartItems.length === 0) {
      return [];
    }

    // Find the most recently added item
    const recentItem = cartItems[cartItems.length - 1];
    
    // Find similar products
    const similarProducts = this.findSimilarProducts(recentItem, limit);
    
    // Filter out items already in cart
    return similarProducts.filter(item => 
      !cartItems.some(cartItem => 
        cartItem.name.toLowerCase() === item.name.toLowerCase()
      )
    );
  }

  // Get trending/popular products
  getTrendingProducts(limit = 6) {
    // For now, return random products with high ratings (simulated)
    // In a real app, this would be based on actual sales data
    return this.data
      .filter(item => item.price > 0 && item.price < 20) // Reasonable price range
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }
}
