import logo from './logo.svg'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Projects from './Projects'
import Articles from './Articles'
import About from './About'

const App = () => {
  const page = useLocation().pathname
  return (
    <div className="h-screen bg-white p-8 text-slate-500 antialiased dark:bg-slate-900 dark:text-slate-400">
      <div className="App">
        <div className="flex items-center justify-between border-b border-slate-500 pb-4 dark:text-slate-400">
          <img
            src={logo}
            className="logo-image"
            height="80px"
            width="80px"
            alt="Logo"
          />
          <div className="">
            <Link
              to="/"
              className={`${
                page === '/' ? 'text-amber-400' : ''
              } m-4 font-bold`}
            >
              About
            </Link>
            <Link
              to="/projects"
              className={`${
                page === '/projects' ? 'text-amber-400' : ''
              } m-4 font-bold`}
            >
              Projects
            </Link>
            <Link
              to="/articles"
              className={`${
                page === '/articles' ? 'text-amber-400' : ''
              } m-4 font-bold`}
            >
              Articles
            </Link>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
