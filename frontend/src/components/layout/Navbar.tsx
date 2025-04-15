import { Link, useNavigate } from "react-router"
import { Button } from "../component"
import config from "../../config/config"
import { useDispatch, useSelector } from "react-redux"
import { setSideMenu } from "../../controller/singleData"

const Navbar = () => {
  const dispatch = useDispatch()
  const naviagte = useNavigate()
  const menuoption = useSelector((state: any) => state.singleData.sidemenu)

  const Logout = () => {
    localStorage.removeItem(config.token_name)
    naviagte('/login')
  }

  const hideSideMenu = () => { dispatch(setSideMenu(!menuoption)) }
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/*  Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link onClick={() => hideSideMenu()} className="nav-link" data-widget="pushmenu" to="#" role="button">
            <i className="fa-solid fa-bars-staggered"></i>
          </Link>
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