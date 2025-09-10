import React from 'react';

export default function SearchResults({ 
  results, 
  onAddToCart, 
  searchQuery, 
  filters, 
  onClearSearch 
}) {
  if (!results || results.length === 0) {
    return (
      <div className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-600 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No items found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery ? `No results for "${searchQuery}"` : 'Try a different search term'}
          </p>
          <button
            onClick={onClearSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getFilterDescription = () => {
    const filterParts = [];
    if (filters.brand) filterParts.push(`Brand: ${filters.brand}`);
    if (filters.minPrice !== undefined) filterParts.push(`Min: ${formatPrice(filters.minPrice)}`);
    if (filters.maxPrice !== undefined) filterParts.push(`Max: ${formatPrice(filters.maxPrice)}`);
    if (filters.category) filterParts.push(`Category: ${filters.category}`);
    if (filters.tags && filters.tags.length > 0) filterParts.push(`Tags: ${filters.tags.join(', ')}`);
    if (filters.size) filterParts.push(`Size: ${filters.size}`);
    
    return filterParts.length > 0 ? filterParts.join(' • ') : null;
  };

  return (
    <div className="mt-6">
      {/* Search Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Search Results
            {searchQuery && (
              <span className="text-gray-500 dark:text-gray-400 font-normal">
                {' '}for "{searchQuery}"
              </span>
            )}
          </h2>
          {getFilterDescription() && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {getFilterDescription()}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {results.length} item{results.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={onClearSearch}
          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <div
            key={`${item.name}-${item.brand}`}
            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow"
          >
            {/* Item Image Placeholder */}
            <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-600 text-4xl">
                🛍️
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                {item.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.brand}
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatPrice(item.price)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{item.category}</span>
                <span>{item.size}</span>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => onAddToCart(item.name, 1)}
                className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Add to List
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {results.length >= 20 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
}

