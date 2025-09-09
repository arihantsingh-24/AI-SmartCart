import React from 'react'

function groupByCategory(items) {
  const map = new Map();
  for (const item of items) {
    const key = item.category || 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return Array.from(map.entries());
}

export default function ShoppingList({ items, onInc, onDec, onRemove }) {
  const groups = groupByCategory(items);
  return (
    <div className="space-y-6">
      {groups.map(([category, group]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{category}</h3>
          <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {group.map(item => (
              <li key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                  <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onDec(item.id)} className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">-</button>
                  <button onClick={() => onInc(item.id)} className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">+</button>
                  <button onClick={() => onRemove(item.id)} className="px-2 py-1 text-sm rounded bg-red-50 text-red-600 hover:bg-red-100">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400">Your list is empty. Try saying "Add milk".</div>
      )}
    </div>
  )
}
