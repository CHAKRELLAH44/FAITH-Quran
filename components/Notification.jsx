'use client'
import { useState, useEffect, useCallback } from 'react'

let showFn = null

// Call this from anywhere to show a toast
export function notify(icon, text) {
  if (showFn) showFn(icon, text)
}

export default function Notification() {
  const [visible, setVisible]   = useState(false)
  const [icon,    setIcon]      = useState('✦')
  const [text,    setText]      = useState('')

  useEffect(() => {
    showFn = (i, t) => {
      setIcon(i); setText(t); setVisible(true)
      setTimeout(() => setVisible(false), 2800)
    }
    return () => { showFn = null }
  }, [])

  return (
    <div className={`notif ${visible ? 'show' : ''}`}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{text}</span>
    </div>
  )
}
