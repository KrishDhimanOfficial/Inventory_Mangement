import { Link } from "react-router"

const Navbar = () => {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/*  Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" data-widget="pushmenu" to="#" role="button">
            <i className="fa-solid fa-bars-staggered"></i>
          </Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/dashboard" className="nav-link">Home</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar