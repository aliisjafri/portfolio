import { Link, Outlet, NavLink, useLocation } from 'react-router-dom'
const PatientTemplates = () => {
  const page = useLocation().pathname
  return (
    <div className={page === '/patient-templates' ? '' : 'flex justify-center'}>
      <div className="pt-4 flex flex-col">
        <div>
          <h1 className="text-4xl">
            <Link
              className="font-extrabold text-white hover:underline"
              to="/patient-templates"
            >
              Patient Templates
            </Link>
          </h1>
          <ul>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `font-extrabold text-2xl hover:underline pr-2 ${
                    isActive || page === '/patient-templates'
                      ? 'text-yellow-200 dark:text-amber-400'
                      : 'hidden'
                  }`
                }
                to="ingrown-nail"
              >
                Ingrown Nail
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `font-extrabold text-2xl hover:underline pr-2 ${
                    isActive || page === '/patient-templates'
                      ? 'text-yellow-200 dark:text-amber-400'
                      : 'hidden'
                  }`
                }
                to="plantar-fasciitis"
              >
                Plantar Fasciitis
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex justify-center">
          <div className="max-w-xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientTemplates
