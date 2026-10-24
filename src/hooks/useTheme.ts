import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'gmda-theme'
const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const documentTheme = document.documentElement.dataset.theme
  if (isTheme(documentTheme)) return documentTheme

  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY)
    if (isTheme(savedTheme)) return savedTheme
  } catch {
    // The theme still works when storage is unavailable; it just won't persist.
  }

  return 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#14142B' : '#F5F3EC',
    )

    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore storage restrictions without blocking the visual theme change.
    }
  }, [theme])

  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark')

  return { theme, toggleTheme }
}
