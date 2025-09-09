import React from "react";
import "./index.css";
import MicButton from "./components/MicButton.jsx";
import Transcript from "./components/Transcript.jsx";
import ShoppingList from "./components/ShoppingList.jsx";
import { useSpeechRecognition, useShoppingList } from "./hooks/useSpeechRecognition.js";

function App() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
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

  const handleToggleMic = () => {
    if (listening) {
      stopListening();
      return;
    }

    startListening(({ action, item, quantity }) => {
      if (action === "add") {
        addItem(item, quantity);
      } else if (action === "remove") {
        removeItem(item);
      }
    });
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
        <p className="text-gray-600 dark:text-gray-300">
          {apiKey ? (
            <>
              Say natural commands like <span className="font-medium">"I need milk"</span>,{" "}
              <span className="font-medium">"Get me 2 bananas"</span>,{" "}
              <span className="font-medium">"Remove the apples"</span>, or{" "}
              <span className="font-medium">"Add 3 bottles of water"</span>.
            </>
          ) : (
            <>
              Say commands like <span className="font-medium">"Add milk"</span>,{" "}
              <span className="font-medium">"Add 2 bananas"</span>, or{" "}
              <span className="font-medium">"Remove apples"</span>.
            </>
          )}
        </p>
        
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

        <Transcript text={transcript} isFinal={isFinal} />
        <div className="mt-6">
          <ShoppingList
            items={items}
            onInc={increment}
            onDec={decrement}
            onRemove={remove}
          />
        </div>
      </main>

      <MicButton 
        active={listening} 
        onToggle={handleToggleMic}
        disabled={isLoading}
      />
    </div>
  );
}

export default App;
