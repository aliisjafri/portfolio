import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Projects from './Projects'
import Articles from './Articles'
import About from './About'
import IngrownNail from './PatientTemplates/IngrownNail'
import PlantarFasciitis from './PatientTemplates/PlantarFasciitis'
import PatientTemplates from './PatientTemplates'
import ThemeToggleButton from './Components/ThemeToggleButton'
import AudioPlayer from './AudioPlayer'
const App = () => {
  const page = useLocation().pathname
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-tr from-violet-800 to-blue-400 p-6 text-slate-700 antialiased dark:from-violet-800 dark:to-slate-900 dark:text-slate-400">
      <div className="App">
        <div className="flex items-center justify-between pb-4 dark:text-slate-400">
          <div className="flex">
            <Link
              to="/"
              className="underline-animation font-extrabold text-yellow-200 dark:text-amber-400"
            >
              AliJafri.com
            </Link>
            <Link
              to="/audio-player"
              className="underline-animation font-extrabold text-yellow-200 dark:text-amber-400 ml-3"
            >
              Audio Player
            </Link>
          </div>
          <div className="flex gap-x-3">
            <ThemeToggleButton />
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
            <Route path="audio-player" element={<AudioPlayer />} />
            <Route path="patient-templates" element={<PatientTemplates />}>
              <Route path="ingrown-nail" element={<IngrownNail />} />
              <Route path="plantar-fasciitis" element={<PlantarFasciitis />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
