import { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'

type Theme = 'dark' | 'light'

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  useEffect(() => {
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

const buttonVariants: Variants = {
  dark: { rotate: 0 },
  light: { rotate: 180 },
}

const ThemeToggleButton = () => {
  const [theme, toggleTheme] = useTheme()

  return (
    <motion.button
      aria-label={`toggle ${theme === 'dark' ? 'light' : theme} theme`}
      onClick={() => toggleTheme()}
      variants={buttonVariants}
      initial={theme}
      animate={theme}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <i
        className={`${
          theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'
        } transform cursor-pointer transition-transform duration-200 hover:text-yellow-200 dark:hover:text-amber-400`}
      ></i>
    </motion.button>
  )
}

export default ThemeToggleButton
