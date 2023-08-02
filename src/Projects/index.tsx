import { Link, Outlet } from 'react-router-dom'
const Projects = () => (
  <div className="pt-4">
    <h1 className="text-3xl">
      <Link className="hover:underline" to="/projects">
        Projects
      </Link>
    </h1>
    <Outlet />
  </div>
)

export default Projects
