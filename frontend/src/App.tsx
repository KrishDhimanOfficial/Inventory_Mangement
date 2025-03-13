import { createBrowserRouter, RouterProvider } from "react-router"
import Login from "./pages/auth/Login"
import Dashboard from "./pages/dashboard/Dashboard"
import Users from "./pages/peoples/user/Users"
import Warehouses from "./pages/settings/warehouse/Warehouses"
import Suppliers from "./pages/peoples/suppliers/Suppliers"
import Customers from "./pages/peoples/customers/Customers"

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
    ]
  }
]

const App = () => {
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export default App