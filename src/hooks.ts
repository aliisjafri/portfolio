import { useState, useEffect } from 'react'
type Theme = 'dark' | 'light'

const getInitialTheme = (): Theme => {
  if (localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as Theme
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  } else {
    return 'light'
  }
}

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = (): void => {
    setTheme(previousTheme => (previousTheme === 'dark' ? 'light' : 'dark'))
  }

  return [theme, toggleTheme]
}
