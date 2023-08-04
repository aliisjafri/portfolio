import { useState, useEffect } from 'react'
type Theme = 'dark' | 'light'

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  useEffect(() => {
    console.log({ theme })
    theme === 'dark'
      ? document.documentElement.classList.remove('light')
      : document.documentElement.classList.remove('dark')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme => (theme === 'dark' ? 'light' : 'dark'))
  }

  return [theme, toggleTheme]
}
