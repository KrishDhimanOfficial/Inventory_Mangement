import { createBrowserRouter, RouterProvider } from "react-router"
import Login from "./pages/auth/Login"
import Dashboard from "./pages/dashboard/Dashboard"
import Users from "./pages/peoples/user/Users"
import Warehouses from "./pages/settings/warehouse/Warehouses"
import Suppliers from "./pages/peoples/suppliers/Suppliers"
import Customers from "./pages/peoples/customers/Customers"
import Category from "./pages/product/category/Category"
import Home from "./pages/dashboard/Home"
import Brand from "./pages/product/brand/Brand"

const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        path: '/dashboard',
        element: <Home />,
      },
      {
        path: '/dashboard/user/permissions',
        element: <Users />
      },
      {
        path: '/dashboard/suppliers',
        element: <Suppliers />
      },
      {
        path: '/dashboard/customers',
        element: <Customers />
      },
      {
        path: '/dashboard/setting/warehouse',
        element: <Warehouses />
      },
      {
        path: '/dashboard/product/category',
        element: <Category />
      },
      {
        path: '/dashboard/product/brand',
        element: <Brand />
      }
    ]
  }
]

const App = () => {
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export default App