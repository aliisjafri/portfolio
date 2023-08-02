import logo from './logo.svg'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Projects from './Projects'
import Articles from './Articles'
import About from './About'

const App = () => {
  const page = useLocation().pathname
  return (
    <div className="h-screen bg-gradient-to-tr from-violet-800 to-blue-400 p-4 text-slate-600 antialiased dark:from-violet-800 dark:to-slate-900 dark:text-slate-400">
      <div className="App">
        <div className="flex items-center justify-between pb-4 dark:text-slate-400">
          <img
            src={logo}
            className="logo-image"
            height="40px"
            width="40px"
            alt="Logo"
          />
          <div>
            <Link
              to="/"
              className={`${
                page === '/' ? 'text-slate-800 dark:text-amber-400' : ''
              } m-4 font-extrabold `}
            >
              About
            </Link>
            <Link
              to="/projects"
              className={`${
                page === '/projects' ? 'text-slate-800 dark:text-amber-400' : ''
              } m-4 font-extrabold `}
            >
              Projects
            </Link>
            <Link
              to="/articles"
              className={`${
                page === '/articles' ? 'text-slate-800 dark:text-amber-400' : ''
              } m-4 font-extrabold `}
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
