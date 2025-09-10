// Gemini API service for intelligent command parsing
export class GeminiCommandParser {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  async parseCommand(transcript) {
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }

    const prompt = `You are a shopping list assistant. Parse the following speech input into a structured command.

Speech input: "${transcript}"

Extract the following information:
1. action: "add", "remove", or "search" (based on what the user wants to do)
2. item: the specific item name (normalize to singular form, e.g., "apples" -> "apple")
3. quantity: the number of items (default to 1 if not specified)
4. filters: object with search criteria (only for search actions)

For search actions, extract these filters:
- brand: specific brand name
- minPrice: minimum price (extract numbers from phrases like "under $5", "less than $10")
- maxPrice: maximum price (extract numbers from phrases like "under $5", "less than $10")
- category: product category
- size: product size
- tags: array of tags like "organic", "fresh", "fruit"

Examples:
- "add milk" -> {action: "add", item: "milk", quantity: 1}
- "add 2 bananas" -> {action: "add", item: "banana", quantity: 2}
- "remove apples" -> {action: "remove", item: "apple", quantity: 1}
- "I need 3 bottles of water" -> {action: "add", item: "water", quantity: 3}
- "find organic apples" -> {action: "search", item: "apple", quantity: 1, filters: {tags: ["organic"]}}
- "search for toothpaste under $5" -> {action: "search", item: "toothpaste", quantity: 1, filters: {maxPrice: 5}}
- "show me organic apples" -> {action: "search", item: "apple", quantity: 1, filters: {tags: ["organic"]}}
- "find me some bread" -> {action: "search", item: "bread", quantity: 1}
- "search for Nike shoes" -> {action: "search", item: "shoes", quantity: 1, filters: {brand: "Nike"}}
- "find organic food under $10" -> {action: "search", item: "food", quantity: 1, filters: {tags: ["organic"], maxPrice: 10}}

Return ONLY a JSON object with action, item, quantity, and filters (if applicable). If the command is unclear or not related to shopping, return null.`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 100,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      const content = data.candidates[0].content.parts[0].text.trim();
      
      // Extract JSON from markdown code blocks if present
      let jsonContent = content;
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }
      
      // Try to parse the JSON response
      try {
        const parsed = JSON.parse(jsonContent);
        return parsed;
      } catch (parseError) {
        console.warn('Failed to parse Gemini response as JSON:', content);
        console.warn('Extracted JSON content:', jsonContent);
        return null;
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}

// Fallback parser using regex (for when Gemini is not available)
export class RegexCommandParser {
  parseCommand(transcript) {
    if (!transcript) return { action: null, item: null, quantity: 1 };
    
    const normalized = transcript.trim().toLowerCase();

    // Try search commands first
    // Search with price filter e.g., "find toothpaste under $5"
    let match = normalized.match(/^(?:find|search|show\s+me|look\s+for)\s+(.+?)\s+(?:under|below|less\s+than)\s+\$?(\d+(?:\.\d+)?)$/i);
    if (match) {
      const item = match[1].trim();
      const maxPrice = parseFloat(match[2]);
      return { 
        action: 'search', 
        item, 
        quantity: 1, 
        filters: { maxPrice } 
      };
    }

    // Search with organic/fresh tags e.g., "find organic apples"
    match = normalized.match(/^(?:find|search|show\s+me|look\s+for)\s+(?:organic|fresh|fruit)\s+(.+)$/i);
    if (match) {
      const item = match[1].trim();
      const tag = normalized.includes('organic') ? 'organic' : 
                  normalized.includes('fresh') ? 'fresh' : 'fruit';
      return { 
        action: 'search', 
        item, 
        quantity: 1, 
        filters: { tags: [tag] } 
      };
    }

    // Search with brand e.g., "find Nike shoes"
    match = normalized.match(/^(?:find|search|show\s+me|look\s+for)\s+(.+?)\s+(?:by\s+)?([A-Za-z]+)$/i);
    if (match) {
      const item = match[1].trim();
      const brand = match[2].trim();
      return { 
        action: 'search', 
        item, 
        quantity: 1, 
        filters: { brand } 
      };
    }

    // Simple search e.g., "find apples", "search for bread"
    match = normalized.match(/^(?:find|search|show\s+me|look\s+for)\s+(.+)$/i);
    if (match) {
      const item = match[1].trim();
      return { action: 'search', item, quantity: 1 };
    }

    // Try add with quantity e.g., add 2 bananas
    match = normalized.match(/^(?:add|get|buy|need|want)\s+(\d+)\s+(.+)$/i);
    if (match) {
      const quantity = parseInt(match[1], 10) || 1;
      const item = match[2].trim();
      return { action: 'add', item, quantity };
    }

    // Try simple add e.g., add milk
    match = normalized.match(/^(?:add|get|buy|need|want)\s+(.+)$/i);
    if (match) {
      const item = match[1].trim();
      return { action: 'add', item, quantity: 1 };
    }

    // Try remove e.g., remove apples
    match = normalized.match(/^(?:remove|delete|take\s+out|get\s+rid\s+of)\s+(.+)$/i);
    if (match) {
      const item = match[1].trim();
      return { action: 'remove', item, quantity: 1 };
    }

    return { action: null, item: null, quantity: 1 };
  }
}
