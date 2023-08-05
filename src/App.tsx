import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Projects from './Projects'
import Articles from './Articles'
import About from './About'
import { useTheme } from './hooks'

const App = () => {
  const page = useLocation().pathname
  const [, toggleTheme] = useTheme()

  return (
    <div className="bg-gradient-to-tr from-violet-800 to-blue-400 p-6 text-slate-700 antialiased dark:from-violet-800 dark:to-slate-900 dark:text-slate-400">
      <div className="App">
        <div className="flex items-center justify-between pb-4 dark:text-slate-400">
          <p className="text-center font-extrabold tracking-tight text-yellow-200 dark:text-amber-400">
            AliJafri.com
          </p>
          <div className="flex gap-x-3">
            <div>
              <i
                onClick={() => toggleTheme()}
                className="fa-solid fa-circle-half-stroke cursor-pointer"
              ></i>
            </div>
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
