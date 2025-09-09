import React from 'react'

export default function Transcript({ text, isFinal }) {
  if (!text) return null;
  return (
    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
      <span className="font-medium">Transcript:</span>{' '}
      <span className={isFinal ? 'font-semibold text-gray-900 dark:text-white' : 'italic opacity-80'}>
        {text}
      </span>
    </div>
  )
}
