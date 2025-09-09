const CATEGORY_RULES = [
  { category: 'Dairy', keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream'] },
  { category: 'Produce', keywords: ['apple', 'banana', 'orange', 'lettuce', 'tomato', 'onion', 'garlic', 'spinach', 'carrot', 'potato'] },
  { category: 'Bakery', keywords: ['bread', 'bun', 'bagel', 'tortilla'] },
  { category: 'Meat & Seafood', keywords: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp'] },
  { category: 'Snacks', keywords: ['chips', 'cookies', 'crackers', 'popcorn', 'candy'] },
  { category: 'Beverages', keywords: ['juice', 'soda', 'water', 'coffee', 'tea'] },
  { category: 'Pantry', keywords: ['rice', 'pasta', 'bean', 'flour', 'sugar', 'oil', 'salt', 'pepper'] },
  { category: 'Frozen', keywords: ['frozen', 'ice cream', 'peas', 'fries'] },
  { category: 'Household', keywords: ['soap', 'detergent', 'paper', 'towel', 'foil'] },
];

export function categorizeItem(name) {
  const lower = name.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return rule.category;
    }
  }
  return 'Other';
}
