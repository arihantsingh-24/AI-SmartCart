import React from 'react'

export default function MicButton({ active, onToggle, disabled = false }) {
  return (
    <button
      aria-label={active ? 'Stop listening' : 'Start listening'}
      onClick={onToggle}
      disabled={disabled}
      className={
        `fixed bottom-6 right-6 rounded-full shadow-lg transition-colors` +
        ` h-16 w-16 flex items-center justify-center` +
        ` ${disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : active 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-brand-600 hover:bg-brand-700'
        }`
      }
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-white">
        {active ? (
          <path d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zm5-3a5 5 0 11-10 0H5a7 7 0 0014 0h-2z" />
        )}
      </svg>
    </button>
  )
}
