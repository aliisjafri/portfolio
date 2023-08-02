import { Link, Outlet } from 'react-router-dom'
const Articles = () => (
  <div className="pt-4">
    <h1 className="text-3xl">
      <Link className="hover:underline" to="/articles">
        Articles
      </Link>
    </h1>
    <Outlet />
  </div>
)

export default Articles
