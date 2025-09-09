// Supported forms:
// - "add milk"
// - "add 2 bananas"
// - "remove apples"
// Returns: { action: 'add'|'remove'|null, item: string|null, quantity: number }

export function parseCommand(text) {
  if (!text) return { action: null, item: null, quantity: 1 };
  const normalized = text.trim().toLowerCase();

  // Try add with quantity e.g., add 2 bananas
  let match = normalized.match(/^add\s+(\d+)\s+(.+)$/i);
  if (match) {
    const quantity = parseInt(match[1], 10) || 1;
    const item = match[2].trim();
    return { action: 'add', item, quantity };
  }

  // Try simple add e.g., add milk
  match = normalized.match(/^add\s+(.+)$/i);
  if (match) {
    const item = match[1].trim();
    return { action: 'add', item, quantity: 1 };
  }

  // Try remove e.g., remove apples
  match = normalized.match(/^remove\s+(.+)$/i);
  if (match) {
    const item = match[1].trim();
    return { action: 'remove', item, quantity: 1 };
  }

  return { action: null, item: null, quantity: 0 };
}
