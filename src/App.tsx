import { Routes, Route, NavLink } from 'react-router-dom'
import Projects from './Projects'
import Articles from './Articles'
import About from './About'
import IngrownNail from './PatientTemplates/IngrownNail'
import PlantarFasciitis from './PatientTemplates/PlantarFasciitis'
import PatientTemplates from './PatientTemplates'
import ThemeToggleButton from './Components/ThemeToggleButton'
import AudioPlayer from './AudioPlayer'

const App = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-tr from-violet-800 to-blue-400 p-6 text-slate-700 antialiased dark:from-violet-800 dark:to-slate-900 dark:text-slate-400">
      <div className="App">
        <header className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `underline-animation font-extrabold text-yellow-200 dark:text-amber-400 ${
                  isActive ? 'underline-active' : ''
                }`
              }
            >
              AliJafri.com
            </NavLink>
            <NavLink
              to="/audio-player"
              className={({ isActive }) =>
                `underline-animation font-extrabold text-yellow-200 dark:text-amber-400 ml-3 ${
                  isActive ? 'underline-active' : ''
                }`
              }
            >
              Audio Player
            </NavLink>
          </div>
          <ThemeToggleButton />
        </header>
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
