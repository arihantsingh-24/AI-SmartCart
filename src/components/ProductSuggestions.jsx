import React from 'react';

export default function ProductSuggestions({ 
  suggestions, 
  onAddToCart, 
  title = "You might also like",
  showSimilarity = false 
}) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-2xl">💡</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggestions.map((item, index) => (
          <div
            key={`${item.name}-${item.brand}-${index}`}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onAddToCart(item.name, 1)}
          >
            {/* Product Image Placeholder */}
            <div className="w-full h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
              <div className="text-gray-400 dark:text-gray-500 text-2xl">
                🛍️
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-1">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.name}
              </h4>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.brand}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatPrice(item.price)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="truncate">{item.category}</span>
                {showSimilarity && item.similarity && (
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {item.similarity}% match
                  </span>
                )}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{item.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item.name, 1);
                }}
                className="w-full mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
