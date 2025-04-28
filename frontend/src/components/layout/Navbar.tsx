import { Link, useNavigate } from "react-router"
import { Button } from "../component"
import config from "../../config/config"
import { useDispatch, useSelector } from "react-redux"
import { setSideMenu, setsidebarOpen } from '../../controller/singleData'

const Navbar = () => {
  const dispatch = useDispatch()
  const { sidemenu } = useSelector((state: any) => state.singleData)
  const naviagte = useNavigate()

  const Logout = () => {
    localStorage.removeItem(config.token_name)
    naviagte('/login')
  }

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/*  Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" onClick={() => { dispatch(setSideMenu(!sidemenu)) }} href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/dashboard" className="nav-link">Home</Link>
        </li>
      </ul>
      <ul className="navbar-nav ms-auto">
        <li className="nav-item d-none d-sm-inline-block">
          <Button
            text="Logout"
            className="nav-link"
            onclick={() => { Logout() }}
          />
        </li>
      </ul>
    </nav>
  )
}

export default Navbar