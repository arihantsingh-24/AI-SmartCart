import React, { useState, useMemo } from "react";
import "./index.css";
import MicButton from "./components/MicButton.jsx";
import Transcript from "./components/Transcript.jsx";
import ShoppingList from "./components/ShoppingList.jsx";
import SearchResults from "./components/SearchResults.jsx";
import ProductSuggestions from "./components/ProductSuggestions.jsx";
import { useSpeechRecognition, useShoppingList } from "./hooks/useSpeechRecognition.js";
import { SearchService } from "./services/search.js";
import { RecommendationService } from "./services/recommendations.js";
import mockData from "./assets/mockProducts.json";

function App() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize services
  const searchService = useMemo(() => new SearchService(mockData), []);
  const recommendationService = useMemo(() => new RecommendationService(mockData), []);

  // Load trending products on app start
  React.useEffect(() => {
    const trendingProducts = recommendationService.getTrendingProducts(4);
    setSuggestions(trendingProducts);
    setShowSuggestions(true);
  }, [recommendationService]);

  const {
    listening,
    transcript,
    isFinal,
    error,
    isLoading,
    startListening,
    stopListening,
    clearError
  } = useSpeechRecognition(apiKey);
  
  const {
    items,
    addItem,
    removeItem,
    increment,
    decrement,
    remove,
    clearAll
  } = useShoppingList();

  // Update suggestions when items are added to cart
  React.useEffect(() => {
    if (items.length > 0) {
      const lastAddedItem = items[items.length - 1];
      const addedItem = mockData.find(item => 
        item.name.toLowerCase() === lastAddedItem.name.toLowerCase()
      );
      
      if (addedItem) {
        const cartSuggestions = recommendationService.getRecommendationsForCart([addedItem]);
        setSuggestions(cartSuggestions);
        setShowSuggestions(true);
      }
    }
  }, [items, recommendationService]);
  
  const handleToggleMic = () => {
    if (listening) {
      stopListening();
      return;
    }
    
    startListening(({ action, item, quantity, filters }) => {
      if (action === "add") {
        addItem(item, quantity);
      } else if (action === "remove") {
        removeItem(item);
      } else if (action === "search") {
        performSearch(item, filters);
      }
    });
  };
  
  const performSearch = (query, filters = {}) => {
    const results = searchService.searchItems(query, filters);
    setSearchQuery(query);
    setSearchFilters(filters);
    setSearchResults(results);
    
    // Get recommendations for search results
    const searchSuggestions = recommendationService.getRecommendationsForQuery(query, results);
    setSuggestions(searchSuggestions);
    setShowSuggestions(true);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setSearchQuery('');
    setSearchFilters({});
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddToCart = (itemName, quantity) => {
    addItem(itemName, quantity);
    // Suggestions will be updated by useEffect when items change
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <header className="p-4 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">SmartCart AI</h1>
          <div className="flex items-center gap-2">
            {apiKey ? (
              <span className="text-xs text-green-600 dark:text-green-400">
                Using Gemini AI
              </span>
            ) : (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Using browser speech
              </span>
            )}
            {searchResults && (
              <button
                onClick={handleClearSearch}
                className="text-sm px-3 py-1 rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
              >
                Back to List
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-28">
        <div className="space-y-4">
            
          <MicButton 
            active={listening} 
            onToggle={handleToggleMic}
            disabled={isLoading}
          />
          <Transcript text={transcript} isFinal={isFinal} />

          {/* Search Examples */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🔍 Voice Search Examples
            </h3>

            <p className="text-xs text-blue-800 dark:text-blue-200 mb-2">
              <>
                Say natural commands like <span className="font-medium">"I need milk"</span>,{" "}
                <span className="font-medium">"Get me 2 bananas"</span>,{" "}
                <span className="font-medium">"Remove the apples"</span>,{" "}
                <span className="font-medium">"Find organic apples"</span>, or{" "}
                <span className="font-medium">"Search for toothpaste under $5"</span>.
              </>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800 dark:text-blue-200">
              <div>
                <strong>Item Search:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• "Find apples"</li>
                  <li>• "Search for bread"</li>
                  <li>• "Show me milk"</li>
                </ul>
              </div>
              <div>
                <strong>Filtered Search:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• "Find organic apples"</li>
                  <li>• "Search toothpaste under $5"</li>
                  <li>• "Find Nike shoes"</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 <strong>Smart Suggestions:</strong> After searching or adding items, you'll see personalized product recommendations!
              </p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-800 dark:text-red-200 text-sm">
                {error}
              </p>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Initializing speech recognition...
            </p>
          </div>
        )}

        
        {/* Show search results if available, otherwise show shopping list */}
        {searchResults ? (
          <>
            <SearchResults
              results={searchResults}
              onAddToCart={handleAddToCart}
              searchQuery={searchQuery}
              filters={searchFilters}
              onClearSearch={handleClearSearch}
            />
            
            {/* Suggestion Toggle Button for Search */}
            {suggestions.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={toggleSuggestions}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
                </button>
              </div>
            )}
            
            {showSuggestions && suggestions.length > 0 && (
              <ProductSuggestions
                suggestions={suggestions}
                onAddToCart={handleAddToCart}
                title="You might also like"
                showSimilarity={true}
              />
            )}
          </>
        ) : (
          <div className="mt-6">
            <ShoppingList
              items={items}
              onInc={increment}
              onDec={decrement}
              onRemove={remove}
            />
            
            {/* Suggestion Toggle Button */}
            {suggestions.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={toggleSuggestions}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
                </button>
              </div>
            )}
            
            {showSuggestions && suggestions.length > 0 && (
              <ProductSuggestions
                suggestions={suggestions}
                onAddToCart={handleAddToCart}
                title="Recommended for you"
                showSimilarity={false}
              />
            )}
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
