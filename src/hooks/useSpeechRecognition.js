import { useCallback, useMemo, useRef, useState } from 'react';
import { BrowserSpeechRecognizer } from '../services/speech.js';
import { GeminiCommandParser, RegexCommandParser } from '../services/gemini.js';
import { categorizeItem } from '../utils/categories.js';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function useSpeechRecognition(apiKey) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isFinal, setIsFinal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const stopRef = useRef(null);

  // Create command parser with Gemini if API key is available
  const commandParser = useMemo(() => {
    if (apiKey) {
      return new GeminiCommandParser(apiKey);
    }
    return new RegexCommandParser();
  }, [apiKey]);

  // Create speech recognizer
  const recognizer = useMemo(() => {
    return new BrowserSpeechRecognizer({ interim: true });
  }, []);

  const processCommand = useCallback(async (commandText) => {
    try {
      if (commandParser instanceof GeminiCommandParser) {
        const result = await commandParser.parseCommand(commandText);
        return result || { action: null, item: null, quantity: 1 };
      } else {
        return commandParser.parseCommand(commandText);
      }
    } catch (error) {
      console.error('Command parsing error:', error);
      // Fallback to regex parser if Gemini fails
      const regexParser = new RegexCommandParser();
      return regexParser.parseCommand(commandText);
    }
  }, [commandParser]);

  const startListening = useCallback((onCommandProcessed) => {
    if (listening) return;

    setIsLoading(true);
    setError(null);

    try {
      const stop = recognizer.start(
        async ({ transcript: t, isFinal: final }) => {
          setTranscript(t);
          setIsFinal(final);
          
          if (final) {
            try {
              const { action, item, quantity } = await processCommand(t);
              if (action && item) {
                onCommandProcessed({ action, item, quantity });
              }
            } catch (parseError) {
              console.error('Command parsing error:', parseError);
              setError('Failed to understand command. Please try again.');
            }
          }
        },
        () => {
          setListening(false);
          setIsLoading(false);
        },
        (err) => {
          console.error('Speech recognition error:', err);
          setError(err.message || 'Speech recognition failed');
          setListening(false);
          setIsLoading(false);
        }
      );

      stopRef.current = stop;
      setListening(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError(err.message || 'Failed to start speech recognition');
      setIsLoading(false);
    }
  }, [listening, recognizer, processCommand]);

  const stopListening = useCallback(() => {
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }
    setListening(false);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    listening,
    transcript,
    isFinal,
    error,
    isLoading,
    startListening,
    stopListening,
    clearError,
    processCommand
  };
}

export function useShoppingList() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcart.items.v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever items change
  useMemo(() => {
    try {
      localStorage.setItem('smartcart.items.v1', JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save items:', err);
    }
  }, [items]);

  const addItem = useCallback((itemName, quantity = 1) => {
    setItems(curr => {
      const existing = curr.find(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (existing) {
        return curr.map(i =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...curr,
        {
          id: uid(),
          name: itemName,
          quantity,
          category: categorizeItem(itemName),
        },
      ];
    });
  }, []);

  const removeItem = useCallback((itemName) => {
    setItems(curr =>
      curr.filter(i => !i.name.toLowerCase().includes(itemName.toLowerCase()))
    );
  }, []);

  const increment = useCallback((id) => {
    setItems(curr =>
      curr.map(i => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }, []);

  const decrement = useCallback((id) => {
    setItems(curr =>
      curr.map(i =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  }, []);

  const remove = useCallback((id) => {
    setItems(curr => curr.filter(i => i.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    addItem,
    removeItem,
    increment,
    decrement,
    remove,
    clearAll
  };
}
