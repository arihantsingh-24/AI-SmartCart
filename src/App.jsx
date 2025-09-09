import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import MicButton from './components/MicButton.jsx'
import Transcript from './components/Transcript.jsx'
import ShoppingList from './components/ShoppingList.jsx'
import { BrowserSpeechRecognizer } from './services/speech.js'
import { parseCommand } from './utils/commands.js'
import { categorizeItem } from './utils/categories.js'
import { loadItems, saveItems } from './utils/storage.js'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function App() {
  const [items, setItems] = useState(() => loadItems())
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isFinal, setIsFinal] = useState(false)

  useEffect(() => { saveItems(items) }, [items])

  const recognizer = useMemo(() => new BrowserSpeechRecognizer({ interim: true }), [])
  const stopRef = useRef(null)

  const handleToggleMic = () => {
    if (listening) {
      stopRef.current?.()
      setListening(false)
      return
    }
    const stop = recognizer.start(({ transcript: t, isFinal: final }) => {
      setTranscript(t)
      setIsFinal(final)
      if (final) {
        const { action, item, quantity } = parseCommand(t)
        if (action && item) {
          if (action === 'add') {
            setItems(curr => {
              const existing = curr.find(i => i.name.toLowerCase() === item.toLowerCase())
              if (existing) {
                return curr.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + (quantity || 1) } : i)
              }
              return [
                ...curr,
                { id: uid(), name: item, quantity: quantity || 1, category: categorizeItem(item) },
              ]
            })
          }
          if (action === 'remove') {
            setItems(curr => curr.filter(i => !i.name.toLowerCase().includes(item.toLowerCase())))
          }
        }
      }
    }, () => {
      setListening(false)
    }, (e) => {
      console.error(e)
      setListening(false)
    })
    stopRef.current = stop
    setListening(true)
  }

  const increment = (id) => setItems(curr => curr.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
  const decrement = (id) => setItems(curr => curr.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
  const remove = (id) => setItems(curr => curr.filter(i => i.id !== id))
  const clearAll = () => setItems([])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <header className="p-4 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">SmartCart AI</h1>
          <button onClick={clearAll} className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">Clear</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-28">
        <p className="text-gray-600 dark:text-gray-300">
          Say commands like <span className="font-medium">"Add milk"</span>, <span className="font-medium">"Add 2 bananas"</span>, or <span className="font-medium">"Remove apples"</span>.
        </p>
        <Transcript text={transcript} isFinal={isFinal} />
        <div className="mt-6">
          <ShoppingList items={items} onInc={increment} onDec={decrement} onRemove={remove} />
        </div>
      </main>

      <MicButton active={listening} onToggle={handleToggleMic} />
    </div>
  )
}

export default App
