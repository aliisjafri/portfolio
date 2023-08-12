import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Projects from './Projects'
import Articles from './Articles'
import About from './About'
import { useTheme } from './hooks'

const App = () => {
  const page = useLocation().pathname
  const [theme, toggleTheme] = useTheme()
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-tr from-violet-800 to-blue-400 p-6 text-slate-700 antialiased dark:from-violet-800 dark:to-slate-900 dark:text-slate-400">
      <div className="App">
        <div className="flex items-center justify-between pb-4 dark:text-slate-400">
          <Link
            to="/"
            className="underline-animation font-extrabold text-yellow-200 dark:text-amber-400"
          >
            AliJafri.com
          </Link>
          <div className="flex gap-x-3">
            <button
              aria-label={`toggle ${theme === 'dark' ? 'light' : theme} theme`}
              onClick={() => toggleTheme()}
            >
              <i
                className={`${
                  theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'
                } transform cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-yellow-200 dark:hover:text-amber-400`}
              ></i>
            </button>
            {false && (
              <>
                <Link
                  to="/"
                  className={`${
                    page === '/' ? 'text-yellow-200 dark:text-amber-400' : ''
                  } underline-animation font-extrabold `}
                >
                  About
                </Link>
                <Link
                  to="/projects"
                  className={`${
                    page === '/projects'
                      ? 'text-yellow-200 dark:text-amber-400'
                      : ''
                  } underline-animation font-extrabold`}
                >
                  Projects
                </Link>
                <Link
                  to="/articles"
                  className={`${
                    page === '/articles'
                      ? 'text-yellow-200 dark:text-amber-400'
                      : ''
                  } underline-animation font-extrabold`}
                >
                  Articles
                </Link>
              </>
            )}
          </div>
        </div>
        <Routes>
          <Route path="/">
            <Route index element={<About />} />
            <Route path="articles" element={<Articles />} />
            <Route path="projects" element={<Projects />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
