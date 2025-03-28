import { createBrowserRouter, RouterProvider } from "react-router"
import { PDFViewer } from '@react-pdf/renderer'
import Login from "./pages/auth/Login"
import Dashboard from "./pages/dashboard/Dashboard"
import Users from "./pages/peoples/user/Users"
import Warehouses from "./pages/settings/warehouse/Warehouses"
import Suppliers from "./pages/peoples/suppliers/Suppliers"
import Customers from "./pages/peoples/customers/Customers"
import Category from "./pages/product/category/Category"
import Home from "./pages/dashboard/Home"
import Brand from "./pages/product/brand/Brand"
import Products from "./pages/product/Products"
import Product from './pages/product/Product'
import Units from "./pages/product/units/Units"
import { PDF_Page } from './components/component'


const App = () => {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <PDF_Page />
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
        },
        {
          path: '/dashboard/product/unit',
          element: <Units />
        },
        {
          path: '/dashboard/products',
          element: <Products />
        },
        {
          path: '/dashboard/add/product',
          element: <Product />
        },
        {
          path: '/dashboard/product/:id',
          element: <Product />
        }
      ],
    }
  ])
  return <RouterProvider router={router} />
}

export default App